# Скрипт настройки деплоя на Vercel (вариант 1)
# Выполните после создания репозитория на GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl  # например: https://github.com/username/vozduh-updated-fixed3photo.git
)

Write-Host "=== Настройка Git и push в GitHub ===" -ForegroundColor Cyan

# 1. Инициализация (если ещё не инициализирован)
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Git инициализирован" -ForegroundColor Green
} else {
    Write-Host "Git уже инициализирован" -ForegroundColor Yellow
}

# 2. Ветка main
git branch -M main

# 3. Добавить все файлы
git add .
git status

# 4. Первый коммит (если есть изменения)
$status = git status --porcelain
if ($status) {
    git commit -m "Initial commit"
    Write-Host "Коммит создан" -ForegroundColor Green
} else {
    Write-Host "Нет изменений для коммита" -ForegroundColor Yellow
}

# 5. Удалить старый origin если есть
git remote remove origin 2>$null

# 6. Добавить remote
git remote add origin $RepoUrl
Write-Host "Remote добавлен: $RepoUrl" -ForegroundColor Green

# 7. Push
Write-Host "`nОтправка на GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "`n=== Готово! ===" -ForegroundColor Green
Write-Host "Теперь откройте https://vercel.com/new"
Write-Host "Import Git Repository -> выберите ваш репозиторий -> Deploy"
