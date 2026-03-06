# Подключение Yandex GPT API к Telegram-боту

Пошаговая инструкция для интеграции Yandex GPT в бота vozduh-tg-bot-ing.

## 1. Создание ресурсов в Yandex Cloud

### 1.1. Регистрация и каталог

1. Открой [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Войди или зарегистрируйся
3. Создай **каталог** (или выбери существующий)
4. Скопируй **Folder ID** (идентификатор каталога) — он понадобится для API

### 1.2. Сервисный аккаунт

1. В каталоге: **Сервисные аккаунты** → **Создать сервисный аккаунт**
2. Укажи имя (например: `yandex-gpt-bot`)
3. Назначь роль: **ai.languageModels.user**
4. Сохрани

### 1.3. API-ключ

1. Открой созданный сервисный аккаунт
2. Вкладка **API-ключи** → **Создать API-ключ**
3. Скопируй ключ сразу — он показывается один раз

## 2. Переменные окружения

В `.env` бота добавь:

```env
YANDEX_FOLDER_ID=b1gxxxxxxxxxxxxxxxxxx
YANDEX_API_KEY=AQVNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 3. Код интеграции (Node.js)

### 3.1. Функция запроса к Yandex GPT

```javascript
/**
 * Запрос к Yandex GPT API (синхронный completion)
 * @param {string} userMessage - сообщение пользователя
 * @param {string} systemPrompt - системный промпт (роль бота)
 * @returns {Promise<string>} - ответ модели
 */
async function askYandexGPT(userMessage, systemPrompt = "Ты — консультант по вентиляции и кондиционированию. Отвечай кратко и по делу.") {
  const folderId = process.env.YANDEX_FOLDER_ID;
  const apiKey = process.env.YANDEX_API_KEY;

  if (!folderId || !apiKey) {
    return "Yandex GPT не настроен. Добавь YANDEX_FOLDER_ID и YANDEX_API_KEY в .env";
  }

  const url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
  const modelUri = `gpt://${folderId}/yandexgpt-lite/latest`;

  const body = {
    modelUri,
    completionOptions: {
      stream: false,
      temperature: 0.6,
      maxTokens: 1000,
    },
    messages: [
      { role: "system", text: systemPrompt },
      { role: "user", text: userMessage },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Api-Key ${apiKey}`,
      "x-folder-id": folderId,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Yandex GPT error:", response.status, err);
    return "Извините, не удалось получить ответ. Попробуйте позже.";
  }

  const data = await response.json();
  const text = data?.result?.alternatives?.[0]?.message?.text;
  return text || "Не удалось сформировать ответ.";
}
```

### 3.2. Использование в Telegram-боте

```javascript
// Пример для node-telegram-bot-api
bot.on("message", async (msg) => {
  const text = msg.text;
  if (!text) return;

  const chatId = msg.chat.id;
  await bot.sendChatAction(chatId, "typing");

  try {
    const reply = await askYandexGPT(text);
    await bot.sendMessage(chatId, reply);
  } catch (e) {
    console.error(e);
    await bot.sendMessage(chatId, "Произошла ошибка. Попробуйте ещё раз.");
  }
});
```

## 4. Модели Yandex GPT

| Модель | modelUri | Описание |
|--------|----------|----------|
| YandexGPT Lite | `gpt://{folderId}/yandexgpt-lite/latest` | Быстрая, для простых задач |
| YandexGPT | `gpt://{folderId}/yandexgpt/latest` | Более умная, для сложных запросов |

Для консультанта по климату подойдёт `yandexgpt-lite` — быстрее и дешевле.

## 5. Обработка ошибок

- **401** — неверный API-ключ
- **403** — нет прав у сервисного аккаунта (проверь роль `ai.languageModels.user`)
- **429** — лимит запросов (подожди или увеличь квоту в консоли)
- **500** — временная ошибка Yandex, повтори запрос

## 6. Деплой

При деплое на Railway, Render или VPS добавь переменные окружения:

- `YANDEX_FOLDER_ID`
- `YANDEX_API_KEY`

Секреты не должны попадать в git.

## Ссылки

- [Yandex GPT — документация](https://cloud.yandex.ru/docs/yandexgpt/)
- [Цены на Yandex GPT](https://cloud.yandex.ru/docs/yandexgpt/pricing)
