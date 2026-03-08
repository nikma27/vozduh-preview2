# Автоматический деплой на Vercel

## Единый стабильный путь (рекомендуется): Vercel + Git Integration

В проекте оставлен один источник деплоя: интеграция Vercel с GitHub.
GitHub Actions выполняет только CI-проверки (`lint`, `test`, `build`) и не деплоит.

### Настройка один раз

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

После этого каждый `git push` в `main` автоматически обновляет production на Vercel.

### Рабочий цикл сейчас

1. Вы пушите код в `main`.
2. GitHub Actions запускает CI (качество кода).
3. Vercel Git Integration независимо выполняет деплой.

### Как проверить деплой

1. Откройте проект в Vercel Dashboard.
2. Проверьте, что последний deployment имеет статус `Ready`.
3. Откройте production-домен (например, `https://vozduh-preview2.vercel.app`).
