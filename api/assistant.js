/**
 * Vercel Serverless Function — защищённый прокси к YandexGPT API.
 * Хранит ключи авторизации на сервере, исключая их утечку в клиентский бандл.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
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

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const userQuery = String(body.userQuery || "").trim().slice(0, 2000);
  const customSystemPrompt = body.customSystemPrompt
    ? String(body.customSystemPrompt).trim().slice(0, 1000)
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
