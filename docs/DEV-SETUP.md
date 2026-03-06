# Настройка среды разработки

## Рекомендуемые расширения (Cursor / VS Code)

При открытии проекта Cursor предложит установить расширения из `.vscode/extensions.json`:

- **ESLint** — линтинг кода
- **Prettier** — форматирование
- **Tailwind CSS IntelliSense** — автодополнение классов Tailwind
- **ES7+ React Snippets** — сниппеты для React
- **Docker** — работа с контейнерами (n8n)

## Рабочие настройки (.vscode/settings.json)

- Форматирование при сохранении (Prettier)
- Автоисправление ESLint при сохранении
- Tab = 2 пробела
- Удаление пробелов в конце строк
- Добавление пустой строки в конце файла
- Tailwind IntelliSense для JSX

## EditorConfig

Проект использует `.editorconfig` для единого стиля во всех редакторах.

## Команды

| Команда | Описание |
|--------|----------|
| `npm run dev` | Запуск dev‑сервера (Vite) |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Просмотр сборки |
| `npm run lint` | Проверка кода (ESLint) |
| `npm run format` | Форматирование (Prettier) |

## Переменные окружения

Скопируйте `.env.example` в `.env` и при необходимости задайте:

- `VITE_LEAD_API` — URL вебхука для заявок (n8n)
- `VITE_GEMINI_API_KEY` — ключ для AI‑генератора ТЗ
