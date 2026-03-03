# Скрипт для push проекта в https://github.com/nikma27/vozduh-preview2
# Запуск: в Git Bash или терминале с git в PATH выполните команды ниже вручную

# 1. Инициализация (если ещё не сделано)
# git init

# 2. Добавить remote (если ещё не добавлен)
# git remote add origin https://github.com/nikma27/vozduh-preview2.git

# 3. Добавить все файлы
# git add .

# 4. Коммит
# git commit -m "Обновление: шрифты Inter/Manrope, Hero, Daichi Cloud, BrandMarquee, оптимизация мобильной версии, исправления модалок, уменьшение отступов"

# 5. Push (при первом push может потребоваться авторизация)
# git branch -M main
# git push -u origin main

# Если remote уже есть и нужно обновить:
# git add .
# git commit -m "Обновление: все изменения"
# git push origin main

Write-Host "Выполните команды в Git Bash или терминале с установленным git:"
Write-Host ""
Write-Host "cd c:\Projects\vozduh-updated-fixed3photo"
Write-Host "git init"
Write-Host "git remote add origin https://github.com/nikma27/vozduh-preview2.git"
Write-Host "git add ."
Write-Host "git commit -m `"Полное обновление сайта`""
Write-Host "git branch -M main"
Write-Host "git push -u origin main"
