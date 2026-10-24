// NOTE: Историческое имя файла/функции сохранено для обратной совместимости импортов.
// В production запросы идут через защищённый серверный роут /api/assistant (без утечки ключей в браузер).
// В локальном dev-режиме при отсутствии serverless-роута предусмотрен безопасный dev-fallback.
export const fetchGeminiResponse = async (userQuery, customSystemPrompt = null) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    // 1. Обращаемся к серверному прокси /api/assistant
    const proxyRes = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userQuery, customSystemPrompt }),
      signal: controller.signal,
    });

    const contentType = proxyRes.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await proxyRes.json();
      if (data?.text) return data.text;
    }

    // 2. Fallback только для локального Vite dev-сервера (в production ветка вырезается при сборке)
    if (import.meta.env.DEV) {
      const apiKey = import.meta.env.VITE_YANDEX_API_KEY || "";
      const iamToken = import.meta.env.VITE_YANDEX_IAM_TOKEN || "";
      const folderId = import.meta.env.VITE_YANDEX_FOLDER_ID || "";

      if (!folderId) {
        return "AI отключён в предпросмотре (не задан YANDEX_FOLDER_ID).";
      }
      if (!apiKey && !iamToken) {
        return "AI отключён в предпросмотре (не задан YANDEX_API_KEY или YANDEX_IAM_TOKEN).";
      }

      const model = import.meta.env.VITE_YANDEX_GPT_MODEL || "yandexgpt-lite";
      const modelUri =
        import.meta.env.VITE_YANDEX_GPT_MODEL_URI || `gpt://${folderId}/${model}/latest`;

      const defaultSystemPrompt =
        "Ты — главный инженер компании 'Воздух НСК'. Отвечай кратко и профессионально.";

      const response = await fetch(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey ? `Api-Key ${apiKey}` : `Bearer ${iamToken}`,
          },
          body: JSON.stringify({
            modelUri,
            completionOptions: { stream: false, temperature: 0.3, maxTokens: "800" },
            messages: [
              { role: "system", text: customSystemPrompt || defaultSystemPrompt },
              { role: "user", text: userQuery },
            ],
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`YandexGPT API error: ${response.status}`);
      }

      const data = await response.json();
      return (
        data?.result?.alternatives?.[0]?.message?.text ||
        "Извините, сервис временно недоступен."
      );
    }

    return "Извините, сервис временно недоступен.";
  } catch {
    return "Произошла ошибка связи с сервером YandexGPT.";
  } finally {
    window.clearTimeout(timeoutId);
  }
};
