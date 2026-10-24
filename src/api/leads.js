const DRAFT_STORAGE_KEY = "vozduh_visitor_draft_v1";
const BACKUP_STORAGE_KEY = "vozduh_leads_backup_v1";
const PENDING_STORAGE_KEY = "vozduh_leads_pending_v1";
const UTM_STORAGE_KEY = "vozduh_utm_v1";

/**
 * Очистка пользовательского текста от управляющих символов и инъекций тегов
 */
export const sanitizeText = (val, maxLen = 1000) => {
  if (typeof val !== "string") return "";
  return val
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
};

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
 * Безопасное чтение/запись черновика форм посетителя (чтобы не терялись введённые данные при закрытии окна)
 */
export const getLeadDraft = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return {};
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveLeadDraft = (patch) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const current = getLeadDraft();
    const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }
};

/**
 * Захват и сохранение рекламных UTM-меток при входе посетителя на сайт
 */
export const captureUtmParams = () => {
  try {
    if (typeof window === "undefined") return {};
    const sp = new URLSearchParams(window.location.search || "");
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const found = {};
    for (const k of keys) {
      const val = sp.get(k);
      if (val) found[k] = sanitizeText(val, 150);
    }
    if (Object.keys(found).length > 0 && window.sessionStorage) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
      return found;
    }
    if (window.sessionStorage) {
      const saved = window.sessionStorage.getItem(UTM_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return found;
  } catch {
    return {};
  }
};

/**
 * Резервное сохранение отправленной заявки (локальный журнал + очередь при обрыве связи)
 */
const appendToStorageList = (key, item, maxItems = 50) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const raw = window.localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(list) ? [...list, item].slice(-maxItems) : [item];
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
};

export const getSavedLeadsBackup = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const raw = window.localStorage.getItem(BACKUP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Автоматическая доотправка заявок из офлайн-очереди при восстановлении связи
 */
export const flushPendingLeads = async () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return 0;
    const raw = window.localStorage.getItem(PENDING_STORAGE_KEY);
    const pending = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(pending) || pending.length === 0) return 0;

    const remaining = [];
    let sentCount = 0;

    for (const item of pending) {
      try {
        await sendPayloadToBackend(item);
        sentCount += 1;
      } catch {
        remaining.push(item);
      }
    }

    window.localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(remaining));
    return sentCount;
  } catch {
    return 0;
  }
};

async function sendPayloadToBackend(payload) {
  const directWebhookUrl = import.meta.env?.VITE_LEAD_API;
  const endpoint = directWebhookUrl || "/api/lead";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      throw new Error(`Lead API error: ${resp.status} ${t}`);
    }

    const contentType = resp.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await resp.json();
    }
    const text = await resp.text().catch(() => "");
    return { ok: true, text };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Отправка заявки (контакт, лид с расчётами калькулятора/ТЗ, анкета партнёра).
 * Гарантирует валидацию, очистку от инъекций, сохранение резервной копии всех введённых параметров
 * и отправку через защищённый серверный шлюз /api/lead (или прямой VITE_LEAD_API).
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

  const page =
    typeof window !== "undefined" && window.location
      ? `${window.location.origin}${window.location.pathname}`
      : "";
  const utm = captureUtmParams();
  const submittedAt = new Date().toISOString();

  const payload = {
    ...cleanLead,
    name: cleanLead.name ? sanitizeText(cleanLead.name, 120) : "",
    context: cleanLead.context ? sanitizeText(cleanLead.context, 250) : "Заявка с сайта",
    page,
    utm: Object.keys(utm).length > 0 ? utm : undefined,
    submittedAt,
  };

  // Всегда сохраняем резервную копию данных посетителя локально, чтобы данные не пропали ни при каких сбоях
  appendToStorageList(BACKUP_STORAGE_KEY, payload);
  if (payload.name || payload.phone) {
    saveLeadDraft({
      name: payload.name || undefined,
      phone: payload.phone || undefined,
    });
  }

  const hasDirectUrl = Boolean(import.meta.env?.VITE_LEAD_API);
  if (import.meta.env?.DEV && !hasDirectUrl) {
    return { ok: true, mocked: true, savedBackup: true };
  }

  try {
    return await sendPayloadToBackend(payload);
  } catch (error) {
    // Сохраняем в офлайн-очередь для автоматической доотправки при восстановлении соединения
    appendToStorageList(PENDING_STORAGE_KEY, payload);

    if (error?.name === "AbortError") {
      throw new Error("Превышено время ожидания сервера. Ваши данные сохранены, попробуйте ещё раз.");
    }
    throw error;
  }
};
