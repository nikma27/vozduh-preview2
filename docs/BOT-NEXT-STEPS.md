# Следующие шаги: Telegram-бот

Проект бота **vozduh-tg-bot-ing** создан в `c:\Projects\vozduh-tg-bot-ing`. Инструкция по запуску.

## 1. Создать бота в Telegram

1. Открой [@BotFather](https://t.me/BotFather)
2. Отправь `/newbot`
3. Введи имя (например: «Воздух НСК Консультант»)
4. Введи username (например: `vozduh_nsk_bot`)
5. Скопируй выданный **токен**

## 2. Настроить и запустить бота

```bash
cd c:\Projects\vozduh-tg-bot-ing
copy .env.example .env
# Открой .env и вставь:
#   TELEGRAM_BOT_TOKEN=твой_токен
#   GEMINI_API_KEY=твой_ключ_gemini  (опционально, для AI-ответов)

npm install
npm start
```

## 3. Создать репозиторий на GitHub

1. На [github.com](https://github.com) → New repository → имя `vozduh-tg-bot-ing`
2. В терминале:

```bash
cd c:\Projects\vozduh-tg-bot-ing
git remote add origin https://github.com/ТВОЙ_ЛОГИН/vozduh-tg-bot-ing.git
git branch -M main
git push -u origin main
```

## 4. Связать бота с сайтом

В `.env` основного проекта (vozduh-updated-fixed3photo) добавь:

```
VITE_TG_BOT_LINK=https://t.me/ТВОЙ_BOT_USERNAME
```

Кнопка «Воспользуйтесь нашим универсальным ТГ ботом» будет вести на твоего бота.

## 5. Gemini API — AI-ответы бота

Без ключа бот отвечает заглушкой. Для умных ответов:

1. Открой [Google AI Studio](https://aistudio.google.com/apikey)
2. Войди в Google-аккаунт → **Create API Key**
3. Скопируй ключ и добавь в `vozduh-tg-bot-ing/.env`:
   ```
   GEMINI_API_KEY=твой_ключ
   ```
4. Перезапусти бота (`Ctrl+C`, затем `npm start`)

## 6. Деплой бота (24/7)

Для постоянной работы разверни бота на:
- [Railway](https://railway.app)
- [Render](https://render.com)
- VPS (DigitalOcean, Timeweb и т.п.)

Укажи `TELEGRAM_BOT_TOKEN` и `GEMINI_API_KEY` в переменных окружения сервиса.
