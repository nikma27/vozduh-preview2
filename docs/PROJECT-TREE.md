# Дерево-скелет проекта Воздух НСК

```
vozduh-updated-fixed3photo/
│
├── .cursor/
│   └── rules/
│       └── educational-mode.mdc    # Правило: развёрнутые объяснения для обучения
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: деплой на Vercel при push в main
│
├── .vscode/
│   ├── settings.json               # Настройки редактора (форматирование, ESLint)
│   └── extensions.json             # Рекомендуемые расширения
│
├── docs/
│   ├── ARCHITECTURE.md             # Архитектура приложения (Mermaid-диаграммы)
│   ├── AUDIT-2025-03.md            # Аудит март 2025
│   ├── AUDIT-REPORT.md             # Отчёт аудита
│   ├── DEV-SETUP.md                # Настройка среды разработки
│   ├── N8N-SETUP.md                # Настройка n8n для заявок
│   ├── n8n-lead-workflow.json      # Workflow для импорта в n8n
│   └── PROJECT-TREE.md             # Этот файл — дерево проекта
│
├── public/                         # Статические файлы (копируются в dist как есть)
│   ├── photos/                     # Фоны секций (Hero, Engineering)
│   │   ├── photo_10_2026-03-02_12-37-33.jpg
│   │   ├── photo_5_2026-03-02_12-38-04.jpg
│   │   └── turkov-bg.png
│   ├── nashi/                      # Фото «Наши работы» (~60 файлов)
│   ├── turkov-catalogue-images/    # Изображения каталога TURKOV
│   │   ├── Cover_bg_8.webp
│   │   └── turkov-img-*.jpg
│   ├── icons/                      # SVG-иконки (ветер, термометр, и т.д.)
│   └── articles/                   # Иллюстрации к статьям
│
├── scripts/
│   └── extract-pdf-images.js      # Утилита извлечения изображений из PDF
│
├── src/
│   ├── main.jsx                    # Точка входа: монтирует React в #root
│   ├── App.jsx                     # Корневой компонент (~2300 строк)
│   ├── index.css                   # Глобальные стили, Tailwind, переменные
│   │
│   ├── api/                        # Внешние API
│   │   ├── leads.js                # postLead() — отправка заявок на VITE_LEAD_API
│   │   └── gemini.js               # fetchGeminiResponse() — AI-чат (YandexGPT, legacy name)
│   │
│   ├── data/                       # Константы и справочники
│   │   ├── solutions.js            # complexSolutions — каталог решений
│   │   ├── turkov.js               # turkovCategories — каталог TURKOV
│   │   ├── articles.js             # ARTICLES — список статей
│   │   ├── presets.js              # VENT_PRESETS, AC_PRESETS — калькулятор
│   │   └── services.js             # SERVICE_INFO — карточки сервиса
│   │
│   └── components/
│       ├── BrandMarquee.jsx        # Бегущая строка брендов
│       └── WorksMarquee.jsx        # Горизонтальный скролл «Наши работы»
│
├── .editorconfig                   # Стиль кода (отступы, кодировка)
├── .env.example                    # Пример переменных окружения
├── .gitignore
├── .prettierrc                     # Настройки Prettier
├── .prettierignore
├── docker-compose.yml              # n8n в Docker
├── eslint.config.js                # ESLint (flat config)
├── index.html                      # HTML-шаблон, точка входа для Vite
├── package.json                    # Зависимости и скрипты
├── package-lock.json
├── postcss.config.cjs              # PostCSS (Tailwind)
├── tailwind.config.cjs             # Конфиг Tailwind
├── vercel.json                     # Настройки Vercel, SPA rewrites
├── vite.config.js                  # Конфиг Vite
│
├── AGENTS.md                       # Инструкции для Cursor Cloud
├── AUDIT-MOBILE-SCROLL.md          # Аудит мобильной прокрутки
├── DEPLOY.md                       # Инструкции по деплою
└── README.md                       # Описание проекта
```

## Связи между ключевыми частями

| Файл / папка | Связи | Назначение |
|--------------|-------|------------|
| `main.jsx` | → `App.jsx`, `index.css` | Запуск React-приложения |
| `App.jsx` | → `api/`, `data/`, `components/` | Сборка UI, модалки, секции |
| `index.html` | → `main.jsx` (через Vite) | Корневая HTML-страница |
| `vite.config.js` | → `index.html`, `src/` | Сборка и dev-сервер |
| `postcss.config.cjs` | → `tailwind.config.cjs` | Обработка CSS |
| `leads.js` | → `VITE_LEAD_API` (n8n) | Отправка заявок |
| `gemini.js` | → `VITE_YANDEX_FOLDER_ID` + (`VITE_YANDEX_API_KEY`/`VITE_YANDEX_IAM_TOKEN`) | AI-помощник |

## Команды

| Команда | Действие |
|---------|----------|
| `npm run dev` | Запуск dev-сервера (Vite) |
| `npm run build` | Сборка в `dist/` |
| `npm run preview` | Просмотр собранного проекта |
| `npm run lint` | Проверка кода ESLint |
| `npm run format` | Форматирование Prettier |
| `npm run n8n` | Запуск n8n в Docker |
