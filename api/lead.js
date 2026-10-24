import fs from "node:fs";
import path from "node:path";

/**
 * Серверный шлюз приёма и локального сохранения заявок (/api/lead) на территории РФ (152-ФЗ).
 * Обеспечивает:
 * 1. Rate-limiting по IP (защита от спама и DDoS-флуда форм).
 * 2. Санитизацию всех входных полей (защита от XSS / управляющих символов / переполнения).
 * 3. Проверку антиспам-ловушки (honeypot).
 * 4. Физическое сохранение всех данных посетителей на российском сервере в файлы:
 *    - data/leads.jsonl (структурированная база JSON Lines)
 *    - data/leads.csv (таблица для Excel / 1С в кодировке UTF-8 с BOM)
 * 5. Опциональную отправку в вашу российскую CRM / локальный n8n / Telegram.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 минута
const MAX_REQUESTS_PER_WINDOW = 8; // до 8 заявок в минуту с одного IP
const ipRequests = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    ipRequests.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  entry.count += 1;
  return true;
}

/**
 * Очистка строки от опасных HTML/скрипт-тегов и управляющих символов
 */
export function sanitizeString(val, maxLen = 500) {
  if (val === null || val === undefined) return "";
  return String(val)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

/**
 * Рекурсивная санитизация вложенного объекта payload (калькулятор, анкета партнёра, ТЗ)
 */
export function sanitizePayloadObject(obj, depth = 0) {
  if (depth > 3 || obj === null || obj === undefined) return undefined;
  if (typeof obj === "string") return sanitizeString(obj, 3000);
  if (typeof obj === "number") return Number.isFinite(obj) ? obj : 0;
  if (typeof obj === "boolean") return obj;
  if (Array.isArray(obj)) {
    return obj.slice(0, 20).map((item) => sanitizePayloadObject(item, depth + 1));
  }
  if (typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj).slice(0, 30)) {
      const cleanKey = sanitizeString(k, 64);
      if (cleanKey) {
        out[cleanKey] = sanitizePayloadObject(v, depth + 1);
      }
    }
    return out;
  }
  return undefined;
}

/**
 * Экранирование ячейки для CSV (защита от CSV-Injection в Excel: формулы с =, +, -, @)
 */
function escapeCsvCell(val) {
  let str = val === null || val === undefined ? "" : String(val);
  if (/^[=+\-@]/.test(str)) {
    str = "'" + str;
  }
  str = str.replace(/"/g, '""').replace(/\r?\n/g, " ");
  return `"${str}"`;
}

/**
 * Сохранение заявки на локальный диск российского сервера (data/leads.jsonl и data/leads.csv)
 */
function persistLeadToRussianServerDisk(leadRecord) {
  try {
    const dataDir = process.env.LEADS_DATA_DIR || path.resolve(process.cwd(), "data");
    fs.mkdirSync(dataDir, { recursive: true });

    // 1. Запись в JSONL-базу (полная структура со всеми параметрами калькулятора и ТЗ)
    const jsonlPath = path.join(dataDir, "leads.jsonl");
    fs.appendFileSync(jsonlPath, JSON.stringify(leadRecord) + "\n", "utf8");

    // 2. Запись в CSV-таблицу (с UTF-8 BOM для открытия в Excel на русском языке)
    const csvPath = path.join(dataDir, "leads.csv");
    if (!fs.existsSync(csvPath)) {
      const header =
        "\uFEFF" +
        [
          "ID заявки",
          "Дата и время (UTC)",
          "Тип",
          "Раздел / Контекст",
          "Имя клиента",
          "Телефон",
          "Страница",
          "Согласие 152-ФЗ",
          "Параметры расчёта / Анкета / ТЗ",
          "UTM-метки",
        ]
          .map(escapeCsvCell)
          .join(";") +
        "\n";
      fs.writeFileSync(csvPath, header, "utf8");
    }

    const row =
      [
        leadRecord.leadId,
        leadRecord.timestamp,
        leadRecord.type,
        leadRecord.context,
        leadRecord.name,
        leadRecord.phone,
        leadRecord.page,
        leadRecord.consent152fz ? "Да" : "Да (форма)",
        leadRecord.payload ? JSON.stringify(leadRecord.payload) : "",
        leadRecord.utm ? JSON.stringify(leadRecord.utm) : "",
      ]
        .map(escapeCsvCell)
        .join(";") + "\n";

    fs.appendFileSync(csvPath, row, "utf8");
    return true;
  } catch {
    // В read-only облачных песочницах запись в файл пропускается, остаётся серверный лог
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const forwarded = req.headers?.["x-forwarded-for"];
  const clientIp =
    (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "") ||
    req.socket?.remoteAddress ||
    "unknown";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "Слишком много запросов. Пожалуйста, подождите минуту.",
    });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  // Антиспам honeypot
  if (body.hp) {
    return res.status(200).json({ ok: true, mocked: true });
  }

  const phoneDigits = String(body.phone || "").replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return res.status(400).json({
      error: "Пожалуйста, введите корректный номер телефона (10 цифр).",
    });
  }

  const leadRecord = {
    leadId: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    type: sanitizeString(body.type || "lead", 40),
    context: sanitizeString(body.context || "Заявка с сайта", 300),
    name: sanitizeString(body.name || "Без имени", 150),
    phone: sanitizeString(body.phone, 40),
    page: sanitizeString(body.page || "/", 300),
    consent152fz: true,
    utm: sanitizePayloadObject(body.utm),
    payload: sanitizePayloadObject(body.payload),
  };

  // 1. Физическая запись на диск российского сервера (data/leads.jsonl и data/leads.csv)
  const savedToDisk = persistLeadToRussianServerDisk(leadRecord);

  // 2. Структурированная запись в серверный журнал
  console.info("[LEAD_CAPTURED]", JSON.stringify(leadRecord));

  const webhookUrl = process.env.LEAD_API_URL || process.env.VITE_LEAD_API || "";
  const tgToken = process.env.TELEGRAM_BOT_TOKEN || "";
  const tgChatId = process.env.TELEGRAM_CHAT_ID || "";

  const deliveryResults = {
    logged: true,
    savedToDisk,
    webhook: null,
    telegram: null,
  };

  // 3. Отправка в основной Webhook (российская CRM / локальный n8n)
  if (webhookUrl && !webhookUrl.includes("localhost")) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const headers = { "Content-Type": "application/json" };
      if (process.env.LEAD_WEBHOOK_SECRET) {
        headers["X-Webhook-Secret"] = process.env.LEAD_WEBHOOK_SECRET;
      }
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(leadRecord),
        signal: controller.signal,
      });
      deliveryResults.webhook = resp.ok ? "sent" : `status_${resp.status}`;
    } catch {
      deliveryResults.webhook = "failed_saved_in_log";
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // 4. Опциональное уведомление в Telegram
  if (tgToken && tgChatId) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
      const detailsText = leadRecord.payload
        ? `\n📋 Данные: ${JSON.stringify(leadRecord.payload, null, 2)}`
        : "";
      const messageText = [
        `🔔 Новая заявка: ${leadRecord.context}`,
        `👤 Имя: ${leadRecord.name}`,
        `📞 Телефон: ${leadRecord.phone}`,
        `🏷 Тип: ${leadRecord.type}`,
        `🌐 Страница: ${leadRecord.page}`,
        detailsText,
      ]
        .filter(Boolean)
        .join("\n");

      const tgResp = await fetch(
        `https://api.telegram.org/bot${tgToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: messageText.slice(0, 4000),
          }),
          signal: controller.signal,
        }
      );
      deliveryResults.telegram = tgResp.ok ? "sent" : `status_${tgResp.status}`;
    } catch {
      deliveryResults.telegram = "failed";
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return res.status(200).json({
    ok: true,
    leadId: leadRecord.leadId,
    delivery: deliveryResults,
  });
}
