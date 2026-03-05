# Автоматический деплой на Vercel

## Способ 1: Vercel + GitHub (рекомендуется)

Самый простой вариант — связать репозиторий с Vercel:

1. Создайте репозиторий на [GitHub](https://github.com/new).
2. Выполните в проекте:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ_USERNAME/ИМЯ_РЕПО.git
   git push -u origin main
   ```
3. Откройте [vercel.com](https://vercel.com) и войдите.
4. **Add New Project** → **Import Git Repository** → выберите репозиторий.
5. Настройки можно оставить по умолчанию (Vite определяется автоматически).
6. Нажмите **Deploy**.

После этого каждый `git push` в `main` будет автоматически обновлять сайт на Vercel.

---

## Способ 2: GitHub Actions

Если нужен деплой через GitHub Actions:

1. Подключите проект к Vercel:
   ```bash
   npx vercel link
   ```
   Выберите scope и создайте или привяжите проект.

2. Добавьте секреты в GitHub: **Settings** → **Secrets and variables** → **Actions**:
   - `VERCEL_TOKEN` — [Create Token](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` и `VERCEL_PROJECT_ID` — из `.vercel/project.json` после `vercel link`

3. Каждый `git push` в `main` или `master` запустит деплой.
