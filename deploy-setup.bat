@echo off
chcp 65001 >nul
echo === Настройка деплоя на Vercel ===
echo.
echo 1. Создайте репозиторий на https://github.com/new
echo    (можно оставить пустым, не добавляйте README)
echo.
set /p REPO_URL="2. Вставьте URL репозитория (например https://github.com/username/vozduh.git): "

if "%REPO_URL%"=="" (
    echo Ошибка: URL не указан
    pause
    exit /b 1
)

echo.
echo 3. Инициализация Git...
git init 2>nul
git branch -M main

echo 4. Добавление файлов...
git add .

echo 5. Создание коммита...
git commit -m "Initial commit" 2>nul

echo 6. Добавление remote...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo 7. Push на GitHub...
git push -u origin main

echo.
echo === Готово! ===
echo.
echo Теперь откройте https://vercel.com/new
echo Import Git Repository - выберите ваш репозиторий - Deploy
echo.
pause
