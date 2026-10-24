/**
 * Форматирование телефонного номера к виду +7 (XXX) XXX-XX-XX
 */
export const formatPhoneInput = (raw) => {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";

  let normalized = digits;
  if (normalized[0] === "8") {
    normalized = "7" + normalized.slice(1);
  } else if (normalized[0] !== "7") {
    normalized = "7" + normalized;
  }
  normalized = normalized.slice(0, 11);

  const p1 = normalized.slice(1, 4);
  const p2 = normalized.slice(4, 7);
  const p3 = normalized.slice(7, 9);
  const p4 = normalized.slice(9, 11);

  let result = "+7";
  if (p1) result += ` (${p1}`;
  if (p1.length === 3 && p2) result += `) ${p2}`;
  if (p3) result += `-${p3}`;
  if (p4) result += `-${p4}`;
  return result;
};

/**
 * Проверка корректности номера (минимум 10–11 цифр)
 */
export const isValidPhone = (raw) => {
  const digits = String(raw || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

/**
 * Отправка заявки (контакт, лид, партнёр).
 * URL задаётся через VITE_LEAD_API — полный адрес (например, n8n Webhook или ваш API).
 * Если API не задан:
 * - в dev: возвращаем "mocked", чтобы демо не ломалось;
 * - в prod: бросаем ошибку, чтобы не терять лиды "молча".
 */
export const postLead = async (lead) => {
  // Антиспам: если скрытое honeypot-поле заполнено ботом — тихо игнорируем
  if (lead?.hp) {
    return { ok: true, mocked: true };
  }

  const cleanLead = { ...lead };
  delete cleanLead.hp;

  if (cleanLead.phone !== undefined && !isValidPhone(cleanLead.phone)) {
    throw new Error("Пожалуйста, введите корректный номер телефона (10 цифр).");
  }

  const url = import.meta.env.VITE_LEAD_API;
  if (!url) {
    if (import.meta.env.DEV) {
      return { ok: true, mocked: true };
    }
    throw new Error("Lead API is not configured. Set VITE_LEAD_API.");
  }

  // Не отправляем query/hash, чтобы случайно не утекали URL-параметры.
  const page = `${window.location.origin}${window.location.pathname}`;
  const payload = { ...cleanLead, page };

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
      throw new Error("Превышено время ожидания сервера. Попробуйте ещё раз.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};
