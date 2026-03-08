/**
 * Отправка заявки (контакт, лид, партнёр).
 * URL задаётся через VITE_LEAD_API — полный адрес (например, n8n Webhook или ваш API).
 * Если API не задан:
 * - в dev: возвращаем "mocked", чтобы демо не ломалось;
 * - в prod: бросаем ошибку, чтобы не терять лиды "молча".
 */
export const postLead = async (lead) => {
  const url = import.meta.env.VITE_LEAD_API;
  if (!url) {
    if (import.meta.env.DEV) {
      return { ok: true, mocked: true };
    }
    throw new Error("Lead API is not configured. Set VITE_LEAD_API.");
  }

  // Не отправляем query/hash, чтобы случайно не утекали URL-параметры.
  const page = `${window.location.origin}${window.location.pathname}`;
  const payload = { ...lead, page };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      throw new Error(`Lead API error: ${resp.status} ${t}`);
    }

    // Некоторые webhook-обработчики возвращают plain-text/empty.
    const contentType = resp.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return resp.json();
    }
    const text = await resp.text().catch(() => "");
    return { ok: true, text };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Lead API timeout. Please try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};
