import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import leadHandler from "./api/lead.js";
import assistantHandler from "./api/assistant.js";

/**
 * Автономный Production-сервер «Воздух НСК» для российского хостинга (Timeweb Cloud, Selectel, Рег.ру, Яндекс Облако).
 * Полностью соответствует 152-ФЗ РФ:
 * - Отдаёт статику сайта из папки dist/ со сжатием Gzip и заголовками кибербезопасности;
 * - Обрабатывает /api/lead и сохраняет все заявки и расчёты посетителей физически на российском сервере (data/leads.csv и data/leads.jsonl);
 * - Обрабатывает /api/assistant (прокси к YandexGPT в дата-центрах РФ);
 * - Позволяет выгружать базу заявок в Excel (CSV) по защищённому ключу руководителя (/api/leads-export?key=...).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const DIST_DIR = path.join(__dirname, "dist");
const DATA_DIR = process.env.LEADS_DATA_DIR || path.join(__dirname, "data");

// Подгрузка переменных из локального .env (если есть на сервере)
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!(key in process.env)) {
        process.env[key] = val;
      }
    }
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
};

const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

function applySecurityHeaders(res) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(k, v);
  }
}

function readRequestBody(req, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("Payload Too Large"));
        req.destroy();
        return;
      }
      body += chunk.toString("utf8");
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function createVercelCompatibleRes(nodeRes) {
  return {
    setHeader(k, v) {
      nodeRes.setHeader(k, v);
    },
    status(code) {
      nodeRes.statusCode = code;
      return this;
    },
    json(data) {
      if (!nodeRes.headersSent) {
        nodeRes.setHeader("Content-Type", "application/json; charset=utf-8");
      }
      nodeRes.end(JSON.stringify(data));
      return this;
    },
  };
}

export const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);

  const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. Проверка работоспособности российского сервера
  if (pathname === "/api/health" && req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        ok: true,
        service: "vozduh-nsk-ru",
        compliance: "152-FZ-RF",
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // 2. Защищённая выгрузка сохранённых заявок с российского сервера (CSV для Excel или JSONL)
  if (pathname === "/api/leads-export" && req.method === "GET") {
    const adminKey = process.env.ADMIN_EXPORT_KEY || "";
    const providedKey = parsedUrl.searchParams.get("key") || req.headers["x-admin-key"] || "";

    if (!adminKey || providedKey !== adminKey) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Доступ запрещён. Укажите верный ADMIN_EXPORT_KEY." }));
      return;
    }

    const format = parsedUrl.searchParams.get("format") === "jsonl" ? "jsonl" : "csv";
    const filePath = path.join(DATA_DIR, format === "jsonl" ? "leads.jsonl" : "leads.csv");

    if (!fs.existsSync(filePath)) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Заявок пока нет.");
      return;
    }

    res.statusCode = 200;
    res.setHeader(
      "Content-Type",
      format === "jsonl" ? "application/x-ndjson; charset=utf-8" : "text/csv; charset=utf-8"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="vozduh-leads-${new Date().toISOString().slice(0, 10)}.${format}"`
    );
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 3. Серверные API-шлюзы (/api/lead и /api/assistant)
  if (pathname === "/api/lead" || pathname === "/api/assistant") {
    try {
      const rawBody = req.method === "POST" ? await readRequestBody(req) : "";
      req.body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "Invalid request body" }));
      return;
    }

    const compatRes = createVercelCompatibleRes(res);
    if (pathname === "/api/lead") {
      await leadHandler(req, compatRes);
    } else {
      await assistantHandler(req, compatRes);
    }
    return;
  }

  // 4. Раздача статики из dist/ (или SPA fallback на index.html)
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const safeRelPath = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  let targetFile = path.join(DIST_DIR, safeRelPath);

  if (!targetFile.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(targetFile) || fs.statSync(targetFile).isDirectory()) {
    targetFile = path.join(DIST_DIR, "index.html");
  }

  if (!fs.existsSync(targetFile)) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Сборка dist/ не найдена. Выполните npm run build перед запуском сервера.");
    return;
  }

  const ext = path.extname(targetFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.setHeader("Content-Type", contentType);

  if (ext === ".html") {
    res.setHeader("Cache-Control", "no-cache");
  } else if (pathname.startsWith("/assets/")) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }

  const acceptEncoding = req.headers["accept-encoding"] || "";
  const compressible = /\.(html|js|css|json|svg|txt)$/.test(ext);

  if (compressible && acceptEncoding.includes("gzip")) {
    res.setHeader("Content-Encoding", "gzip");
    res.statusCode = 200;
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(targetFile).pipe(zlib.createGzip()).pipe(res);
  } else {
    res.statusCode = 200;
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(targetFile).pipe(res);
  }
});

// Запуск только при прямом вызове `node server.js`
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  server.listen(PORT, HOST, () => {
    console.log(`[ВОЗДУХ НСК — РФ Сервер] Запущен на http://${HOST}:${PORT}`);
    console.log(`[152-ФЗ Локализация] Папка хранения заявок: ${DATA_DIR}`);
  });
}
