# Воздух НСК — сайт (Vite + React + Tailwind)

## Что добавлено в этой версии
- Шрифты **Roboto / Roboto Mono** (Google Fonts).
- **Быстрый калькулятор**: ориентировочный расчёт воздухообмена (приток/вытяжка) и мощности кондиционера.
- В шапке: **Проектирование • Поставка • Монтаж • Сервис**.
- «**Услуги под ключ**» — каждая карточка открывает **информационное окно**.
- Исправлено: модалка **AI-генератора ТЗ** теперь корректно затемняет фон и крестик закрывает окно.
## Быстрый калькулятор
Можно открыть по ссылке:
- `/?calc=1&tab=vent` — вентиляция
- `/?calc=1&tab=ac` — кондиционер

## Запуск локально
```bash
npm ci
npm run dev
```

## Сборка
```bash
npm run build
npm run preview
```

## Vercel
В корне есть `vercel.json` с rewrite для SPA-роутинга (чтобы лендинги открывались по прямым ссылкам).
Деплой выполняется через **Vercel Git Integration** (один стабильный путь).
GitHub Actions в репозитории выполняет только CI-проверки (`lint`, `test`, `build`).

**Публичные ссылки:**
- Production: https://vozduh-preview2.vercel.app

## Переменные окружения (опционально)
Создай файл `.env`:
```
VITE_LEAD_API=https://your-api.example.com
VITE_YANDEX_FOLDER_ID=...
VITE_YANDEX_API_KEY=...
# или VITE_YANDEX_IAM_TOKEN=...
VITE_YANDEX_GPT_MODEL=yandexgpt-lite
```
