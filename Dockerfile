# Production Dockerfile для размещения на российских облачных платформах и VPS
# (Timeweb Cloud, Selectel, Яндекс Облако, Рег.ру, Amvera)

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV LEADS_DATA_DIR=/app/data

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/api ./api
COPY --from=builder /app/server.js ./server.js

# Папка для локального хранения заявок на российском сервере (152-ФЗ РФ)
RUN mkdir -p /app/data && chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]
