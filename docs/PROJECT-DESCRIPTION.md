# Воздух НСК — детальное описание проекта

## 1. Обзор

**Воздух НСК** — одностраничное веб-приложение (SPA) для компании по климатическому оборудованию. Сайт представляет услуги: проектирование, поставка, монтаж и сервис систем вентиляции, кондиционирования и дымоудаления (г. Новосибирск).

**Технологический стек:**
- **Vite 7** — сборка и dev-сервер
- **React 18** — UI
- **Tailwind CSS 3** — стили
- **Framer Motion** — анимации
- **Lucide React** — иконки

Проект **без бэкенда** — все данные статичны, заявки уходят во внешние API (n8n webhook), AI-консультант — в YandexGPT.

---

## 2. Структура проекта

```
workspace/
├── .cursor/rules/           # Правила Cursor (образовательный режим, деплой)
├── .github/workflows/       # CI (lint, test, build)
├── .vscode/                 # Настройки VS Code (ESLint, Prettier, Tailwind)
├── docs/                    # Документация
├── public/                  # Статические файлы (копируются в dist как есть)
│   ├── photos/              # Фоны секций
│   ├── nashi/               # Фото «Наши работы»
│   ├── turkov-catalogue-images/
│   ├── icons/               # SVG-иконки
│   └── articles/            # Иллюстрации к статьям
├── src/
│   ├── main.jsx             # Точка входа: React + ErrorBoundary
│   ├── App.jsx              # Корневой компонент, сборка UI и модалок
│   ├── index.css            # Глобальные стили, Tailwind, переменные
│   ├── api/                 # Внешние API
│   │   ├── leads.js         # postLead() — заявки
│   │   └── gemini.js        # fetchGeminiResponse() — YandexGPT
│   ├── data/                # Константы и справочники
│   │   ├── solutions.js     # complexSolutions — каталог решений
│   │   ├── turkov.js        # turkovCategories — каталог TURKOV
│   │   ├── presets.js       # VENT_PRESETS, AC_PRESETS — калькулятор
│   │   ├── services.js      # SERVICE_INFO — карточки сервиса
│   ├── components/          # Общие компоненты
│   ├── components/sections/ # Navbar, Hero
│   ├── features/            # Функциональные блоки
│   │   ├── assistant/       # ClimateAssistant (AI-чат)
│   │   ├── modals/          # Модальные окна (Lead, Contact, Service, Calc и др.)
│   │   └── sections/        # Catalog, TurkovPromo, ContactForm и др.
│   ├── shared/ui/           # BackToTop, Reveal
│   └── utils/               # safeExternalUrl и др.
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── vercel.json              # Настройки Vercel, SPA rewrites, headers
├── docker-compose.yml       # n8n
├── .env.example
├── AGENTS.md                # Инструкции для Cursor Cloud
├── README.md
└── DEPLOY.md
```

---

## 3. Точка входа и инициализация

1. **index.html** — HTML-шаблон. В `<body>` — `<div id="root">`, скрипт `type="module"` на `/src/main.jsx`.
2. **main.jsx** — монтирует React в `#root`, оборачивает приложение в `ErrorBoundary`, подключает `index.css`.
3. **App.jsx** — корневой компонент `MainSite`. Собирает секции, модальные окна, ассистента, управляет состоянием.

---

## 4. Секции страницы (порядок сверху вниз)

| # | Секция | Якорь | Описание |
|---|--------|-------|----------|
| 1 | Navbar | — | Шапка, навигация, кнопка «Оставить заявку» |
| 2 | Hero | — | Главный экран, фон, CTA |
| 3 | Catalog | #catalog | Комплексные решения по сегментам (life / business / industry) |
| 4 | TurkovPromo | #turkov | Каталог TURKOV |
| 5 | BrandMarquee | #manufacturers | Бегущая строка брендов |
| 6 | WorksMarquee | #works | Горизонтальный скролл «Наши работы» |
| 7 | WhyChooseUsSection | — | Услуги под ключ (Проектирование, Поставка, Монтаж, Сервис) |
| 8 | PartnersSection | #partners | Партнёрам |
| 9 | ContactForm | #contact | Контакты и форма |
| 10 | CTAstrip | — | Полоса призыва к действию |
| 11 | Footer | — | Подвал |

**Дополнительно:** плавающая кнопка «Вернуться вверх» (BackToTop) и AI-ассистент (ClimateAssistant).

---

## 5. Данные (data/)

### 5.1. complexSolutions (solutions.js)
Каталог инженерных решений по сегментам:
- **life** — жильё (кондиционирование, вентиляция, увлажнение и др.)
- **business** — коммерция (офисы, магазины, склады и др.)
- **industry** — промышленность (дымоудаление, адиабатика и др.)

Каждое решение: `id`, `segment`, `icon`, `title`, `description`, `image`, `details[]` (подпункты с кнопками «Подобрать» и «Получить смету»).

### 5.2. turkovCategories (turkov.js)
Каталог оборудования TURKOV: категории с иконками, описаниями, `infoSheets` (раскрывающиеся блоки) и списком позиций.

### 5.3. VENT_PRESETS, AC_PRESETS (presets.js)
Пресеты для быстрого калькулятора:
- **Вентиляция** — площади/типы помещений (квартира, офис, зал и т.п.)
- **Кондиционер** — площади с ориентировочной мощностью (кВт)

### 5.4. SERVICE_INFO (services.js)
Карточки услуг: Проектирование, Поставка, Монтаж, Сервис. Каждая — заголовок, описание, иконка; при клике открывается информационное модальное окно.

---

## 6. Модальные окна

| Модалка | Назначение |
|---------|------------|
| **LeadModal** | Форма заявки (контакт, контекст) |
| **ContactModal** | Быстрый контакт «Оставить заявку» |
| **PartnerModal** | Форма для партнёров |
| **BriefGeneratorModal** | AI-генератор техзадания |
| **SolutionDetailModal** | Детали инженерного решения |
| **TurkovCategoryModal** | Детали категории TURKOV |
| **TurkovCatalogModal** | Список категорий TURKOV |
| **ServiceInfoModal** | Карточка услуги (Проектирование, Поставка и т.д.) |
| **QuickCalcModal** | Быстрый калькулятор (вентиляция / кондиционер) |

---

## 7. API-слой

### 7.1. postLead (leads.js)
Отправляет заявку на `VITE_LEAD_API` (POST JSON).  
В payload добавляется `page` (origin + pathname без query/hash).  
Таймаут 8 секунд. В dev при отсутствии `VITE_LEAD_API` возвращается mocked-ответ.

### 7.2. fetchGeminiResponse (gemini.js)
Вызов YandexGPT API. Использует:
- `VITE_YANDEX_FOLDER_ID`
- `VITE_YANDEX_API_KEY` или `VITE_YANDEX_IAM_TOKEN`
- `VITE_YANDEX_GPT_MODEL` (по умолчанию `yandexgpt-lite`)

При отсутствии конфигурации возвращает текстовое сообщение о том, что AI отключён.

---

## 8. Быстрый калькулятор

Калькулятор открывается по URL:
- `/?calc=1&tab=vent` — вкладка «Вентиляция»
- `/?calc=1&tab=ac` — вкладка «Кондиционер»

При открытии/закрытии URL обновляется через `history.replaceState`, состояние синхронизируется с адресной строкой.

---

## 9. Переменные окружения

| Переменная | Назначение | Обязательна |
|------------|------------|-------------|
| `VITE_LEAD_API` | URL вебхука для заявок (n8n или свой API) | В production — да |
| `VITE_YANDEX_FOLDER_ID` | ID каталога Yandex Cloud | Для AI — да |
| `VITE_YANDEX_API_KEY` | API-ключ Yandex Cloud | Для AI (или IAM) |
| `VITE_YANDEX_IAM_TOKEN` | IAM-токен Yandex Cloud | Для AI (или API key) |
| `VITE_YANDEX_GPT_MODEL` | Модель (по умолчанию `yandexgpt-lite`) | Нет |
| `VITE_TG_BOT_LINK` | Ссылка на Telegram-бота (кнопка в контактах) | Нет |

Пример настроек — в `.env.example`.

---

## 10. Скрипты (package.json)

| Команда | Действие |
|---------|----------|
| `npm run dev` | Запуск dev-сервера Vite (порт 5173) |
| `npm run build` | Сборка в `dist/` |
| `npm run preview` | Просмотр собранного проекта |
| `npm run lint` | ESLint по `src/` |
| `npm run format` | Prettier для `src/**/*.{js,jsx,css,json,md}` |
| `npm run test` | Vitest (один прогон) |
| `npm run test:watch` | Vitest в режиме наблюдения |
| `npm run n8n` | Запуск n8n в Docker |
| `npm run n8n:stop` | Остановка n8n |
| `npm run n8n:run` | Запуск n8n через npx (без Docker) |

---

## 11. Сборка и деплой

- **Сборка:** `npm run build` → выход в `dist/`
- **Деплой:** Vercel Git Integration (push в `main` → автоматический деплой)
- **CI:** GitHub Actions при push/PR в `main` выполняет `lint`, `test`, `build`

**Vercel (vercel.json):**
- SPA rewrites: все маршруты → `index.html`
- Безопасность: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `Content-Security-Policy`

---

## 12. n8n — приём заявок

n8n используется как вебхук для приёма заявок. Сайт работает и без него (в dev — mocked ответ).

**Запуск:**
- Docker: `npm run n8n`
- Локально: `npm run n8n:run`

**Настройка:** импорт `docs/n8n-lead-workflow.json` в n8n, активация workflow.  
URL вебхука для `.env`: `http://localhost:5678/webhook/lead`.

---

## 13. Стили и шрифты

- **Шрифты:** Roboto (текст), Roboto Mono (код) — Google Fonts
- **Tailwind:** расширенные `fontFamily`, `fontSize`, `letterSpacing`, `lineHeight`
- **CSS-переменные** в `:root` для типографики (`--text-base`, `--text-h2`, и т.д.)
- **Адаптивность:** `prefers-reduced-motion`, `hover: none` для touch-устройств
- Полосы прокрутки скрыты через `::-webkit-scrollbar` и `scrollbar-width: none`

---

## 14. Тестирование

- **Vitest** + **@testing-library/react** + **jsdom**
- Конфигурация: `vitest.setup.js`, `vite.config.js` (test)
- Пример: `ErrorBoundary.test.jsx`

---

## 15. Связанная документация

| Файл | Содержание |
|------|------------|
| `README.md` | Краткое описание, запуск, сборка, Vercel |
| `AGENTS.md` | Инструкции для Cursor Cloud |
| `DEPLOY.md` | Деплой на Vercel |
| `docs/ARCHITECTURE.md` | Архитектура (Mermaid-диаграммы) |
| `docs/PROJECT-TREE.md` | Дерево файлов проекта |
| `docs/DEV-SETUP.md` | Настройка среды разработки |
| `docs/N8N-SETUP.md` | Настройка n8n для заявок |
| `docs/YANDEX-SETUP.md` | Подключение YandexGPT |

---

## 16. Публичные ссылки

- **Production:** https://codex53-audit-workflow.vercel.app

---

*Документ обновлён: март 2025*
