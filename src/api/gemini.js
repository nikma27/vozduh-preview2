// NOTE: Историческое имя файла/функции сохранено для обратной совместимости импортов.
// Реализация ниже использует YandexGPT API.
export const fetchGeminiResponse = async (userQuery, customSystemPrompt = null) => {
  const apiKey = import.meta.env.VITE_YANDEX_API_KEY || "";
  const iamToken = import.meta.env.VITE_YANDEX_IAM_TOKEN || "";
  const folderId = import.meta.env.VITE_YANDEX_FOLDER_ID || "";

  if (!folderId) {
    return "AI отключён в предпросмотре (не задан VITE_YANDEX_FOLDER_ID).";
  }
  if (!apiKey && !iamToken) {
    return "AI отключён в предпросмотре (не задан VITE_YANDEX_API_KEY или VITE_YANDEX_IAM_TOKEN).";
  }

  const model = import.meta.env.VITE_YANDEX_GPT_MODEL || "yandexgpt-lite";
  const modelUri =
    import.meta.env.VITE_YANDEX_GPT_MODEL_URI || `gpt://${folderId}/${model}/latest`;
  const url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

  const defaultSystemPrompt =
    "Ты — главный инженер компании 'Воздух НСК'. Отвечай кратко и профессионально.";
  const systemPromptToUse = customSystemPrompt || defaultSystemPrompt;

  const payload = {
    modelUri,
    completionOptions: {
      stream: false,
      temperature: 0.3,
      maxTokens: "800",
    },
    messages: [
      { role: "system", text: systemPromptToUse },
      { role: "user", text: userQuery },
    ],
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
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
      throw new Error(errText || `YandexGPT API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.result?.alternatives?.[0]?.message?.text;
    return text || "Извините, сервис временно недоступен.";
  } catch {
    return "Произошла ошибка связи с сервером YandexGPT.";
  } finally {
    window.clearTimeout(timeoutId);
  }
};
