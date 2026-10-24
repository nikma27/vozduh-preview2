#!/usr/bin/env node
/**
 * Автоматический скрипт развёртывания сайта «ВОЗДУХ НСК» на российский сервер (152-ФЗ РФ).
 * Поддерживает два режима автоматической выкладки:
 * 1) Через SSH на любой российский VPS (Timeweb, Рег.ру, Selectel, Яндекс Облако, Beget):
 *    Запуск: node scripts/deploy-to-ru-server.mjs --ssh root@IP_СЕРВЕРА --domain vozduh-nsk54.ru
 * 2) Через API Timeweb Cloud (создание/обновление инфраструктуры и проверка статуса):
 *    Запуск: TIMEWEB_TOKEN=... node scripts/deploy-to-ru-server.mjs --timeweb-check
 */

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};

const sshTarget = getArg("--ssh");
const domain = getArg("--domain") || "vozduh-nsk54.ru";
const adminKey =
  getArg("--admin-key") ||
  process.env.ADMIN_EXPORT_KEY ||
  `VozduhNsk_${crypto.randomBytes(8).toString("hex")}`;

async function checkTimewebApi(token) {
  const resp = await fetch("https://api.timeweb.cloud/api/v1/account/status", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    throw new Error(`Ошибка авторизации Timeweb Cloud API: ${resp.status}`);
  }
  const data = await resp.json();
  console.log("✅ Успешное подключение к Timeweb Cloud API (РФ):", data);
  return data;
}

function deployViaSsh(target, siteDomain, exportKey) {
  console.log(`🚀 Подключаемся к российскому серверу ${target} для установки сайта ${siteDomain}...`);

  const remoteScript = `
set -e
echo "==> 1. Установка необходимых пакетов (Git, Docker, Nginx, Certbot)..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y git docker.io docker-compose-v2 nginx certbot python3-certbot-nginx curl

echo "==> 2. Клонирование / обновление проекта ВОЗДУХ НСК..."
if [ ! -d "/var/www/vozduh-nsk/.git" ]; then
  mkdir -p /var/www
  git clone https://github.com/nikma27/vozduh-preview2.git /var/www/vozduh-nsk
else
  cd /var/www/vozduh-nsk
  git fetch origin main
  git reset --hard origin/main
fi

cd /var/www/vozduh-nsk
mkdir -p /var/www/vozduh-nsk/data

if [ ! -f ".env" ]; then
  cat <<EOF > .env
PORT=3000
LEADS_DATA_DIR=/app/data
ADMIN_EXPORT_KEY=${exportKey}
EOF
  echo "✅ Создан файл .env с защищённым ключом выгрузки Excel"
fi

echo "==> 3. Сборка и запуск контейнера сайта и локальной базы РФ (152-ФЗ)..."
docker compose -f docker-compose.ru.yml up -d --build

echo "==> 4. Настройка веб-сервера Nginx для домена ${siteDomain}..."
cat << 'NGINX_EOF' > /etc/nginx/sites-available/vozduh-nsk54.conf
server {
    listen 80;
    listen [::]:80;
    server_name ${siteDomain} www.${siteDomain};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
    }
}
NGINX_EOF

ln -sf /etc/nginx/sites-available/vozduh-nsk54.conf /etc/nginx/sites-enabled/vozduh-nsk54.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> 5. Проверка здоровья российского сервера..."
sleep 2
curl -fsS http://127.0.0.1:3000/api/health
echo ""
echo "🎉 Сайт и база данных успешно развёрнуты на российском сервере!"
echo "📊 Ссылка для скачивания базы заявок в Excel (CSV):"
echo "   http://${siteDomain}/api/leads-export?key=${exportKey}"
`;

  const res = spawnSync("ssh", ["-o", "StrictHostKeyChecking=accept-new", target, remoteScript], {
    stdio: "inherit",
  });

  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

if (args.includes("--timeweb-check")) {
  const token = process.env.TIMEWEB_TOKEN || getArg("--token");
  if (!token) {
    console.error("Укажите токен: --token ВАШ_ТОКЕН");
    process.exit(1);
  }
  await checkTimewebApi(token);
} else if (sshTarget) {
  deployViaSsh(sshTarget, domain, adminKey);
} else {
  console.log(`
🇷🇺 Автоматический установщик «ВОЗДУХ НСК» на российский сервер:
  • Деплой по SSH:
    node scripts/deploy-to-ru-server.mjs --ssh root@IP_СЕРВЕРА --domain vozduh-nsk54.ru
  • Проверка API Timeweb Cloud:
    node scripts/deploy-to-ru-server.mjs --timeweb-check --token ВАШ_API_ТОКЕН
`);
}
