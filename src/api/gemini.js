export const fetchGeminiResponse = async (userQuery, customSystemPrompt = null) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("/api/yandexgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userQuery,
        systemPrompt: customSystemPrompt,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 503) {
        return "AI отключён в предпросмотре (не настроены серверные переменные окружения).";
      }
      const errText = await response.text().catch(() => "");
      throw new Error(errText || `AI gateway error: ${response.status}`);
    }

    const data = await response.json().catch(() => null);
    const text = data?.text;
    return text || "Извините, сервис временно недоступен.";
  } catch {
    return "Произошла ошибка связи с сервером YandexGPT.";
  } finally {
    window.clearTimeout(timeoutId);
  }
};
