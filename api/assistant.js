/**
 * Vercel Serverless Function — защищённый прокси к YandexGPT API.
 * Хранит ключи авторизации на сервере, исключая их утечку в клиентский бандл,
 * включает ограничение частоты запросов (Rate Limiting) и санитизацию входных данных.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const ipRequests = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const record = ipRequests.get(ip);
  if (!record || now - record.start > RATE_LIMIT_WINDOW_MS) {
    ipRequests.set(ip, { start: now, count: 1 });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count += 1;
  return true;
}

function sanitizeInput(val, maxLen = 2000) {
  if (typeof val !== "string") return "";
  return val
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
}

export default async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const clientIp =
    (req.headers?.["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "Too Many Requests",
      text: "Слишком много запросов к AI-помощнику. Пожалуйста, подождите минуту.",
    });
  }

  const apiKey = process.env.YANDEX_API_KEY || process.env.VITE_YANDEX_API_KEY || "";
  const iamToken = process.env.YANDEX_IAM_TOKEN || process.env.VITE_YANDEX_IAM_TOKEN || "";
  const folderId = process.env.YANDEX_FOLDER_ID || process.env.VITE_YANDEX_FOLDER_ID || "";

  if (!folderId || (!apiKey && !iamToken)) {
    return res.status(503).json({
      configured: false,
      text: "AI отключён в предпросмотре (не заданы серверные ключи YandexGPT).",
    });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const userQuery = sanitizeInput(body.userQuery, 2000);
  const customSystemPrompt = body.customSystemPrompt
    ? sanitizeInput(body.customSystemPrompt, 1000)
    : null;

  if (!userQuery) {
    return res.status(400).json({ error: "Empty query" });
  }

  const model = process.env.YANDEX_GPT_MODEL || process.env.VITE_YANDEX_GPT_MODEL || "yandexgpt-lite";
  const modelUri =
    process.env.YANDEX_GPT_MODEL_URI ||
    process.env.VITE_YANDEX_GPT_MODEL_URI ||
    `gpt://${folderId}/${model}/latest`;

  const defaultSystemPrompt =
    "Ты — главный инженер компании 'Воздух НСК'. Отвечай кратко и профессионально.";

  const payload = {
    modelUri,
    completionOptions: {
      stream: false,
      temperature: 0.3,
      maxTokens: "800",
    },
    messages: [
      { role: "system", text: customSystemPrompt || defaultSystemPrompt },
      { role: "user", text: userQuery },
    ],
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey ? `Api-Key ${apiKey}` : `Bearer ${iamToken}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        text: "Извините, сервис временно недоступен.",
      });
    }

    const data = await response.json();
    const text =
      data?.result?.alternatives?.[0]?.message?.text ||
      "Извините, сервис временно недоступен.";

    return res.status(200).json({ text });
  } catch {
    return res.status(502).json({
      text: "Произошла ошибка связи с сервером YandexGPT.",
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
