/**
 * Отправка заявки (контакт, лид, партнёр).
 * URL задаётся через VITE_LEAD_API — полный адрес (например, n8n Webhook или ваш API).
 * Если не задан — модалки закрываются без отправки (режим предпросмотра).
 */
export const postLead = async (lead) => {
  const url = import.meta.env.VITE_LEAD_API;
  if (!url) {
    return { ok: true, mocked: true };
  }

  const payload = { ...lead, page: window.location.href };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`Lead API error: ${resp.status} ${t}`);
  }
  return resp.json();
};
