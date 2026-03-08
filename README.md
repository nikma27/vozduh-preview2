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

**Публичные ссылки:**
- Production: https://vozduh-preview2.vercel.app
- Последний деплой: https://vozduh-preview-mp1y-bjm211a6q-nikma27s-projects.vercel.app

## Переменные окружения (опционально)
Создай файл `.env`:
```
VITE_LEAD_API=https://your-api.example.com
VITE_GEMINI_API_KEY=...
VITE_GEMINI_MODEL=gemini-2.5-flash
```
