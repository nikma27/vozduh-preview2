
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Wind,
  Thermometer,
  Settings,
  Fan,
  ArrowRight,
  Menu,
  X,
  Phone,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
  Droplets,
  Waves,
  Snowflake,
  Mail,
  Factory,
  Utensils,
  Calculator,
  Layers,
  FileText,
  UserCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * 0) Helpers
 */
const safeJson = async (resp) => {
  try {
    return await resp.json();
  } catch {
    return null;
  }
};

const postLead = async (lead) => {
  const base = import.meta.env.VITE_LEAD_API;
  if (!base) {
    // Предпросмотр: если API не настроено — просто "успешно" (чтобы модалки закрывались)
    return { ok: true, mocked: true };
  }

  const resp = await fetch(`${base}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, page: window.location.href }),
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`Lead API error: ${resp.status} ${t}`);
  }
  return resp.json();
};

const fetchGeminiResponse = async (userQuery, customSystemPrompt = null) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!apiKey) return "AI отключён в предпросмотре (не задан VITE_GEMINI_API_KEY).";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const defaultSystemPrompt =
    "Ты — главный инженер компании 'Воздух НСК'. Отвечай кратко и профессионально.";
  const systemPromptToUse = customSystemPrompt || defaultSystemPrompt;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPromptToUse }] },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Извините, сервис временно недоступен."
    );
  } catch {
    return "Произошла ошибка связи с сервером.";
  }
};

/**
 * 1) Data
 * (картинки — прямые ссылки на unsplash; без google-search-URL)
 */
const complexSolutions = [
  // LIFE
  {
    id: "life-ac",
    segment: "life",
    icon: Snowflake,
    title: "Кондиционирование жилья",
    description:
      "Комфортная прохлада без сквозняков: тихие инверторные системы и аккуратная интеграция в интерьер.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Инверторные системы",
        desc: "Тихие решения для спален: плавное охлаждение без ледяного потока.",
        subImage:
          "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Мульти-сплит",
        desc: "Один внешний блок — до 5 комнат. Удобно для фасадных ограничений.",
        subImage:
          "https://images.unsplash.com/photo-1627236585127-18c72807e335?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Канальные системы",
        desc: "Скрытый монтаж: видны только решётки/диффузоры. Максимальная эстетика.",
        subImage:
          "https://images.unsplash.com/photo-1596238612140-52cb23214b2d?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "life-vent",
    segment: "life",
    icon: Wind,
    title: "Вентиляция квартиры и дома",
    description:
      "Свежий воздух 24/7 при закрытых окнах. Фильтрация пыли, аллергенов и контроль CO₂.",
    image:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Бризеры",
        desc: "Приток в одну комнату: подогрев, фильтрация, тихая работа.",
        subImage:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "ПВУ с рекуперацией",
        desc: "Экономия тепла до 80%: приток нагревается вытяжным воздухом.",
        subImage:
          "https://images.unsplash.com/photo-1581093583449-8255a6d338ce?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Умные режимы",
        desc: "Автоматическая подача по датчикам (CO₂/влажность/присутствие).",
        subImage:
          "https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "life-humid",
    segment: "life",
    icon: Droplets,
    title: "Увлажнение воздуха",
    description:
      "Здоровый микроклимат и сохранность отделки. Автоподдержание 40–60% зимой.",
    image:
      "https://images.unsplash.com/photo-1512918760513-95f1929757cd?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Форсуночное увлажнение",
        desc: "Микрораспыление воды: эффективно и гигиенично при правильной подготовке.",
        subImage:
          "https://images.unsplash.com/photo-1534127003460-6b6070a319f0?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Адиабатическое",
        desc: "Естественное испарение через канальные блоки вентиляции.",
        subImage:
          "https://images.unsplash.com/photo-1585776245991-cf79dd8fc78b?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "life-dry",
    segment: "life",
    icon: Waves,
    title: "Осушение (бассейны)",
    description:
      "Защита от плесени и конденсата в зонах бассейнов/саун. Контроль точки росы.",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Настенные осушители",
        desc: "Компактные решения для небольших бассейнов и купелей.",
        subImage:
          "https://images.unsplash.com/photo-1563456073177-380d381b83d8?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Канальные системы",
        desc: "Скрытый монтаж + подмес свежего воздуха: полный климат-контроль.",
        subImage:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  // BUSINESS
  {
    id: "biz-ac",
    segment: "business",
    icon: Snowflake,
    title: "Коммерческий холод",
    description:
      "Офисы, отели, торговые залы: энергоэффективность и централизованное управление.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "VRF/VRV",
        desc: "Многозональное управление климатом здания с одной точкой подключения.",
        subImage:
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Кассетные блоки",
        desc: "Равномерная подача 360° — идеальна для Open Space.",
        subImage:
          "https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Прецизионные",
        desc: "Точное поддержание температуры/влажности для серверных и ЦОД.",
        subImage:
          "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "biz-vent",
    segment: "business",
    icon: Utensils,
    title: "Вентиляция HoReCa",
    description:
      "Ресторанные и кухонные зоны: удаление запахов, жира и избыточного тепла.",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Вытяжные зонты",
        desc: "Эффективное удаление жира и жара, лабиринтные фильтры.",
        subImage:
          "https://images.unsplash.com/photo-1621871908119-28a5b35c03eb?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Общеобменная",
        desc: "Подготовка и подача свежего воздуха в залы для гостей.",
        subImage:
          "https://images.unsplash.com/photo-1599407357322-92df91866782?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  // INDUSTRY
  {
    id: "ind-cool",
    segment: "industry",
    icon: Factory,
    title: "Промышленный холод",
    description:
      "Технологическое охлаждение оборудования и складов. Мегаваттные мощности.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Модульные чиллеры",
        desc: "Высокая мощность для систем вода–воздух и охлаждения станков.",
        subImage:
          "https://images.unsplash.com/photo-1590636735492-36c997321a0f?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Градирни",
        desc: "Охлаждение технической воды для производственных циклов.",
        subImage:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "ККБ",
        desc: "Компрессорно-конденсаторные блоки для интеграции в приточные установки.",
        subImage:
          "https://images.unsplash.com/photo-1565193566173-0923d5a633f3?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "ind-vent",
    segment: "industry",
    icon: Wind,
    title: "Пром. вентиляция",
    description:
      "Аспирация и очистка воздуха в цехах. Работа с агрессивными средами и температурами.",
    image:
      "https://images.unsplash.com/photo-1565193566173-0923d5a633f3?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Аспирация",
        desc: "Удаление пыли, стружки, сварочных аэрозолей и выбросов.",
        subImage:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Дымоудаление",
        desc: "Противопожарная безопасность: удаление дыма и подпор воздуха.",
        subImage:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];

/**
 * 2) Modals
 */
const ModalShell = ({ onClose, children, z = 150 }) => (
  <div className={`fixed inset-0 z-[${z}] flex items-center justify-center p-4 font-sans`}>
    <div
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
    />
    {children}
  </div>
);

const ContactModal = ({ onClose, title = "Оставить заявку" }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await postLead({ type: "contact", context: title, name, phone });
      setSubmitted(true);
      setTimeout(onClose, 1600);
    } catch {
      alert("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={onClose} z={150}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} type="button">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900">
                Спасибо! Мы скоро свяжемся.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                placeholder="Ваше имя"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-light"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-light"
              />
              <button
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-60"
              >
                {loading ? "Отправляем..." : "Жду звонка"}
              </button>
              <p className="text-[10px] text-center text-slate-400">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </ModalShell>
  );
};

const PartnerModal = ({ onClose }) => {
  const [form, setForm] = useState({
    fio: "",
    phone: "",
    city: "",
    role: "designer",
    activity: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await postLead({
        type: "partner",
        context: "Анкета партнера",
        name: form.fio,
        phone: form.phone,
        payload: form,
      });
      setSubmitted(true);
      setTimeout(onClose, 1800);
    } catch {
      alert("Не удалось отправить анкету. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    ["designer", "Дизайнер"],
    ["architect", "Архитектор"],
    ["builder", "Строитель"],
    ["other", "Другое"],
  ];

  return (
    <ModalShell onClose={onClose} z={150}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-lg relative z-10 overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Анкета партнера</h3>
              <p className="text-sm text-slate-500 mt-1">
                Для архитекторов и дизайнеров
              </p>
            </div>
            <button onClick={onClose} type="button">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          {submitted ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Анкета получена!</h4>
              <p className="text-slate-500">Мы свяжемся с вами сегодня.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {roles.map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setField("role", key)}
                    className={[
                      "p-3 rounded-xl border text-sm font-medium transition-all",
                      form.role === key
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                        : "bg-white text-slate-600 border-slate-200",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                required
                placeholder="Ваше ФИО"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={form.fio}
                onChange={(e) => setField("fio", e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Город"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
              <input
                type="tel"
                required
                placeholder="Телефон"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-60"
              >
                {loading ? "Отправляем..." : "Отправить анкету"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </ModalShell>
  );
};

const BriefGeneratorModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    area: "",
    height: "",
    people: "",
  });
  const [generatedBrief, setGeneratedBrief] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setField = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  const handleGenerate = async () => {
    setIsLoading(true);
    const prompt = `Составь ТЗ на вентиляцию. Объект: ${formData.type}, Площадь: ${formData.area}м2, Высота потолков: ${formData.height}м, Количество людей: ${formData.people}. Кратко и профессионально.`;
    const systemPrompt = "Ты — ведущий инженер-проектировщик систем ОВиК.";
    try {
      const response = await fetchGeminiResponse(prompt, systemPrompt);
      setGeneratedBrief(response);
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const sendToEngineer = async () => {
    try {
      await postLead({
        type: "brief",
        context: "AI Генератор ТЗ",
        payload: { ...formData, generatedBrief },
      });
      alert("Отправлено инженеру (или замокано в предпросмотре).");
    } catch {
      alert("Не удалось отправить. Проверьте API.");
    }
  };

  return (
    <ModalShell onClose={onClose} z={150}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-blue-400" />
            <h3 className="font-bold text-lg">AI Генератор ТЗ</h3>
          </div>
          <button onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 mb-4">
                Заполните данные для мгновенного формирования чернового ТЗ.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Тип объекта (Кафе, офис...)"
                  value={formData.type}
                  onChange={(e) => setField("type", e.target.value)}
                />
                <input
                  type="number"
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Площадь (м²)"
                  value={formData.area}
                  onChange={(e) => setField("area", e.target.value)}
                />
                <input
                  type="number"
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Высота потолков (м)"
                  value={formData.height}
                  onChange={(e) => setField("height", e.target.value)}
                />
                <input
                  type="number"
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Кол-во людей"
                  value={formData.people}
                  onChange={(e) => setField("people", e.target.value)}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !formData.type}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 mt-4 transition-all hover:bg-blue-700 disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Сформировать черновик ТЗ"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border border-slate-100 font-mono">
                {generatedBrief}
              </div>
              <div className="flex gap-4 flex-col sm:flex-row">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-slate-200 rounded-xl font-medium text-slate-600"
                >
                  Изменить данные
                </button>
                <button
                  onClick={sendToEngineer}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Отправить инженеру
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold"
                >
                  Готово
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </ModalShell>
  );
};

const LeadModal = ({ onClose, context }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await postLead({ type: "lead", context, name, phone });
      setSubmitted(true);
      setTimeout(onClose, 1600);
    } catch {
      alert("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-md relative z-10 p-8 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
              Раздел:
            </div>
            <h3 className="text-lg font-bold leading-tight text-slate-900">{context}</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center">
            <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-slate-900">Заявка принята</h4>
            <p className="text-slate-500 mt-2 font-medium text-sm">
              Инженер скоро свяжется с вами.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="Ваше имя"
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              required
              placeholder="+7 (___) ___-__-__"
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
            />
            <button
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-60"
            >
              {loading ? "Отправляем..." : "Запросить подбор"}
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Нажимая кнопку, вы подтверждаете отправку данных
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const SolutionDetailModal = ({ solution, onClose, onOpenLead }) => {
  const Icon = solution.icon;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
      />
      <motion.div
        layoutId={solution.id}
        className="bg-white w-full max-w-5xl md:rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl flex flex-col md:flex-row h-full md:h-[80vh] max-h-[900px]"
      >
        <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden flex-shrink-0">
          <img src={solution.image} className="w-full h-full object-cover" alt={solution.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-10 left-10 text-white">
            <Icon size={40} className="mb-4 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{solution.title}</h2>
          </div>
        </div>

        <div className="md:w-7/12 p-8 md:p-12 overflow-y-auto bg-white flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Инженерное решение
            </span>
            <button onClick={onClose} type="button" className="p-2 hover:bg-slate-50 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8 mb-8">
            {solution.details.map((item, idx) => (
              <div key={idx} className="group flex gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 hidden sm:block shadow-sm">
                  <img
                    src={item.subImage}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    alt={item.title}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 font-medium mb-4 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => onOpenLead(`${solution.title} → ${item.title} (Подбор)`)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-all uppercase tracking-wide"
                    >
                      Подобрать
                    </button>
                    <button
                      onClick={() => onOpenLead(`${solution.title} → ${item.title} (Смета)`)}
                      className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold text-xs hover:border-blue-600 hover:text-blue-600 transition-all uppercase tracking-wide"
                    >
                      Получить смету
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button
              onClick={() => onOpenLead(`${solution.title} (Общий запрос)`)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all"
            >
              Запросить консультацию по решению
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * 3) Sections
 */
const Navbar = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Решения", href: "#catalog" },
    { name: "Облако", href: "#cloud" },
    { name: "Инжиниринг", href: "#engineering" },
    { name: "Партнерам", href: "#partners" },
    { name: "Контакты", href: "#contact" },
  ];

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b bg-white/80 backdrop-blur-md border-white/20 shadow-sm",
        isScrolled ? "py-4" : "py-6",
      ].join(" ")}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 group z-50 relative">
          <div className="p-2 rounded-full transition-colors bg-blue-600 text-white">
            <Wind size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase text-slate-900">
            Воздух<span className="text-blue-600">НСК</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-bold hover:text-blue-500 transition-colors text-slate-800"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col items-end text-sm text-slate-900">
            <span className="font-bold">+7 (383) 263-15-51</span>
            <span className="text-xs text-slate-600 font-medium">Пн–Пт 9:00–18:00</span>
          </div>
          <button
            onClick={onOpenContact}
            className="px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700"
          >
            Оставить заявку
          </button>
        </div>

        <button
          className="lg:hidden text-2xl transition-colors z-50 relative text-slate-900"
          onClick={() => setMobileMenuOpen((v) => !v)}
          type="button"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-xl z-40 flex flex-col p-8 lg:hidden border-l border-white/20 h-screen overflow-y-auto"
          >
            <div className="flex flex-col gap-8 text-2xl font-bold text-slate-800 flex-1 justify-center items-center text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative group overflow-hidden"
                >
                  <span className="relative z-10 group-hover:text-blue-600 transition-colors">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-auto pt-8 border-t border-slate-200 text-center shrink-0 pb-8">
              <a
                href="tel:+73832631551"
                className="block text-2xl font-bold mb-2 text-slate-900"
              >
                +7 (383) 263-15-51
              </a>
              <p className="text-slate-500 mb-4 font-medium">Новосибирск, ул. Королева 40</p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold"
                type="button"
              >
                Оставить заявку
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onOpenLead }) => (
  <section className="relative h-[100vh] flex items-center overflow-hidden bg-slate-900 text-white">
    <div className="absolute inset-0 opacity-40">
      <img
        src="https://images.unsplash.com/photo-1620646146430-6d33939f6027?auto=format&fit=crop&w=2400&q=80"
        className="w-full h-full object-cover"
        alt="Background"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
    <div className="container mx-auto px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-[0.3em] mb-10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Проектирование • Поставка • Сервис
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-10">
          Климат{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            как искусство
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl font-medium text-slate-400 mb-12 leading-relaxed">
          Создаем невидимое совершенство для жилых пространств, бизнес-центров и высокотехнологичных производств.
        </p>

        <div className="flex flex-wrap gap-5">
          <button
            onClick={() => onOpenLead("Главный экран: Расчет")}
            className="px-10 py-5 bg-blue-600 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30"
            type="button"
          >
            Начать расчет <ArrowRight size={20} />
          </button>
          <a
            href="#catalog"
            className="px-10 py-5 bg-white/5 border border-white/20 backdrop-blur-md rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center flex items-center justify-center"
          >
            Наши решения
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const CloudPromo = ({ onOpenLead }) => (
  <section id="cloud" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-14">
      <div className="lg:w-1/2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6 block">
          Инновации
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-none uppercase tracking-tighter">
          Облачный климат
        </h2>
        <p className="text-slate-500 text-lg font-medium mb-10 leading-relaxed">
          Умное управление со смартфона, сниженная стоимость оборудования и расширенная гарантия при подписке.
        </p>
        <button
          onClick={() => onOpenLead("Облачный кондиционер")}
          className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all"
          type="button"
        >
          Узнать подробнее
        </button>
      </div>
      <div className="lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=1600&q=80"
          className="rounded-[3rem] shadow-2xl"
          alt="Cloud"
        />
      </div>
    </div>
  </section>
);

const Catalog = ({ onOpenSolution }) => {
  const [segment, setSegment] = useState("life");
  const items = useMemo(() => complexSolutions.filter((s) => s.segment === segment), [segment]);

  return (
    <section id="catalog" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-10">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 uppercase tracking-tight leading-none">
              Комплексный подход
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Мы проектируем и реализуем системы, которые создают идеальную среду для жизни и работы.
            </p>
          </div>

          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {[
              ["life", "life"],
              ["business", "business"],
              ["industry", "industry"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSegment(key)}
                className={[
                  "px-6 md:px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  segment === key ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900",
                ].join(" ")}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <motion.div
              layoutId={item.id}
              key={item.id}
              onClick={() => onOpenSolution(item)}
              className="group relative h-[480px] rounded-[2.5rem] overflow-hidden cursor-pointer bg-slate-100 shadow-sm hover:shadow-2xl transition-all border border-slate-100"
            >
              <img
                src={item.image}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-3">{item.title}</h3>
                <div className="h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-sm text-slate-300 font-medium mb-6 line-clamp-2">{item.description}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                    Детали <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EngineeringSection = ({ onOpenBrief }) => {
  const services = [
    { icon: Calculator, title: "Теплотехнический расчет", desc: "Расчет теплопритоков и теплопотерь здания." },
    { icon: Wind, title: "Расчет воздухообмена", desc: "Определение кратности обмена воздуха согласно нормам." },
    { icon: Layers, title: "BIM-моделирование", desc: "Создание 3D-модели систем в Revit." },
    { icon: FileText, title: "Рабочая документация", desc: "Оформление полного комплекта чертежей." },
  ];

  return (
    <section id="engineering" className="py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-16 md:mb-20 text-center mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight uppercase tracking-tighter">
            Профессиональный инжиниринг
          </h2>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">
            Мы не просто «вешаем ящики», а создаем проект, который учитывает архитектуру, бюджет и долгосрочную эффективность.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 md:mb-20">
          {services.map((s, i) => (
            <div
              key={i}
              className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-110 transition-all">
                <s.icon size={24} />
              </div>
              <h4 className="text-lg font-bold mb-3 uppercase tracking-wider">{s.title}</h4>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Нужна помощь с техзаданием?</h3>
            <p className="text-slate-400 font-medium">AI-помощник сформирует черновик ТЗ за пару минут.</p>
          </div>
          <button
            onClick={onOpenBrief}
            className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl flex items-center gap-3 shrink-0"
            type="button"
          >
            <Sparkles size={20} className="text-blue-200" /> Попробовать AI-генератор
          </button>
        </div>
      </div>
    </section>
  );
};

const PartnersSection = ({ onOpenPartner }) => {
  const benefits = [
    {
      title: "Дизайнерам и Архитекторам",
      points: ["BIM-библиотеки оборудования", "Техническая консультация", "Соблюдение эстетики интерьера", "Индивидуальные условия"],
    },
    {
      title: "Строителям и Генподрядчикам",
      points: ["Соблюдение графиков работ", "Штатные бригады монтажников", "Сертификация и допуски", "Технадзор объекта"],
    },
  ];

  return (
    <section id="partners" className="py-24 md:py-32 bg-white text-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Сотрудничество для профессионалов
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Мы становимся вашим инженерным отделом. Вы творите — мы обеспечиваем техническую реализацию.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-14 md:mb-20">
          {benefits.map((b, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 p-10 md:p-12 rounded-[2.5rem]">
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-8">{b.title}</h3>
              <ul className="space-y-4">
                {b.points.map((p, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-slate-600 font-medium">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onOpenPartner}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-2xl flex items-center gap-3 mx-auto uppercase tracking-widest text-sm"
            type="button"
          >
            <UserCheck size={20} /> Стать партнером
          </button>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: Wind, title: "Вентиляция", desc: "Проектирование и монтаж систем любой сложности." },
    { icon: Snowflake, title: "Кондиционирование", desc: "Бытовые и коммерческие системы охлаждения." },
    { icon: Settings, title: "Автоматизация", desc: "Умный дом и диспетчеризация климата." },
    { icon: Fan, title: "Дымоудаление", desc: "Системы безопасности для бизнеса." },
  ];

  return (
    <section id="services" className="py-20 md:py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Услуги под ключ</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="p-8 bg-slate-50 rounded-2xl hover:shadow-xl transition-all border border-slate-100 group hover:border-blue-200"
            >
              <s.icon size={32} className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-slate-500 text-sm font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactForm = ({ onOpenLead, onOpenContact }) => (
  <section id="contact" className="py-24 md:py-32 bg-white">
    <div className="container mx-auto px-6">
      <div className="bg-slate-950 rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden flex flex-col lg:flex-row gap-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-24" />
        <div className="lg:w-1/2 relative z-10">
          <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-none uppercase tracking-tighter">
            Напишите нам
          </h2>

          <div className="space-y-10 mb-12">
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5">
                <Phone size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Телефон отдела продаж
                </p>
                <a href="tel:+73832631551" className="text-2xl md:text-3xl font-medium hover:text-blue-400 transition-colors tracking-tight">
                  +7 (383) 263-15-51
                </a>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Электронная почта
                </p>
                <a href="mailto:info@vozduh-nsk54.ru" className="text-xl md:text-2xl font-medium hover:text-blue-400 transition-colors">
                  info@vozduh-nsk54.ru
                </a>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Офис
                </p>
                <p className="text-lg md:text-xl font-medium text-slate-300">
                  г. Новосибирск, ул. Королева 40, офис 208
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => onOpenLead("Контакты: Telegram")}
              className="px-8 py-4 bg-blue-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 tracking-wide text-sm"
              type="button"
            >
              <Send size={20} /> Telegram
            </button>
            <button
              onClick={onOpenContact}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all tracking-wide text-sm"
              type="button"
            >
              <MapPin size={20} /> Оставить заявку
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 relative z-10 flex flex-col justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onOpenLead("Главная форма контактов");
            }}
            className="space-y-6 bg-white/5 p-10 md:p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-sm shadow-inner"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-2 uppercase">Заказать звонок</h3>
            <p className="text-slate-400 text-sm font-medium">
              Оставьте контакты — перезвоним и сделаем первичный подбор.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 transition-all font-medium"
              />
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <button className="w-full py-5 bg-white text-slate-900 rounded-[2rem] font-bold text-lg hover:bg-blue-400 hover:text-white transition-all shadow-2xl">
              Отправить данные
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between border-b border-slate-200 pb-12 mb-12 gap-10">
        <div>
          <div className="text-slate-900 text-3xl font-bold mb-4 uppercase tracking-tighter">
            ВОЗДУХ <span className="text-blue-600">НСК</span>
          </div>
          <p className="text-slate-400 font-medium text-sm">
            Инжиниринговые решения полного цикла. Климат для жизни и бизнеса.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
          <div>
            <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-widest text-[10px]">
              Навигация
            </h4>
            <div className="flex flex-col gap-3 font-medium text-slate-500">
              <a href="#catalog">Решения</a>
              <a href="#engineering">Инжиниринг</a>
              <a href="#partners">Партнерам</a>
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-widest text-[10px]">
              Клиентам
            </h4>
            <div className="flex flex-col gap-3 font-medium text-slate-500">
              <span>Договор</span>
              <span>Сервис</span>
              <span>Гарантии</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest">
        <div className="space-y-2">
          <p className="font-bold text-slate-600">Карточка организации:</p>
          <p><strong>ООО «ВОЗДУХ НСК»</strong></p>
          <p>ИНН: 5405074634 | КПП: 540101001</p>
          <p>ОГРН: 1225400025190</p>
          <p>Юридический адрес: 630015, Новосибирская обл, г Новосибирск, ул Королева, д. 40 корп. 3, офис 208</p>
        </div>

        <div className="lg:text-right space-y-2">
          <p className="font-bold text-slate-600">Руководство:</p>
          <p>Генеральный директор: <strong>Полеха Яков Владимирович</strong></p>
          <p className="mt-6 opacity-60">© {new Date().getFullYear()} Все права защищены.</p>
        </div>
      </div>
    </div>
  </footer>
);

/**
 * 4) Floating Assistant (чат)
 */
const ClimateAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Здравствуйте! Я помогу с выбором вентиляции или кондиционера. Какой у вас объект: квартира, ресторан или производство?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetchGeminiResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Извините, сейчас я не могу ответить." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-100 overflow-hidden font-sans"
          >
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Инженер‑консультант</h3>
                  <p className="text-xs text-slate-400 font-medium">Онлайн 24/7</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-slate-800 p-1 rounded transition-colors"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={[
                      "max-w-[80%] p-3 rounded-2xl text-sm font-medium leading-relaxed",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none",
                    ].join(" ")}
                  >
                    {String(msg.text).split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Например: нужна вытяжка для кафе..."
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-600/30 transition-all z-50 group hover:-translate-y-1"
        type="button"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white" />
          </span>
        )}
      </button>
    </>
  );
};

/**
 * 5) App
 */
export default function App() {
  const [activeSolution, setActiveSolution] = useState(null);
  const [leadContext, setLeadContext] = useState(null);
  const [modalState, setModalState] = useState(null); // 'contact' | 'partner' | 'brief'

  const openContact = () => setModalState("contact");
  const openPartner = () => setModalState("partner");
  const openBrief = () => setModalState("brief");
  const openLead = (ctx) => setLeadContext(ctx);

  return (
    <div className="font-sans text-slate-800 antialiased bg-white selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      <Navbar onOpenContact={openContact} />
      <Hero onOpenLead={openLead} />

      <CloudPromo onOpenLead={openLead} />
      <Catalog onOpenSolution={setActiveSolution} />

      <EngineeringSection onOpenBrief={openBrief} />
      <Services />
      <PartnersSection onOpenPartner={openPartner} />

      <ContactForm onOpenLead={openLead} onOpenContact={openContact} />
      <Footer />

      <ClimateAssistant />

      <AnimatePresence>
        {activeSolution && (
          <SolutionDetailModal
            solution={activeSolution}
            onClose={() => setActiveSolution(null)}
            onOpenLead={openLead}
          />
        )}
        {leadContext && <LeadModal context={leadContext} onClose={() => setLeadContext(null)} />}
        {modalState === "partner" && <PartnerModal onClose={() => setModalState(null)} />}
        {modalState === "contact" && <ContactModal onClose={() => setModalState(null)} />}
        {modalState === "brief" && <BriefGeneratorModal onClose={() => setModalState(null)} />}
      </AnimatePresence>
    </div>
  );
}
