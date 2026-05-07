const readJsonBody = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;

  const raw = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) reject(new Error("Payload too large"));
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

  if (!raw) return null;
  return JSON.parse(raw);
};

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, message: "Method Not Allowed" });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, message: "Invalid JSON body" });
  }

  const userQuery = body?.userQuery;
  const systemPrompt = body?.systemPrompt;

  if (!userQuery || typeof userQuery !== "string") {
    return sendJson(res, 400, { ok: false, message: "Missing userQuery" });
  }

  const apiKey = process.env.YANDEX_API_KEY || "";
  const iamToken = process.env.YANDEX_IAM_TOKEN || "";
  const folderId = process.env.YANDEX_FOLDER_ID || "";

  if (!folderId) {
    return sendJson(res, 503, { ok: false, code: "AI_DISABLED", message: "AI is not configured" });
  }
  if (!apiKey && !iamToken) {
    return sendJson(res, 503, { ok: false, code: "AI_DISABLED", message: "AI is not configured" });
  }

  const model = process.env.YANDEX_GPT_MODEL || "yandexgpt-lite";
  const modelUri = process.env.YANDEX_GPT_MODEL_URI || `gpt://${folderId}/${model}/latest`;

  const payload = {
    modelUri,
    completionOptions: {
      stream: false,
      temperature: 0.3,
      maxTokens: "800",
    },
    messages: [
      { role: "system", text: typeof systemPrompt === "string" && systemPrompt ? systemPrompt : "Ты — главный инженер компании 'Воздух НСК'. Отвечай кратко и профессионально." },
      { role: "user", text: userQuery },
    ],
  };

  const controller = new AbortController();
  const timeoutMs = Number(process.env.YANDEX_TIMEOUT_MS || 15000);
  const timeoutId = setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) ? timeoutMs : 15000);

  try {
    const response = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey ? `Api-Key ${apiKey}` : `Bearer ${iamToken}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return sendJson(res, response.status, {
        ok: false,
        code: "UPSTREAM_ERROR",
        message: errText || `YandexGPT API error: ${response.status}`,
      });
    }

    const data = await response.json().catch(() => null);
    const text = data?.result?.alternatives?.[0]?.message?.text;
    return sendJson(res, 200, { ok: true, text: text || "Извините, сервис временно недоступен." });
  } catch (error) {
    const isAbort = error?.name === "AbortError";
    return sendJson(res, isAbort ? 504 : 502, {
      ok: false,
      code: isAbort ? "TIMEOUT" : "NETWORK_ERROR",
      message: isAbort ? "YandexGPT API timeout" : "YandexGPT API request failed",
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
