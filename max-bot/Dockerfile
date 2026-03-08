# Бот MAX «Воздух НСК» — образ для облачного деплоя
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY index.js .

# Бот не слушает порт — long polling. Railway/Render могут требовать процесс.
# Для совместимости: процесс не завершается (бот работает)
CMD ["node", "index.js"]
