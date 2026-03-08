const DEFAULT_TG_LINK = "https://t.me/vozduh_nsk_bot";

/**
 * Разрешаем только безопасные Telegram-ссылки из env.
 * Защищает от случайной подстановки javascript: и других схем.
 */
export const getSafeTelegramLink = (rawValue) => {
  if (!rawValue) return DEFAULT_TG_LINK;
  try {
    const url = new URL(rawValue);
    if (url.protocol !== "https:") return DEFAULT_TG_LINK;
    if (url.hostname !== "t.me" && url.hostname !== "telegram.me") return DEFAULT_TG_LINK;
    return url.toString();
  } catch {
    return DEFAULT_TG_LINK;
  }
};
