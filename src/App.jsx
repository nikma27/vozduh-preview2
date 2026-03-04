import React, { useEffect, useMemo, useRef, useState , useCallback } from "react";
import { createPortal } from "react-dom";
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
  Ruler,
  Filter,
  ArrowUp,
  BookOpen,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import BrandMarquee from "./components/BrandMarquee";

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
        icon: "/icons/inverter.svg",
        subImage:
          "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Мульти-сплит",
        desc: "Один внешний блок — до 5 комнат. Удобно для фасадных ограничений.",
        icon: "/icons/multi-split.svg",
        subImage:
          "https://images.unsplash.com/photo-1627236585127-18c72807e335?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Канальные системы",
        desc: "Скрытый монтаж: видны только решётки/диффузоры. Максимальная эстетика.",
        icon: "/icons/duct.svg",
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
        icon: "/icons/breezer.svg",
        subImage:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "ПВУ с рекуперацией",
        desc: "Экономия тепла до 80%: приток нагревается вытяжным воздухом.",
        icon: "/icons/recuperation.svg",
        subImage:
          "https://images.unsplash.com/photo-1581093583449-8255a6d338ce?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Умные режимы",
        desc: "Автоматическая подача по датчикам (CO₂/влажность/присутствие).",
        icon: "/icons/smart-modes.svg",
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
      "/photos/photo_6_2026-03-02_12-37-46.jpg",
    details: [
      {
        title: "Форсуночное увлажнение",
        desc: "Микрораспыление воды: эффективно и гигиенично при правильной подготовке.",
        icon: "/icons/spray-humid.svg",
        subImage:
          "https://images.unsplash.com/photo-1534127003460-6b6070a319f0?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Адиабатическое",
        desc: "Естественное испарение через канальные блоки вентиляции.",
        icon: "/icons/adiabatic.svg",
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
      "/photos/bassein-1.jpg",
    details: [
      {
        title: "Настенные осушители",
        desc: "Компактные решения для небольших бассейнов и купелей.",
        icon: "/icons/wall-dehumidifier.svg",
        subImage:
          "https://images.unsplash.com/photo-1563456073177-380d381b83d8?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Канальные системы",
        desc: "Скрытый монтаж + подмес свежего воздуха: полный климат-контроль.",
        icon: "/icons/duct.svg",
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
      "/photos/horeca-ducts.jpg",
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
      "/photos/photo_5_2026-03-02_12-38-04.jpg",
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative z-10 bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-normal text-slate-900">{title}</h3>
            <button onClick={onClose} type="button">
              <X size={24} className="text-slate-500" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-lg font-normal text-slate-900">
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
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-normal text-user-msg"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-normal text-user-msg"
              />
              <button
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-normal disabled:opacity-60"
              >
                {loading ? "Отправляем..." : "Жду звонка"}
              </button>
              <p className="text-[10px] text-center text-slate-500">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-normal text-slate-900">Анкета партнера</h3>
              <p className="text-sm text-slate-600 mt-1">
                Для архитекторов и дизайнеров
              </p>
            </div>
            <button onClick={onClose} type="button">
              <X size={24} className="text-slate-500" />
            </button>
          </div>

          {submitted ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-normal text-slate-900">Анкета получена!</h4>
              <p className="text-slate-600">Мы свяжемся с вами сегодня.</p>
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
                      "p-3 rounded-xl border text-sm font-normal transition-all",
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
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                value={form.fio}
                onChange={(e) => setField("fio", e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Город"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
              <input
                type="tel"
                required
                placeholder="Телефон"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-normal text-lg shadow-lg disabled:opacity-60"
              >
                {loading ? "Отправляем..." : "Отправить анкету"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

const BriefGeneratorModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ type: "", area: "", height: "", people: "" });
  const [generatedBrief, setGeneratedBrief] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleGenerate = async () => {
    setIsLoading(true);
    const prompt = `Составь ТЗ на вентиляцию. Объект: ${formData.type}, Площадь: ${formData.area}м2, Высота потолков: ${formData.height}м, Количество людей: ${formData.people}. Кратко и профессионально.`;
    const systemPrompt = "Ты — ведущий инженер-проектировщик систем ОВиК.";
    try {
      const response = await fetchGeminiResponse(prompt, systemPrompt);
      setGeneratedBrief(response);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-10 bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-blue-400" />
            <h3 className="font-normal text-lg">AI Генератор ТЗ</h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4 text-user-msg">
                Заполните данные для мгновенного формирования чернового технического задания.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                  placeholder="Тип объекта (Кафе, офис...)"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <input
                  type="number"
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                  placeholder="Площадь (м2)"
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
                <input
                  type="number"
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                  placeholder="Высота потолков (м)"
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
                <input
                  type="number"
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                  placeholder="Кол-во людей"
                  onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !formData.type}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-normal flex justify-center items-center gap-2 mt-4 transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Сформировать черновик ТЗ"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl whitespace-pre-wrap border border-slate-100 font-mono text-[14px] leading-[20px]">
                {generatedBrief}
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border border-slate-200 rounded-xl font-normal text-slate-600">
                  Изменить данные
                </button>
                <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-normal">
                  Готово
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
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
            <div className="text-[10px] font-normal text-blue-600 uppercase tracking-widest mb-1">
              Раздел:
            </div>
            <h3 className="text-lg font-normal leading-tight text-slate-900">{context}</h3>
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
            <h4 className="text-2xl font-normal text-slate-900">Заявка принята</h4>
            <p className="text-slate-600 mt-2 font-normal text-sm">
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
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-normal text-user-msg transition-all"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              required
              placeholder="+7 (___) ___-__-__"
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-normal text-user-msg transition-all"
            />
            <button
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-normal hover:bg-blue-600 transition-all disabled:opacity-60"
            >
              {loading ? "Отправляем..." : "Запросить подбор"}
            </button>
            <p className="text-[10px] text-center text-slate-500">
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
        className="bg-white w-full max-w-5xl md:rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl flex flex-col md:flex-row h-full md:h-[80vh] max-h-[900px]"
      >
        <div className="md:w-5/12 relative h-64 md:h-auto overflow-hidden flex-shrink-0">
          <img src={solution.image} className="w-full h-full object-cover" alt={solution.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-10 left-10 text-white">
            <Icon size={40} className="mb-4 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight">{solution.title}</h2>
          </div>
        </div>

        <div className="md:w-7/12 p-8 md:p-12 overflow-y-auto bg-white flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <span className="text-xs font-normal text-blue-600 uppercase tracking-widest">
              Инженерное решение
            </span>
            <button onClick={onClose} type="button" className="p-2 hover:bg-slate-50 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8 mb-8">
            {solution.details.map((item, idx) => (
              <div key={idx} className="group flex gap-6 items-start">
                {item.icon ? (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 transition-colors group-hover:bg-blue-600">
                    <img src={item.icon} alt="" className="w-8 h-8 opacity-80 transition-[filter,opacity] group-hover:opacity-100 group-hover:brightness-0 group-hover:invert" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 hidden sm:block shadow-sm">
                    <img
                      src={item.subImage}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      alt={item.title}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-normal text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 font-normal mb-4 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => onOpenLead(`${solution.title} → ${item.title} (Подбор)`)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-normal text-xs hover:bg-blue-600 hover:text-white transition-all uppercase tracking-wide"
                    >
                      Подобрать
                    </button>
                    <button
                      onClick={() => onOpenLead(`${solution.title} → ${item.title} (Смета)`)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-normal text-xs hover:border-blue-600 hover:text-blue-600 transition-all uppercase tracking-wide"
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
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-normal hover:bg-blue-600 transition-all"
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
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Решения", href: "#catalog" },
    { name: "Производители", href: "#manufacturers" },
    { name: "Работы", href: "#works" },
    { name: "Инжиниринг", href: "#engineering" },
    { name: "Сервис", href: "#service" },
    { name: "Статьи", href: "#articles" },
    { name: "Партнерам", href: "#partners" },
    { name: "Контакты", href: "#contact" },
  ];

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b bg-white/95 md:bg-white/80 md:backdrop-blur-md border-white/20 shadow-sm",
        isScrolled ? "py-1 sm:py-1.5 md:py-1.5 lg:py-2 xl:py-2 2xl:py-2.5" : "py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-4",
      ].join(" ")}
    >
      <div className="container mx-auto px-4 sm:px-5 md:px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 sm:gap-3 group z-50 relative overflow-visible">
          <div className="relative shrink-0">
            <div className="p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 bg-blue-600 text-white group-hover:scale-105">
              <Wind className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10" size={24} />
            </div>
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-px bg-gradient-to-r from-blue-600/60 to-transparent rounded-full opacity-80" aria-hidden="true" />
          </div>
          <span className="font-heading text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-normal tracking-tight uppercase text-slate-900 origin-left transform skew-x-[-1deg] group-hover:skew-x-0 transition-transform duration-300">
            <span className="inline-block animate-[logoFlow_0.5s_ease-out_forwards]">Воздух</span><span className="text-blue-600 inline-block animate-[logoFlow_0.5s_ease-out_0.03s_forwards]">НСК</span>
          </span>
        </a>

        <div className="hidden xl:flex items-center gap-4 xl:gap-5 2xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-nav font-normal hover:text-blue-500 hover:font-normal transition-colors text-slate-800 whitespace-nowrap"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-3 xl:gap-4 2xl:gap-6">
          <div className="flex flex-col items-end text-nav text-slate-900">
            <span className="font-normal">+7 (383) 263-15-51</span>
            <span className="text-slate-600 font-normal">Пн–Пт 9:00–18:00</span>
          </div>
          <button
            onClick={onOpenContact}
            className="text-nav px-3 sm:px-4 lg:px-4 xl:px-5 py-1.5 rounded-full font-normal transition-all hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700"
          >
            Оставить заявку
          </button>
        </div>

        <button
          className="xl:hidden text-xl sm:text-2xl transition-colors z-50 relative text-slate-900 p-1.5"
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
            className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 flex flex-col p-6 xl:hidden border-l border-white/20 h-screen overflow-y-auto"
          >
            <div className="flex flex-col gap-3 text-xl font-normal text-slate-800 flex-1 justify-center items-center text-center">
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
            <div className="mt-auto pt-6 border-t border-slate-200 text-center shrink-0 pb-6">
              <a
                href="tel:+73832631551"
                className="block text-2xl font-normal mb-2 text-slate-900"
              >
                +7 (383) 263-15-51
              </a>
              <p className="text-slate-600 mb-4 font-normal">Новосибирск, ул. Королева 40</p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-normal"
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

const Hero = ({ onOpenCalc }) => (
  <section className="relative h-[100vh] flex items-center overflow-hidden bg-slate-900 text-white">
    <div className="absolute inset-0 opacity-40">
      <img
        src="/photos/photo_10_2026-03-02_12-37-33.jpg"
        className="w-full h-full object-cover"
        alt="Background"
        fetchPriority="high"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
    <div className="container mx-auto px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] font-normal uppercase tracking-[0.3em] mb-10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Проектирование • Поставка • Монтаж • Сервис
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight mb-10">
          Климат{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            как искусство
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl font-normal text-slate-500 mb-12 leading-relaxed">
          Проектирование, монтаж и сервис систем вентиляции, кондиционирования, дымоудаления, автоматизации для жилых, коммерческих и промышленных объектов.
        </p>

        <div className="flex flex-wrap gap-5">
          <button
            onClick={() => onOpenCalc("vent")}
            className="px-10 py-5 bg-blue-600 rounded-full font-normal text-lg flex items-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30"
            type="button"
          >
            Начать расчет <ArrowRight size={20} />
          </button>
          <a
            href="#catalog"
            className="px-10 py-5 bg-white/5 border border-white/20 backdrop-blur-md rounded-full font-normal text-lg hover:bg-white/10 transition-all text-center flex items-center justify-center"
          >
            Наши решения
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

/** Данные категорий TURKOV по turkov.ru */
const turkovCategories = [
  {
    id: "turkov-pvu",
    icon: "/icons/recuperation.svg",
    title: "Приточно-вытяжные установки",
    description: "Энергоэффективные ПВУ с пластинчатым или роторным рекуператором для квартир и промышленности.",
    details: [
      { title: "С роторным рекуператором", desc: "Бытовые, полупромышленные и промышленные установки от 400 до 30 000 м³/ч.", icon: "/icons/recuperation.svg" },
      { title: "С пластинчатым рекуператором", desc: "2–4 ступени рекуперации, работа до −45 °C. Энтальпийные теплообменники.", icon: "/icons/recuperation.svg" },
    ],
  },
  {
    id: "turkov-pritoch",
    icon: "/icons/duct.svg",
    title: "Приточные установки",
    description: "Нагрев и подача очищенного воздуха для объектов от 20 до 20 000 м².",
    details: [
      { title: "Компактные и бытовые", desc: "Приточки для квартир и небольших объектов.", icon: "/icons/duct.svg" },
      { title: "Промышленные", desc: "Мощные приточные системы для коммерческих и производственных зданий.", icon: "/icons/factory.svg" },
      { title: "С HEPA фильтром", desc: "Высокая степень очистки воздуха для медицинских и чистых помещений.", icon: "/icons/filter.svg" },
    ],
  },
  {
    id: "turkov-pool",
    icon: "/icons/waves.svg",
    title: "Вентиляция для бассейна",
    description: "Осушение, воздухообмен, рекуперация и фильтрация для бассейнов.",
    details: [
      { title: "ПВУ с рециркуляцией", desc: "Приточно-вытяжные установки с рециркуляцией воздуха.", icon: "/icons/recuperation.svg" },
      { title: "Климатические комплексы", desc: "С рекуперацией, опционально со встроенным осушителем.", icon: "/icons/waves.svg" },
      { title: "Фреоновые осушители", desc: "Осушители с подмесом до 480 л/сутки.", icon: "/icons/wind.svg" },
    ],
  },
  {
    id: "turkov-vytyazh",
    icon: "/icons/wind.svg",
    title: "Вытяжные установки",
    description: "Профессиональные решения для удаления отработанного воздуха.",
    details: [
      { title: "Бытовые вытяжные", desc: "Для квартир и частных домов.", icon: "/icons/wind.svg" },
      { title: "Промышленные вытяжные", desc: "Мощные вытяжные системы для производства и складов.", icon: "/icons/factory.svg" },
    ],
  },
  {
    id: "turkov-filter",
    icon: "/icons/filter.svg",
    title: "Оборудование с высокой фильтрацией",
    description: "Приточные установки и канальные очистители с HEPA и повышенной степенью очистки.",
    details: [
      { title: "Приточные с HEPA", desc: "Оборудование с фильтрами тонкой очистки F5 и выше.", icon: "/icons/filter.svg" },
      { title: "Канальные очистители воздуха", desc: "Встраиваемые модули для доочистки в существующих системах.", icon: "/icons/duct.svg" },
    ],
  },
  {
    id: "turkov-okhl-uvl",
    icon: "/icons/droplets.svg",
    title: "Охладители, увлажнители, очистители",
    description: "Дополнительные модули для идеального микроклимата.",
    details: [
      { title: "Канальные охладители", desc: "Охлаждение приточного воздуха в тёплый сезон.", icon: "/icons/snowflake.svg" },
      { title: "Адиабатические увлажнители", desc: "Естественное испарение через канальные блоки.", icon: "/icons/droplets.svg" },
      { title: "Канальные очистители", desc: "Доочистка воздуха в вентканалах.", icon: "/icons/filter.svg" },
    ],
  },
  {
    id: "turkov-osush",
    icon: "/icons/wind.svg",
    title: "Конденсационные осушители",
    description: "Снижение влажности в бассейнах и складских помещениях.",
    details: [
      { title: "Конденсационные осушители", desc: "Эффективное осушение для влажных помещений.", icon: "/icons/wind.svg" },
    ],
  },
  {
    id: "turkov-auto",
    icon: "/icons/smart-modes.svg",
    title: "Датчики и автоматика",
    description: "Датчики, пульты, контроллеры и модули для управления вентиляцией.",
    details: [
      { title: "Датчики", desc: "CO₂, влажности, температуры, присутствия.", icon: "/icons/sensors.svg" },
      { title: "Пульты и регуляторы", desc: "Управление и настройка режимов работы.", icon: "/icons/smart-modes.svg" },
      { title: "Контроллеры и модули", desc: "Интеграция с умным домом (Яндекс, TURKOV Wi-Fi).", icon: "/icons/smart-modes.svg" },
    ],
  },
];

const TurkovCategoryModal = ({ category, onClose, onOpenLead }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 font-sans">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
    />
    <motion.div
      className="bg-white w-full max-w-2xl md:rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl"
    >
      <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
        <img src={category.icon} alt="" className="w-20 h-20 md:w-24 md:h-24 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 text-white">
          <h2 className="text-2xl md:text-3xl font-normal tracking-tight">{category.title}</h2>
        </div>
      </div>

      <div className="p-6 md:p-10 overflow-y-auto max-h-[60vh]">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs font-normal text-blue-600 uppercase tracking-widest">TURKOV</span>
          <button onClick={onClose} type="button" className="p-2 hover:bg-slate-50 rounded-full">
            <X size={24} />
          </button>
        </div>

        <p className="text-slate-600 font-normal mb-8 leading-relaxed">{category.description}</p>

        <div className="space-y-6">
          {category.details.map((item, idx) => (
            <div key={idx} className="group flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 transition-colors group-hover:bg-blue-600">
                <img src={item.icon} alt="" className="w-6 h-6 opacity-80 transition-[filter,opacity] group-hover:opacity-100 group-hover:brightness-0 group-hover:invert" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-normal text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-600 font-normal text-sm leading-relaxed mb-3">{item.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onOpenLead(`TURKOV ${category.title} → ${item.title} (Подбор)`)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-normal text-xs hover:bg-blue-600 hover:text-white transition-all uppercase tracking-wide"
                  >
                    Подобрать
                  </button>
                  <button
                    onClick={() => onOpenLead(`TURKOV ${category.title} → ${item.title} (Смета)`)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-normal text-xs hover:border-blue-600 hover:text-blue-600 transition-all uppercase tracking-wide"
                  >
                    Получить смету
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => onOpenLead(`TURKOV ${category.title} (Общий запрос)`)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-normal hover:bg-blue-600 transition-all"
          >
            Запросить консультацию по категории
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

const TurkovPromo = ({ onOpenCategory, onOpenLead }) => (
  <section id="turkov" className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="max-w-2xl">
          <span className="text-xs font-normal text-blue-600 uppercase tracking-widest mb-3 block">Официальный дилер</span>
          <h2 className="text-3xl md:text-5xl font-normal text-slate-900 mb-4 leading-tight uppercase tracking-tight">
            TURKOV
          </h2>
          <p className="text-slate-600 font-normal leading-relaxed mb-4">
            TURKOV — российский производитель энергоэффективных климатических систем, ведущий свою деятельность с 2012 года.
            Специализация: разработка и изготовление оборудования для объектов любого масштаба — от квартир до промышленных предприятий.
          </p>
          <p className="text-slate-800 font-medium text-sm">
            Воздух НСК является официальным дилером производителя TURKOV.
          </p>
        </div>
        <button
          onClick={() => onOpenLead("TURKOV — общий запрос")}
          className="shrink-0 px-8 py-4 bg-slate-900 text-white rounded-full font-normal text-sm uppercase tracking-widest hover:bg-blue-600 transition-all"
          type="button"
        >
          Запросить консультацию
        </button>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {turkovCategories.map((item, i) => (
          <motion.div
            key={item.id}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onOpenCategory(item)}
            className="group p-5 md:p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <img src={item.icon} alt="" className="w-6 h-6 opacity-80 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert" />
            </div>
            <h3 className="text-sm md:text-base font-normal text-slate-900 mb-1 uppercase tracking-wide">{item.title}</h3>
            <p className="text-slate-600 text-xs font-normal line-clamp-2 leading-relaxed">{item.description}</p>
            <span className="inline-flex items-center gap-1 text-xs font-normal text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Подробнее <ArrowRight size={12} />
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const Catalog = ({ onOpenSolution }) => {
  const [segment, setSegment] = useState("life");
  const items = useMemo(() => complexSolutions.filter((s) => s.segment === segment), [segment]);

  return (
    <section id="catalog" className="py-14 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-20 gap-6 md:gap-10">
          <div className="max-w-xl">
            <h2 className="font-heading text-4xl md:text-6xl font-normal text-slate-900 mb-4 md:mb-6 uppercase tracking-tight leading-tight">
              Комплексный подход
            </h2>
            <p className="font-sans text-slate-600 font-normal text-lg leading-relaxed tracking-body">
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
                  "px-6 md:px-8 py-3 rounded-xl text-xs font-normal uppercase tracking-widest transition-all",
                  segment === key ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:text-slate-900",
                ].join(" ")}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={segment}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onOpenSolution(item)}
              className="group relative h-[360px] md:h-[480px] rounded-[2.5rem] overflow-hidden cursor-pointer bg-slate-100 shadow-sm hover:shadow-2xl transition-all border border-slate-100"
            >
              <img
                src={item.image}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                alt={item.title}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/30 md:bg-white/20 md:backdrop-blur-md flex items-center justify-center mb-4 md:mb-6 group-hover:bg-blue-600 transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-normal uppercase tracking-widest mb-2 md:mb-3">{item.title}</h3>
                <div className="h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-sm text-slate-300 font-normal mb-6 line-clamp-2">{item.description}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-normal uppercase tracking-widest text-blue-400">
                    Детали <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
    <section id="engineering" className="py-14 md:py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-10 md:mb-20 text-center mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-normal mb-4 md:mb-6 leading-tight uppercase tracking-tighter">
            Профессиональный инжиниринг
          </h2>
          <p className="font-sans text-slate-400 font-normal text-lg leading-relaxed tracking-body">
            Мы не просто «вешаем ящики», а создаем проект, который учитывает архитектуру, бюджет и долгосрочную эффективность.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mb-10 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-110 transition-all">
                <s.icon size={24} />
              </div>
              <h4 className="text-lg font-normal mb-3 uppercase tracking-wider">{s.title}</h4>
              <p className="text-sm text-slate-400 font-normal leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-6 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          <div className="max-w-xl">
            <h3 className="text-2xl md:text-3xl font-normal mb-3 md:mb-4">Нужна помощь с техзаданием?</h3>
            <p className="text-slate-400 font-normal">AI-помощник сформирует черновик ТЗ за пару минут.</p>
          </div>
          <button
            onClick={onOpenBrief}
            className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-normal hover:bg-blue-500 transition-all shadow-xl flex items-center gap-3 shrink-0"
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
    <section id="partners" className="py-14 md:py-32 bg-white text-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10 md:mb-20 max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-normal mb-4 md:mb-6 tracking-tight leading-tight">
            Сотрудничество для профессионалов
          </h2>
          <p className="font-sans text-slate-600 font-normal text-lg leading-relaxed tracking-body">
            Мы становимся вашим инженерным отделом. Вы творите — мы обеспечиваем техническую реализацию.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-10 md:mb-20">
          {benefits.map((b, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 p-6 md:p-12 rounded-[2.5rem]">
              <h3 className="text-xl md:text-2xl font-normal text-blue-600 mb-5 md:mb-8">{b.title}</h3>
              <ul className="space-y-4">
                {b.points.map((p, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-slate-600 font-normal">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onOpenPartner}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-normal hover:bg-blue-700 transition-all shadow-2xl flex items-center gap-3 mx-auto uppercase tracking-widest text-sm"
            type="button"
          >
            <UserCheck size={20} /> Стать партнером
          </button>
        </div>
      </div>
    </section>
  );
};


const Services = ({ onOpenService }) => {
  const services = [
    {
      key: "vent",
      icon: Wind,
      title: "Вентиляция",
      desc: "Проектирование, поставка, монтаж и пусконаладка систем любой сложности.",
    },
    {
      key: "ac",
      icon: Snowflake,
      title: "Кондиционирование",
      desc: "Бытовые и коммерческие системы охлаждения: от подбора до сервиса.",
    },
    {
      key: "auto",
      icon: Settings,
      title: "Автоматизация",
      desc: "Диспетчеризация, умный дом, управление климатом и энергоэффективность.",
    },
    {
      key: "smoke",
      icon: Fan,
      title: "Дымоудаление",
      desc: "Системы противодымной вентиляции и подпора воздуха для безопасности.",
    },
  ];

  return (
    <section id="services" className="py-14 md:py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-normal text-slate-900 tracking-tight leading-tight">Услуги под ключ</h2>
          <p className="font-sans text-slate-600 font-normal mt-2 md:mt-3 leading-relaxed tracking-body">Нажмите на услугу, чтобы увидеть детали и состав работ.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onOpenService(s.key)}
              className="text-left p-6 md:p-8 bg-slate-50 rounded-2xl hover:shadow-xl transition-all border border-slate-100 group hover:border-blue-200"
            >
              <s.icon size={32} className="text-blue-600 mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-normal mb-2 md:mb-3">{s.title}</h3>
              <p className="text-slate-600 text-sm font-normal">{s.desc}</p>
              <div className="mt-6 text-xs font-normal uppercase tracking-widest text-blue-600 inline-flex items-center gap-2">
                Подробнее <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactForm = ({ onOpenLead, onOpenContact }) => (
  <section id="contact" className="py-14 md:py-32 bg-white">
    <div className="container mx-auto px-6">
      <div className="bg-slate-950 rounded-[3rem] md:rounded-[4rem] p-6 md:p-20 text-white relative overflow-hidden flex flex-col lg:flex-row gap-8 md:gap-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-24" />
        <div className="lg:w-1/2 relative z-10">
          <h2 className="font-heading text-4xl md:text-7xl font-normal mb-6 md:mb-10 leading-none uppercase tracking-tighter">
            Напишите нам
          </h2>

          <div className="space-y-6 md:space-y-10 mb-8 md:mb-12">
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5">
                <Phone size={28} />
              </div>
              <div>
                <p className="text-[10px] font-normal text-slate-600 uppercase tracking-widest mb-2">
                  Телефон отдела продаж
                </p>
                <a href="tel:+73832631551" className="text-2xl md:text-3xl font-normal hover:text-blue-400 transition-colors tracking-tight">
                  +7 (383) 263-15-51
                </a>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-[10px] font-normal text-slate-600 uppercase tracking-widest mb-2">
                  Электронная почта
                </p>
                <a href="mailto:info@vozduh-nsk54.ru" className="text-xl md:text-2xl font-normal hover:text-blue-400 transition-colors">
                  info@vozduh-nsk54.ru
                </a>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-[10px] font-normal text-slate-600 uppercase tracking-widest mb-2">
                  Офис
                </p>
                <p className="text-lg md:text-xl font-normal text-slate-300">
                  г. Новосибирск, ул. Королева 40, офис 208
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => onOpenLead("Контакты: Telegram")}
              className="px-8 py-4 bg-blue-600 rounded-2xl font-normal flex items-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 tracking-wide text-sm"
              type="button"
            >
              <Send size={20} /> Telegram
            </button>
            <button
              onClick={onOpenContact}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-normal flex items-center gap-3 hover:bg-white/10 transition-all tracking-wide text-sm"
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
            className="space-y-4 md:space-y-6 bg-white/5 p-6 md:p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-sm shadow-inner"
          >
            <h3 className="text-2xl md:text-3xl font-normal mb-2 uppercase">Заказать звонок</h3>
            <p className="text-slate-500 text-sm font-normal">
              Оставьте контакты — перезвоним и сделаем первичный подбор.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 transition-all font-normal"
              />
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 transition-all font-normal"
              />
            </div>
            <button className="w-full py-5 bg-white text-slate-900 rounded-[2rem] font-normal text-lg hover:bg-blue-400 hover:text-white transition-all shadow-2xl">
              Отправить данные
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 md:py-24 bg-slate-50 border-t border-slate-200">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between border-b border-slate-200 pb-8 md:pb-12 mb-8 md:mb-12 gap-6 md:gap-10">
        <div>
          <div className="font-heading text-slate-900 text-3xl font-normal mb-4 uppercase tracking-tighter leading-tight">
            ВОЗДУХ <span className="text-blue-600">НСК</span>
          </div>
          <p className="font-sans text-slate-600 font-normal text-sm leading-relaxed tracking-body">
            Инжиниринговые решения полного цикла. Климат для жизни и бизнеса.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-sm">
          <div>
            <h4 className="text-slate-900 font-normal mb-4 uppercase tracking-widest text-[10px]">
              Навигация
            </h4>
            <div className="flex flex-col gap-3 font-normal text-slate-600">
              <a href="#catalog">Решения</a>
              <a href="#engineering">Инжиниринг</a>
              <a href="#partners">Партнерам</a>
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 font-normal mb-4 uppercase tracking-widest text-[10px]">
              Клиентам
            </h4>
            <div className="flex flex-col gap-3 font-normal text-slate-600">
              <span>Договор</span>
              <span>Сервис</span>
              <span>Гарантии</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-[11px] font-normal text-slate-500 leading-relaxed uppercase tracking-widest">
        <div className="space-y-2">
          <p className="font-normal text-slate-600">Карточка организации:</p>
          <p><strong>ООО «ВОЗДУХ НСК»</strong></p>
          <p>ИНН: 5405074634 | КПП: 540101001</p>
          <p>ОГРН: 1225400025190</p>
          <p>Юридический адрес: 630015, Новосибирская обл, г Новосибирск, ул Королева, д. 40 корп. 3, офис 208</p>
        </div>

        <div className="lg:text-right space-y-2">
          <p className="font-normal text-slate-600">Руководство:</p>
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
                  <h3 className="font-normal text-sm">Инженер‑консультант</h3>
                  <p className="text-xs text-slate-500 font-normal">Онлайн 24/7</p>
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
                      "max-w-[80%] p-3 rounded-2xl font-normal",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none text-user-msg"
                        : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none text-ai-response",
                    ].join(" ")}
                  >
                    {String(msg.text).split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-4" : ""}>
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
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all text-user-msg"
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
 * 4.5) Доп. модалки: быстрый калькулятор и инфо по услугам
 */

const SERVICE_INFO = {
  vent: {
    title: "Вентиляция под ключ",
    icon: Wind,
    leadHint: "Услуги: Вентиляция",
    blocks: [
      { h: "Что делаем", p: "Обследуем объект, считаем воздухообмен, подбираем оборудование, проектируем трассы, монтируем и выполняем пусконаладку." },
      { h: "Что входит", p: "Проект/схема, подбор оборудования, воздуховоды и фасонные элементы, автоматика (по необходимости), паспорта и инструкции." },
      { h: "Результат", p: "Стабильный приток и вытяжка, комфорт по CO₂, меньше пыли и запахов. При желании — рекуперация для экономии тепла." },
    ],
  },
  ac: {
    title: "Кондиционирование под ключ",
    icon: Snowflake,
    leadHint: "Услуги: Кондиционирование",
    blocks: [
      { h: "Подбор", p: "Подбираем мощность и тип системы (сплит, мульти-сплит, кассета, канальный) под архитектуру и бюджет." },
      { h: "Монтаж", p: "Трассы, дренаж, электрика, вакуумирование и запуск. Чистый монтаж с защитой отделки." },
      { h: "Сервис", p: "Гарантийное и постгарантийное обслуживание: чистка, диагностика, дозаправка, сезонные осмотры." },
    ],
  },
  auto: {
    title: "Автоматизация и диспетчеризация",
    icon: Settings,
    leadHint: "Услуги: Автоматизация",
    blocks: [
      { h: "Управление", p: "Делаем управление климатом со смартфона, сценарии работы, расписания, удалённый доступ." },
      { h: "Инженерная автоматика", p: "Шкафы управления, датчики, частотники, интеграция с вентиляцией/чиллерами/VRF." },
      { h: "Энергоэффективность", p: "Оптимизируем режимы, уменьшаем энергопотребление, настраиваем защиту оборудования." },
    ],
  },
  smoke: {
    title: "Дымоудаление и подпор",
    icon: Fan,
    leadHint: "Услуги: Дымоудаление",
    blocks: [
      { h: "Проектирование", p: "Расчёт и подбор оборудования противодымной вентиляции, увязка с пожарной автоматикой." },
      { h: "Монтаж", p: "Клапаны, вентиляторы, шахты, воздуховоды, электропитание и управление." },
      { h: "Пусконаладка", p: "Проверка режимов, испытания, настройка алгоритмов, подготовка исполнительной документации." },
    ],
  },
};

const ServiceInfoModal = ({ serviceKey, onClose, onOpenLead }) => {
  const item = SERVICE_INFO[serviceKey];
  if (!item) return null;
  const Icon = item.icon;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        className="relative z-10 bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shrink-0">
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-normal text-slate-900">{item.title}</h3>
              <p className="text-slate-600 font-normal mt-1 text-sm">Кратко и по делу — что входит и какой результат.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50">
            <X size={22} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {item.blocks.map((b, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 className="font-normal text-slate-900">{b.h}</h4>
              <p className="text-slate-600 font-normal text-sm mt-2 leading-relaxed">{b.p}</p>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onOpenLead(item.leadHint)}
              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-normal hover:bg-blue-600 transition-all"
            >
              Получить консультацию
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-slate-200 rounded-2xl font-normal text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              Закрыть
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
            Информация носит ознакомительный характер. Финальный состав работ и подбор оборудования уточняется инженером после осмотра/ТЗ.
          </p>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

// Калькулятор (ориентировочный). Основание: СП 60.13330.2020 (минимальные расходы наружного воздуха, 0.35 кратности) + типовые методики подбора мощности кондиционера.
const VENT_PRESETS = [
  { key: "apartment", name: "Квартира / дом", perPerson: 30, ach: 0.35 },
  { key: "office", name: "Офис", perPerson: 40, ach: 2.0 },
  { key: "cafe", name: "Кафе / ресторан", perPerson: 60, ach: 6.0 },
  { key: "production", name: "Производство", perPerson: 60, ach: 4.0 },
];

const AC_PRESETS = [
  { key: "res", name: "Жильё", wpm2: 100, q: 35 },
  { key: "office", name: "Офис", wpm2: 120, q: 40 },
  { key: "retail", name: "Торговля", wpm2: 125, q: 40 },
];

const round1 = (n) => Math.round(n * 10) / 10;

const pickNearestKW = (kw) => {
  const options = [
    { kw: 2.0, label: "07 (≈2.0 кВт)" },
    { kw: 2.5, label: "09 (≈2.5 кВт)" },
    { kw: 3.5, label: "12 (≈3.5 кВт)" },
    { kw: 5.0, label: "18 (≈5.0 кВт)" },
    { kw: 7.0, label: "24 (≈7.0 кВт)" },
    { kw: 10.0, label: "36 (≈10 кВт)" },
  ];
  let best = options[0];
  for (const o of options) if (Math.abs(o.kw - kw) < Math.abs(best.kw - kw)) best = o;
  return best;
};

const QuickCalcModal = ({ initialTab = "vent", onClose, onOpenLead }) => {
  const [tab, setTab] = useState(initialTab);

  // common
  const [area, setArea] = useState(50);
  const [height, setHeight] = useState(2.7);

  // ventilation
  const [vPreset, setVPreset] = useState("apartment");
  const [people, setPeople] = useState(2);

  // AC
  const [aPreset, setAPreset] = useState("res");
  const [sunny, setSunny] = useState(false);
  const [computers, setComputers] = useState(0);

  useEffect(() => setTab(initialTab), [initialTab]);

  const vCfg = useMemo(() => VENT_PRESETS.find((p) => p.key === vPreset) || VENT_PRESETS[0], [vPreset]);
  const aCfg = useMemo(() => AC_PRESETS.find((p) => p.key === aPreset) || AC_PRESETS[0], [aPreset]);

  const volume = useMemo(() => (Number(area) || 0) * (Number(height) || 0), [area, height]);

  const vent = useMemo(() => {
    const L_people = (Number(people) || 0) * vCfg.perPerson; // м3/ч
    const L_ach = volume * vCfg.ach; // м3/ч
    const L_total = Math.max(L_people, L_ach);
    return {
      L_people,
      L_ach,
      L_total,
      supply: L_total,
      exhaust: L_total,
    };
  }, [people, vCfg, volume]);

  const ac = useMemo(() => {
    const S = Number(area) || 0;
    const h = Number(height) || 0;
    const wpm2 = aCfg.wpm2 * (sunny ? 1.2 : 1.0);
    const q = aCfg.q * (sunny ? 1.1 : 1.0);

    const q_area = (S * wpm2) / 1000; // кВт
    const q_shq = (S * h * q) / 1000; // кВт
    const q_people = (Number(people) || 0) * 0.1; // кВт
    const q_pc = (Number(computers) || 0) * 0.3; // кВт

    const total = Math.max(q_area, q_shq) + q_people + q_pc;
    return {
      q_area,
      q_shq,
      q_people,
      q_pc,
      total,
      nearest: pickNearestKW(total),
    };
  }, [area, height, aCfg, sunny, people, computers]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="relative z-10 bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-900 p-5 md:p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <Calculator size={18} className="text-blue-300" />
            <div>
              <h3 className="font-normal text-base md:text-lg">Быстрый расчёт (ориентировочно)</h3>
              <p className="text-xs text-slate-300 font-normal">Для предварительного понимания притока/вытяжки и мощности кондиционера</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 md:p-8 overflow-y-auto">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit mb-6">
            <button
              type="button"
              onClick={() => setTab("vent")}
              className={`px-5 py-2 rounded-xl text-xs font-normal uppercase tracking-widest transition-all ${tab === "vent" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
            >
              Вентиляция
            </button>
            <button
              type="button"
              onClick={() => setTab("ac")}
              className={`px-5 py-2 rounded-xl text-xs font-normal uppercase tracking-widest transition-all ${tab === "ac" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
            >
              Кондиционер
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="text-[10px] font-normal text-slate-600 uppercase tracking-widest mb-2">Площадь</div>
              <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-normal" />
              <div className="text-xs text-slate-500 mt-2">м²</div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="text-[10px] font-normal text-slate-600 uppercase tracking-widest mb-2">Высота</div>
              <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-normal" />
              <div className="text-xs text-slate-500 mt-2">м</div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="text-[10px] font-normal text-slate-600 uppercase tracking-widest mb-2">Люди</div>
              <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-normal" />
              <div className="text-xs text-slate-500 mt-2">чел.</div>
            </div>
          </div>

          {tab === "vent" ? (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-normal text-slate-900">Параметры объекта</h4>
                    <p className="text-sm text-slate-600 font-normal mt-1">Используем минимум по людям и по кратности, берем большее.</p>
                  </div>
                  <select value={vPreset} onChange={(e) => setVPreset(e.target.value)} className="p-3 rounded-xl border border-slate-200 bg-white font-normal">
                    {VENT_PRESETS.map((p) => (
                      <option key={p.key} value={p.key}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs font-normal uppercase tracking-widest text-slate-600">По людям</div>
                  <div className="text-3xl font-normal mt-2 text-slate-900">{Math.round(vent.L_people)} <span className="text-base font-normal text-slate-500">м³/ч</span></div>
                  <div className="text-xs text-slate-600 mt-2 font-normal">{vCfg.perPerson} м³/ч на человека</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs font-normal uppercase tracking-widest text-slate-600">По кратности</div>
                  <div className="text-3xl font-normal mt-2 text-slate-900">{Math.round(vent.L_ach)} <span className="text-base font-normal text-slate-500">м³/ч</span></div>
                  <div className="text-xs text-slate-600 mt-2 font-normal">{vCfg.ach} 1/ч × объём {round1(volume)} м³</div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-5">
                  <div className="text-xs font-normal uppercase tracking-widest text-slate-300">Итого (берём большее)</div>
                  <div className="text-3xl font-normal mt-2">{Math.round(vent.L_total)} <span className="text-base font-normal text-slate-300">м³/ч</span></div>
                  <div className="text-xs text-slate-300 mt-2 font-normal">Приток ≈ вытяжка</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button type="button" onClick={() => onOpenLead("Быстрый расчёт: Вентиляция")} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-normal hover:bg-blue-700 transition-all">
                  Получить подбор
                </button>
                <button type="button" onClick={onClose} className="flex-1 py-4 border border-slate-200 rounded-2xl font-normal text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all">
                  Закрыть
                </button>
              </div>

              <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                Оценка ориентировочная. Для санузлов/кухонь/техпомещений могут требоваться отдельные вытяжные нормы и локальные зонты.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-normal text-slate-900">Параметры помещения</h4>
                    <p className="text-sm text-slate-600 font-normal mt-1">Считаем по площади и по формуле S×h×q, берём большее, плюс люди и техника.</p>
                  </div>
                  <select value={aPreset} onChange={(e) => setAPreset(e.target.value)} className="p-3 rounded-xl border border-slate-200 bg-white font-normal">
                    {AC_PRESETS.map((p) => (
                      <option key={p.key} value={p.key}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-3 mt-4 text-sm font-normal text-slate-700">
                  <input type="checkbox" checked={sunny} onChange={(e) => setSunny(e.target.checked)} />
                  Солнечная сторона / большие окна
                </label>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-normal text-slate-600 uppercase tracking-widest mb-2">Компьютеры / техника (шт.)</div>
                    <input type="number" value={computers} onChange={(e) => setComputers(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-normal" />
                    <div className="text-xs text-slate-500 mt-2">≈ 0.3 кВт на 1 шт.</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs font-normal uppercase tracking-widest text-slate-600">Рекомендация</div>
                    <div className="text-2xl font-normal mt-2 text-slate-900">{round1(ac.total)} <span className="text-base font-normal text-slate-500">кВт</span></div>
                    <div className="text-xs text-slate-600 mt-2 font-normal">Ближайший типоразмер: {ac.nearest.label}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs font-normal uppercase tracking-widest text-slate-600">По площади</div>
                  <div className="text-3xl font-normal mt-2 text-slate-900">{round1(ac.q_area)} <span className="text-base font-normal text-slate-500">кВт</span></div>
                  <div className="text-xs text-slate-600 mt-2 font-normal">{aCfg.wpm2}{sunny ? "×1.2" : ""} Вт/м²</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs font-normal uppercase tracking-widest text-slate-600">S×h×q</div>
                  <div className="text-3xl font-normal mt-2 text-slate-900">{round1(ac.q_shq)} <span className="text-base font-normal text-slate-500">кВт</span></div>
                  <div className="text-xs text-slate-600 mt-2 font-normal">q≈{aCfg.q}{sunny ? "×1.1" : ""}</div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-5">
                  <div className="text-xs font-normal uppercase tracking-widest text-slate-300">Добавки</div>
                  <div className="text-3xl font-normal mt-2">{round1(ac.q_people + ac.q_pc)} <span className="text-base font-normal text-slate-300">кВт</span></div>
                  <div className="text-xs text-slate-300 mt-2 font-normal">Люди + техника</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button type="button" onClick={() => onOpenLead("Быстрый расчёт: Кондиционер")} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-normal hover:bg-blue-700 transition-all">
                  Получить подбор
                </button>
                <button type="button" onClick={onClose} className="flex-1 py-4 border border-slate-200 rounded-2xl font-normal text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all">
                  Закрыть
                </button>
              </div>

              <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                Оценка ориентировочная. Для точного подбора учитываются ориентация окон, утепление, притоки, оборудование и фактические теплопритоки.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

/**
 * 5) App
 */

// --- Наши работы (галерея) ---
const WORKS = [
  {
    title: 'Монтаж кондиционера в квартире',
    tag: 'Кондиционирование',
    image: '/photos/ac-apartment-wide.jpg',
  },
  {
    title: 'Аккуратный монтаж внутреннего блока',
    tag: 'Кондиционирование',
    image: '/photos/ac-room-sun.jpg',
  },
  {
    title: 'Вентустановки на объекте',
    tag: 'Промышленная вентиляция',
    image: '/photos/vent-units.jpg',
  },
  {
    title: 'Воздуховоды и вытяжка в кухне',
    tag: 'Общепит (HoReCa)',
    image: '/photos/kitchen-hoods.jpg',
  },
  {
    title: 'Монтаж воздуховодов',
    tag: 'Промышленная вентиляция',
    image: '/photos/duct-industrial.jpg',
  },
  {
    title: 'Окрасочно-сушильная камера',
    tag: 'Промышленность',
    image: '/photos/spray-booth-1.jpg',
  },
]

const WorksSection = () => (
  <section id="works" className="py-14 md:py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="flex items-end justify-between gap-4 md:gap-6 mb-6 md:mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900">
            Наши работы
          </h2>
          <p className="mt-2 md:mt-3 text-slate-600 max-w-2xl">
            Живые фото с объектов: кондиционирование, вентиляция, инженерные узлы.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Новые объекты добавляем регулярно
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {WORKS.map((w, idx) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: idx * 0.04 }}
            className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[16/10]">
              <img
                src={w.image}
                alt={w.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur px-3 py-1 text-xs font-normal text-slate-800 border border-white/70">
                  {w.tag}
                </span>
              </div>
              <div className="absolute left-4 right-4 bottom-4">
                <p className="text-white text-base font-normal leading-snug drop-shadow">
                  {w.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

// --- Статьи ---
const ARTICLES = [
  {
    id: "types",
    title: "Какая бывает вентиляция",
    excerpt: "Естественная и механическая, приточная, вытяжная, приточно-вытяжная с рекуперацией — как выбрать.",
    image:
      "/photos/duct-industrial.jpg",
    schemaTitle: "Схема типов вентиляции",
    body: [
      "Вентиляция бывает естественной (за счёт разности температур/ветра) и механической (вентиляторы и установки).",
      "По назначению выделяют: приточную (подаёт свежий воздух), вытяжную (удаляет загрязнённый), приточно‑вытяжную (балансирует приток и вытяжку) и ПВУ с рекуперацией тепла.",
      "Для квартир часто применяют бризеры/ПВУ, для общепита — мощные вытяжные системы и зонт над тепловым оборудованием, для производств — аспирацию и локальные отсосы.",
    ],
  },
  {
    id: "supply-exhaust",
    title: "Приток и вытяжка: зачем нужны",
    excerpt: "Почему важно соблюдать баланс и как получить свежий воздух без сквозняков и запахов.",
    image:
      "/photos/engineering-room-wide.jpg",
    schemaTitle: "Баланс притока и вытяжки",
    body: [
      "Приток подаёт наружный воздух, а вытяжка удаляет отработанный. Без вытяжки воздух застаивается, без притока появляется разрежение и подсосы из шахт и соседних помещений.",
      "Правильный баланс снижает запахи, конденсат и плесень, улучшает самочувствие и защищает отделку.",
      "В проектах важно учитывать перетоки (щели/дверные зазоры) и зоны удаления: кухня, санузлы, гардеробные.",
    ],
  },
  {
    id: "health",
    title: "Почему вентиляция важна для человека",
    excerpt: "CO₂, влажность, запахи и аллергены — что происходит в помещении без воздухообмена.",
    image:
      "/photos/home-vent-diffuser.jpg",
    schemaTitle: "Качество воздуха",
    body: [
      "При закрытых окнах в помещении растёт CO₂ и влажность, накапливаются запахи и аэрозоли. Это влияет на сон, концентрацию и самочувствие.",
      "Фильтрация и контролируемый воздухообмен снижают пыль, аллергены и уличный шум, а также помогают держать комфортную влажность.",
      "Современные системы используют датчики CO₂ и автоматику — воздух подаётся тогда, когда он действительно нужен.",
    ],
  },
  {
    id: "brizers",
    title: "Бризеры и их разновидности",
    excerpt: "Компактная приточная вентиляция: подогрев, фильтры, шум, производительность и сценарии установки.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    schemaTitle: "Устройство бризера",
    body: [
      "Бризер — это приточный прибор для одной комнаты. Он подаёт наружный воздух, фильтрует его и может подогревать зимой.",
      "Ключевые параметры: производительность (м³/ч), уровень шума, класс фильтрации (например, HEPA/угольный), наличие подогрева и автоматики.",
      "Бризер удобен как быстрый апгрейд для квартиры без сложного монтажа воздуховодов.",
    ],
  },
  {
    id: "ac-vs-vent",
    title: "Кондиционирование vs вентиляция",
    excerpt: "Почему кондиционер не заменяет вентиляцию и как объединять системы для максимального комфорта.",
    image:
      "https://images.unsplash.com/photo-1627236585127-18c72807e335?auto=format&fit=crop&w=1200&q=80",
    schemaTitle: "Разница систем",
    body: [
      "Кондиционер охлаждает/нагревает воздух в помещении, но почти не обеспечивает приток свежего наружного воздуха.",
      "Вентиляция отвечает за воздухообмен и качество воздуха. Лучший результат — совместная работа: вентиляция + кондиционирование.",
      "Для домов и больших объектов часто используют канальные системы и ПВУ с рекуперацией, интегрированные с охлаждением.",
    ],
  },
  {
    id: "trends",
    title: "Тенденции в вентиляции и кондиционировании",
    excerpt: "Рекуперация, умное управление, энергоэффективность, низкий шум и интеграция в интерьер.",
    image:
      "https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&w=1200&q=80",
    schemaTitle: "Тренды 2026",
    body: [
      "Рынок движется к энергоэффективности: рекуперация тепла, EC‑вентиляторы, точная автоматика и датчики качества воздуха.",
      "Управление со смартфона и диспетчеризация становятся стандартом — удобнее сервис и мониторинг.",
      "Интерьерные решения: скрытый монтаж, дизайнерские решётки, снижение шума и вибраций.",
    ],
  },
];

const SchemaCard = ({ title }) => (
  <div className="relative w-full rounded-3xl p-6 bg-white/35 backdrop-blur-xl border border-white/40 shadow-sm">
    <div className="text-[10px] font-normal uppercase tracking-widest text-slate-600 mb-2">Схема</div>
    <div className="text-lg font-normal text-slate-900">{title}</div>

    <div className="mt-6 aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 border border-white/60 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopColor="#60a5fa" stopOpacity="0.35" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect x="40" y="70" width="320" height="180" rx="24" fill="url(#g)" stroke="#94a3b8" strokeOpacity="0.35" />
        <circle cx="120" cy="160" r="28" fill="#60a5fa" fillOpacity="0.35" />
        <circle cx="200" cy="160" r="28" fill="#34d399" fillOpacity="0.35" />
        <circle cx="280" cy="160" r="28" fill="#60a5fa" fillOpacity="0.35" />
        <path d="M40 120 H360" stroke="#94a3b8" strokeOpacity="0.35" strokeWidth="6" />
        <path d="M40 200 H360" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="6" />
        <path d="M70 60 L110 90" stroke="#60a5fa" strokeWidth="10" strokeLinecap="round" />
        <path d="M330 240 L290 210" stroke="#34d399" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        className="relative z-10 bg-white w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between">
          <div className="max-w-3xl">
            <div className="text-[10px] font-normal uppercase tracking-widest text-blue-600 mb-2">Статья</div>
            <h3 className="text-2xl md:text-3xl font-normal text-slate-900">{article.title}</h3>
            <p className="text-slate-600 font-normal mt-2">{article.excerpt}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50">
            <X size={22} className="text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden flex-1">
          {/* sticky схема (за матовым стеклом) */}
          <div className="md:col-span-2 bg-gradient-to-b from-slate-50 to-white p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="md:sticky md:top-6">
              <SchemaCard title={article.schemaTitle} />
            </div>
          </div>

          {/* текст */}
          <div className="md:col-span-3 p-6 md:p-10 overflow-y-auto">
            <div className="prose prose-slate max-w-none">
              {article.body.map((p, i) => (
                <p key={i} className="text-slate-700 font-normal leading-relaxed">
                  {p}
                </p>
              ))}
              <div className="mt-8 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="text-sm font-normal text-slate-900 mb-2">Нужен расчёт под ваш объект?</div>
                <p className="text-slate-600 font-normal text-sm">
                  Оставьте заявку — наши специалисты свяжутся с вами и проконсультируют по всем интересующим вас вопросам.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

const ArticlesSection = ({ onOpenArticle }) => (
  <section id="articles" className="py-14 md:py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mb-8 md:mb-12">
        <div className="text-xs font-normal text-blue-600 uppercase tracking-widest mb-3 md:mb-4">Полезное</div>
        <h2 className="font-heading text-4xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight flex items-center gap-3">
          <BookOpen className="text-blue-600" size={28} /> Статьи
        </h2>
        <p className="font-sans text-slate-600 font-normal mt-2 md:mt-4 leading-relaxed tracking-body">
          Короткие материалы для понимания: что выбрать, как работает вентиляция и почему кондиционер не заменяет свежий воздух.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {ARTICLES.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onOpenArticle(a)}
            className="text-left group bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-44 overflow-hidden">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-5 md:p-7">
              <div className="text-[10px] font-normal uppercase tracking-widest text-slate-500 mb-2">Статья</div>
              <div className="text-xl font-normal text-slate-900 mb-2 md:mb-3">{a.title}</div>
              <div className="text-sm text-slate-600 font-normal leading-relaxed line-clamp-3">{a.excerpt}</div>
              <div className="mt-5 text-xs font-normal uppercase tracking-widest text-blue-600">Читать →</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </section>
);

// --- Сервисное обслуживание ---
const ServiceSection = ({ onOpenLead }) => (
  <section id="service" className="py-14 md:py-24 bg-slate-950 text-white">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mb-8 md:mb-14">
        <div className="text-xs font-normal text-blue-400 uppercase tracking-widest mb-3 md:mb-4">Сервис</div>
        <h2 className="font-heading text-4xl md:text-5xl font-normal tracking-tight leading-tight">Обслуживание вентиляции и кондиционирования</h2>
        <p className="font-sans text-slate-300 font-normal mt-2 md:mt-4 leading-relaxed tracking-body">
          Регулярный сервис продлевает срок службы оборудования, сохраняет эффективность и предотвращает поломки в сезон.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
        {[
          { h: "Диагностика", p: "Проверка режимов, датчиков, автоматики, протечек, уровня шума и вибраций." },
          { h: "Чистка и дезинфекция", p: "Фильтры, теплообменники, дренаж, внутренние блоки, воздуховоды и решётки." },
          { h: "Пусконаладка и настройка", p: "Балансировка расхода воздуха, настройка контроллеров, рекомендации по эксплуатации." },
        ].map((b) => (
          <div key={b.h} className="p-6 md:p-8 bg-white/5 rounded-[2rem] border border-white/10">
            <div className="text-lg font-normal mb-2 md:mb-3">{b.h}</div>
            <div className="text-sm text-slate-300 font-normal leading-relaxed">{b.p}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 md:mt-12 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="max-w-2xl">
          <div className="text-2xl font-normal">Нужен регламент обслуживания?</div>
          <div className="text-slate-300 font-normal mt-2">
            Подскажем периодичность, состав работ и подготовим коммерческое предложение под ваш объект.
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenLead("Сервис: Обслуживание")}
          className="px-10 py-4 bg-blue-600 rounded-2xl font-normal hover:bg-blue-500 transition-all shadow-xl"
        >
          Запросить сервис
        </button>
      </div>
    </div>
  </section>
);

// --- Кнопка наверх ---
const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShow(window.scrollY > 600);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-blue-600 transition-colors"
          aria-label="Наверх"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    
</AnimatePresence>
  );
};

// --- Reveal wrapper для плавных анимаций секций ---
const Reveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`section-reveal transition-all duration-500 ${isInView ? "is-visible" : ""}`}
    >
      {children}
    </motion.div>
  );
};
function MainSite() {
  const [activeSolution, setActiveSolution] = useState(null);
  const [activeTurkovCategory, setActiveTurkovCategory] = useState(null);
  const [leadContext, setLeadContext] = useState(null);
  const [modalState, setModalState] = useState(null);

const [activeService, setActiveService] = useState(null);
const [calcOpen, setCalcOpen] = useState(false);
const [calcTab, setCalcTab] = useState("vent");
const [activeArticle, setActiveArticle] = useState(null);
useEffect(() => {
  const applyFromUrl = () => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("calc") === "1") {
      setCalcOpen(true);
      setCalcTab(sp.get("tab") === "ac" ? "ac" : "vent");
    }
  };

  applyFromUrl();
  window.addEventListener("popstate", applyFromUrl);
  return () => window.removeEventListener("popstate", applyFromUrl);
}, []);
// 'contact' | 'partner' | 'brief'

  const openContact = () => setModalState("contact");
  const openPartner = () => setModalState("partner");
  const openBrief = () => setModalState("brief");
  const openLead = (ctx) => setLeadContext(ctx);

const openService = (key) => setActiveService(key);

const setUrlParams = (mutate, replace = true) => {
  const url = new URL(window.location.href);
  mutate(url.searchParams);
  const qs = url.searchParams.toString();
  const next = `${url.pathname}${qs ? `?${qs}` : ""}${url.hash}`;
  window.history[replace ? "replaceState" : "pushState"]({}, "", next);
};

const openCalc = (tab = "vent") => {
  const t = tab === "ac" ? "ac" : "vent";
  setCalcTab(t);
  setCalcOpen(true);
  setUrlParams((sp) => {
    sp.set("calc", "1");
    sp.set("tab", t);
  });
};

const closeCalc = () => {
  setCalcOpen(false);
  setUrlParams((sp) => {
    sp.delete("calc");
    sp.delete("tab");
  });
};



  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-sans text-slate-800 antialiased bg-white selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      <Navbar onOpenContact={openContact} />
      <Hero onOpenCalc={openCalc} />

      <Reveal>
        <Catalog onOpenSolution={setActiveSolution} />
      </Reveal>

      <Reveal>
        <TurkovPromo onOpenCategory={setActiveTurkovCategory} onOpenLead={openLead} />
      </Reveal>

      <Reveal>
        <BrandMarquee />
      </Reveal>

      <Reveal>
        <WorksSection />
      </Reveal>

      <Reveal>
        <EngineeringSection onOpenBrief={openBrief} />
      </Reveal>

      <Reveal>
        <Services onOpenService={openService} />
      </Reveal>

      <Reveal>
        <ServiceSection onOpenLead={openLead} />
      </Reveal>

      <Reveal>
        <ArticlesSection onOpenArticle={setActiveArticle} />
      </Reveal>

      <Reveal>
        <PartnersSection onOpenPartner={openPartner} />
      </Reveal>

      <Reveal>
        <ContactForm onOpenLead={openLead} onOpenContact={openContact} />
      </Reveal>

      <Reveal>
        <Footer />
      </Reveal>

      <BackToTop />

      <ClimateAssistant />

      <AnimatePresence>
        {activeSolution && (
          <SolutionDetailModal
            solution={activeSolution}
            onClose={() => setActiveSolution(null)}
            onOpenLead={openLead}
          />
        )}
        {activeTurkovCategory && (
          <TurkovCategoryModal
            category={activeTurkovCategory}
            onClose={() => setActiveTurkovCategory(null)}
            onOpenLead={openLead}
          />
        )}
        {leadContext && <LeadModal context={leadContext} onClose={() => setLeadContext(null)} />}
        {modalState === "partner" && <PartnerModal onClose={() => setModalState(null)} />}
        {modalState === "contact" && <ContactModal onClose={() => setModalState(null)} />}
        {modalState === "brief" && <BriefGeneratorModal onClose={() => setModalState(null)} />}
      
{calcOpen && (
  <QuickCalcModal
    initialTab={calcTab}
    onClose={closeCalc}
    onOpenLead={(ctx) => {
      closeCalc();
      openLead(ctx);
    }}
  />
)}

{activeService && (
  <ServiceInfoModal
    serviceKey={activeService}
    onClose={() => setActiveService(null)}
    onOpenLead={(ctx) => {
      setActiveService(null);
      openLead(ctx);
    }}
  />
)}
{activeArticle && (
  <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
)}
</AnimatePresence>
    </motion.div>
  );
}
export default function App() {
  return <MainSite />;
}
