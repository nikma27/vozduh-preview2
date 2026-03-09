# Подключение Yandex GPT API к сайту

Пошаговая инструкция для встроенного в сайт AI-консультанта и AI-генератора ТЗ.

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

В `.env` основного проекта добавь:

```env
VITE_YANDEX_FOLDER_ID=b1gxxxxxxxxxxxxxxxxxx
VITE_YANDEX_API_KEY=AQVNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# или вместо API key:
# VITE_YANDEX_IAM_TOKEN=t1.xxxxxxxxx
# модель (опционально):
# VITE_YANDEX_GPT_MODEL=yandexgpt-lite
```

## 3. Где используется в проекте

- `src/api/gemini.js` - вызов Yandex GPT API (историческое имя файла сохранено).
- AI-консультант и AI-генератор ТЗ в интерфейсе сайта используют этот API-слой.

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

При деплое сайта (Vercel/другая платформа) добавь переменные окружения:

- `VITE_YANDEX_FOLDER_ID`
- `VITE_YANDEX_API_KEY` (или `VITE_YANDEX_IAM_TOKEN`)

Секреты не должны попадать в git.

## Ссылки

- [Yandex GPT — документация](https://cloud.yandex.ru/docs/yandexgpt/)
- [Цены на Yandex GPT](https://cloud.yandex.ru/docs/yandexgpt/pricing)
