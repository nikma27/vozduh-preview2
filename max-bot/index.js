/**
 * Бот «Воздух НСК» для мессенджера MAX
 * Консультант по вентиляции и кондиционированию
 * @see docs/MAX-BOT-SETUP.md
 */

import { Bot } from "@maxhub/max-bot-api";
import { config } from "dotenv";

config();

const token = process.env.MAX_BOT_TOKEN;
if (!token) {
  console.error("Не задан MAX_BOT_TOKEN. Добавь в .env (см. docs/MAX-BOT-SETUP.md)");
  process.exit(1);
}

const bot = new Bot(token);

const WELCOME =
  "Привет! Я консультант «Воздух НСК» по вентиляции и кондиционированию. " +
  "Спроси про подбор оборудования, расчёты, сервис — отвечу. Или напиши «контакты» для связи.";

const CONTACTS =
  "📞 Телефон: +7 (383) 263-15-51\n" +
  "📧 Email: info@vozduh-nsk54.ru\n" +
  "📍 Офис: г. Новосибирск, ул. Королева 40, офис 208";

// Простой FAQ — можно расширить или подключить Yandex GPT
const FAQ = {
  вентиляция: "Вентиляция под ключ: проектирование, поставка, монтаж, пусконаладка. Пиши «контакты» — перезвоним и сделаем подбор.",
  кондиционер: "Кондиционирование: бытовые и коммерческие системы. Подбор, монтаж, сервис. Пиши «контакты» для консультации.",
  сервис: "Сервис: диагностика, чистка, пусконаладка, балансировка. Пиши «контакты» — подготовим КП под ваш объект.",
  цена: "Стоимость зависит от объекта. Оставь контакты — сделаем бесплатный подбор и расчёт.",
};

function getReply(text) {
  const lower = (text || "").toLowerCase().trim();
  if (lower.includes("контакт") || lower === "контакты" || lower === "телефон" || lower === "позвонить") {
    return CONTACTS;
  }
  for (const [key, answer] of Object.entries(FAQ)) {
    if (lower.includes(key)) return answer;
  }
  return "Напиши «вентиляция», «кондиционер», «сервис» или «контакты» — подскажу. Или позвони: +7 (383) 263-15-51.";
}

bot.command("start", (ctx) => ctx.reply(WELCOME));

bot.on("message_created", async (ctx) => {
  const text = ctx.message?.body?.text;
  if (!text || text.startsWith("/")) return;

  try {
    const reply = getReply(text);
    await ctx.reply(reply);
  } catch (e) {
    console.error(e);
    await ctx.reply("Произошла ошибка. Попробуйте ещё раз или позвоните: +7 (383) 263-15-51.");
  }
});

bot.catch((err) => {
  console.error("Ошибка бота:", err);
});

bot.start();
console.log("Бот MAX «Воздух НСК» запущен. Ожидаю сообщения...");
