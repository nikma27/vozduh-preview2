# n8n — приём заявок

## Вариант 1: Без Docker (проще)

Если Docker ещё не установлен или не запущен:

```bash
npm run n8n:run
```

n8n откроется на **http://localhost:5678**. При первом запуске создайте аккаунт.

---

## Вариант 2: С Docker

```bash
# Запустить
npm run n8n

# Остановить
npm run n8n:stop
```

---

## Импорт workflow и настройка

1. Откройте **http://localhost:5678**
2. Создайте аккаунт (если ещё нет)
3. **Workflows** → ⋮ → **Import from File** → выберите `docs/n8n-lead-workflow.json`
4. Включите workflow (Inactive → **Active**)
5. Проверьте, что `.env` содержит: `VITE_LEAD_API=http://localhost:5678/webhook/lead`

---

## Проверка

```bash
npm run dev
```

Откройте сайт, отправьте тестовую заявку. В n8n: **Executions** — появятся входящие данные.
