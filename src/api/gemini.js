export const fetchGeminiResponse = async (userQuery, customSystemPrompt = null) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!apiKey) return "AI отключён в предпросмотре (не задан VITE_GEMINI_API_KEY).";

  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const defaultSystemPrompt =
    "Ты — главный инженер компании 'Воздух НСК'. Отвечай кратко и профессионально.";
  const systemPromptToUse = customSystemPrompt || defaultSystemPrompt;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPromptToUse }] },
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Извините, сервис временно недоступен."
    );
  } catch {
    return "Произошла ошибка связи с сервером.";
  } finally {
    window.clearTimeout(timeoutId);
  }
};
