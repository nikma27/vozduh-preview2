# Деплой бота MAX в облако (Railway)

Бот работает в облаке без локального хранения. Все данные — переменные окружения в Railway.

---

## Вариант 1. Деплой через Railway Dashboard (рекомендуется)

### Шаг 1. Получи токен бота MAX

1. Открой мессенджер **MAX** → найди **@MasterBot**
2. Отправь `/create`, следуй подсказкам
3. Скопируй выданный **токен**

### Шаг 2. Создай проект на Railway

1. Открой [railway.app](https://railway.app) → **Login** (через GitHub)
2. **New Project** → **Deploy from GitHub repo**
3. Выбери репозиторий `vozduh-preview2` (или твой репо)
4. В настройках сервиса:
   - **Root Directory:** `max-bot`
   - **Build Command:** (оставить пустым, используется `npm install` по умолчанию)
   - **Start Command:** `node index.js`

### Шаг 3. Добавь переменные окружения

В Railway: **Variables** → **Add Variable**

| Ключ | Значение |
|------|----------|
| `MAX_BOT_TOKEN` | Токен из @MasterBot |

### Шаг 4. Деплой

Нажми **Deploy**. Railway сам соберёт и запустит бота. После деплоя бот работает 24/7.

---

## Вариант 2. Автодеплой через GitHub Actions

При каждом push в `main` (если изменены файлы в `max-bot/`) бот автоматически деплоится.

### Настройка (один раз)

1. Создай проект на Railway (как в Варианте 1)
2. **Project Settings** → **Tokens** → **Create Token** → скопируй
3. В GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Имя: `RAILWAY_TOKEN`
   - Значение: токен из Railway
4. (Опционально) Если несколько проектов — добавь `RAILWAY_PROJECT_ID` и `RAILWAY_SERVICE_ID`

После этого деплой будет срабатывать автоматически при push в `main`.

---

## Вариант 3. Fly.io (альтернатива)

```bash
cd max-bot
fly auth login
fly launch   # первый раз: создать app
fly secrets set MAX_BOT_TOKEN=твой_токен
fly deploy
```

---

## Проверка работы

После деплоя в логах Railway должно быть:
```
Бот MAX «Воздух НСК» запущен. Ожидаю сообщения...
```

Напиши боту в MAX — он должен ответить.

---

## Ссылки

- [Railway Dashboard](https://railway.app/dashboard)
- [MAX Bot Setup](./MAX-BOT-SETUP.md)
- [Получение токена MAX](./MAX-BOT-SETUP.md#2-получение-токена)
