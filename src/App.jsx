import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Wind,
  Thermometer,
  Settings,
  Fan,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
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
  Shield,
  Package,
  BadgeCheck,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import BrandMarquee from "./components/BrandMarquee";
import WorksMarquee from "./components/WorksMarquee";
import Navbar from "./components/sections/Navbar";
import Hero from "./components/sections/Hero";
import BenefitsSection from "./components/sections/BenefitsSection";
import { postLead } from "./api/leads";
import { fetchGeminiResponse } from "./api/gemini";
import { complexSolutions } from "./data/solutions";
import { turkovCategories } from "./data/turkov";
import { VENT_PRESETS, AC_PRESETS, round1, pickNearestKW } from "./data/presets";
import { SERVICE_INFO } from "./data/services";

/**
 * 1) Data - imported from ./data/ (solutions, turkov, presets, services)
 */

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

const LeadModal = ({ onClose, leadContext }) => {
  const ctx = typeof leadContext === "string" ? leadContext : leadContext?.context ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(typeof leadContext === "object" ? (leadContext?.name ?? "") : "");
  const [phone, setPhone] = useState(typeof leadContext === "object" ? (leadContext?.phone ?? "") : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await postLead({ type: "lead", context: ctx, name, phone });
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
            <h3 className="text-lg font-normal leading-tight text-slate-900">{ctx}</h3>
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
 * 3) Sections (Navbar, Hero вынесены в components/sections/)
 */
const TurkovCategoryModal = ({ category, onClose, onOpenLead }) => {
  const [openSheet, setOpenSheet] = useState(null);
  const infoSheets = category.infoSheets || [];
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
        className="bg-white w-full max-w-2xl md:rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl"
      >
        <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
          <img src={category.icon} alt="" className="w-20 h-20 md:w-24 md:h-24 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <h2 className="text-2xl md:text-3xl font-normal tracking-tight">{category.title}</h2>
          </div>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto max-h-[70vh]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-normal text-blue-600 uppercase tracking-widest">TURKOV</span>
            <button onClick={onClose} type="button" className="p-2 hover:bg-slate-50 rounded-full">
              <X size={24} />
            </button>
          </div>

          <p className="text-slate-600 font-normal mb-6 leading-relaxed">{category.description}</p>

          {infoSheets.length > 0 && (
            <div className="mb-8 space-y-2">
              <p className="text-xs font-normal text-slate-500 uppercase tracking-widest mb-4">Полезная информация</p>
              {infoSheets.map((sheet, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenSheet(openSheet === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left font-normal text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{sheet.title}</span>
                    <ChevronDown size={18} className={`text-slate-500 transition-transform ${openSheet === idx ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openSheet === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
                          {sheet.content && <p className="mb-0">{sheet.content}</p>}
                          {sheet.bullets && (
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              {sheet.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-5">
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
};

const TurkovCatalogModal = ({ onClose, onOpenCategory }) =>
  createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 font-sans overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative z-10 w-full max-w-6xl max-h-[85dvh] overflow-hidden rounded-xl md:rounded-[2rem] bg-gradient-to-br from-blue-400/25 via-blue-600/30 to-slate-950 text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-white transition-colors"
        >
          <X size={18} />
        </button>
        <div className="p-3 sm:p-5 md:p-6 overflow-y-auto max-h-[85dvh] no-scrollbar overscroll-contain">
          <h3 className="font-heading text-base sm:text-lg md:text-xl font-normal text-white uppercase tracking-tight mb-3 sm:mb-5">
            Каталог TURKOV
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {turkovCategories.map((item) => (
              <div
                key={item.id}
                onClick={() => { onClose(); onOpenCategory(item); }}
                className="group p-3 sm:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-400/30 to-slate-900/90 border border-blue-400/25 hover:from-blue-400/40 hover:to-slate-800/95 transition-all cursor-pointer flex flex-col min-h-0"
              >
                {item.icon && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-400/25 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:bg-blue-400/35 transition-colors shrink-0">
                    <img src={item.icon} alt="" className="w-3 h-3 sm:w-4 sm:h-4 opacity-90 brightness-0 invert" />
                  </div>
                )}
                <h4 className="font-normal text-white text-[10px] sm:text-xs mb-0.5 uppercase tracking-wide leading-tight line-clamp-2">{item.title}</h4>
                <p className="text-slate-300 text-[9px] sm:text-[10px] font-normal line-clamp-2 leading-snug flex-1 min-h-0">{item.description}</p>
                <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] text-blue-200 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Подробнее <ArrowRight size={10} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );

const TurkovPromo = ({ onOpenCategory, onOpenLead, onOpenTurkovCatalog }) => (
  <section
    id="turkov"
    className="py-10 md:py-20 relative overflow-hidden"
    style={{ backgroundColor: "#0f172a" }}
  >
    <div
      className="absolute inset-0 z-0 bg-section-turkov"
      style={{
        backgroundImage: "url(/turkov-catalogue-images/Cover_bg_8.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent z-[1]" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="max-w-2xl">
          <span className="text-xs font-normal text-blue-400 uppercase tracking-widest mb-3 block">Официальный дилер</span>
          <h2 className="text-3xl md:text-5xl font-normal text-white mb-4 leading-tight uppercase tracking-tight">
            TURKOV
          </h2>
          <p className="text-slate-300 font-normal leading-relaxed mb-4">
            TURKOV — российский производитель энергоэффективных климатических систем, ведущий свою деятельность с 2012 года.
            Специализация: разработка и изготовление оборудования для объектов любого масштаба — от квартир до промышленных предприятий.
          </p>
          <p className="text-slate-200 font-medium text-sm">
            Воздух НСК является официальным дилером производителя TURKOV.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => onOpenLead("TURKOV — общий запрос")}
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-normal text-sm uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all"
            type="button"
          >
            Запросить консультацию
          </button>
          <button
            onClick={onOpenTurkovCatalog}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-normal text-sm uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            type="button"
          >
            Каталог TURKOV
          </button>
        </div>
      </div>

      <div className="mb-10 md:mb-14">
        <h3 className="font-heading text-2xl md:text-3xl font-normal text-white mb-8 uppercase tracking-tight">
          Вентиляция TURKOV — это на всю жизнь
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          <div className="group p-6 md:p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/15 transition-all cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-all">
              <Shield size={20} className="text-white" />
            </div>
            <h4 className="font-normal text-white mb-1.5 text-sm uppercase tracking-wide">Расширенная гарантия</h4>
            <p className="text-slate-300 text-xs font-normal leading-relaxed line-clamp-3">
              Как завод-производитель, мы даём 3 года гарантии на установку в сборе и 7 лет — на рекуператоры.
            </p>
          </div>
          <div className="group p-6 md:p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/15 transition-all cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-all">
              <Thermometer size={20} className="text-white" />
            </div>
            <h4 className="font-normal text-white mb-1.5 text-sm uppercase tracking-wide">Под любые климатические условия</h4>
            <p className="text-slate-300 text-xs font-normal leading-relaxed line-clamp-3">
              От влажности Черноморского побережья до морозов Крайнего Севера. Подбор вентиляции под ваш регион.
            </p>
          </div>
          <div className="group p-6 md:p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/15 transition-all cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-all">
              <Package size={20} className="text-white" />
            </div>
            <h4 className="font-normal text-white mb-1.5 text-sm uppercase tracking-wide">Комплектующие всегда в наличии</h4>
            <p className="text-slate-300 text-xs font-normal leading-relaxed line-clamp-3">
              Собственное производство. Дополните установку опциональным оборудованием или замените любую деталь.
            </p>
          </div>
          <div className="group p-6 md:p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/15 transition-all cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-all">
              <BadgeCheck size={20} className="text-white" />
            </div>
            <h4 className="font-normal text-white mb-1.5 text-sm uppercase tracking-wide">Подтверждено сертификатами</h4>
            <p className="text-slate-300 text-xs font-normal leading-relaxed line-clamp-3">
              Только проверенные материалы, отвечающие пожаробезопасным и санэпидемиологическим требованиям.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Catalog = ({ onOpenSolution }) => {
  const [segment, setSegment] = useState("life");
  const items = useMemo(() => complexSolutions.filter((s) => s.segment === segment), [segment]);

  return (
    <section id="catalog" className="py-10 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-20 gap-4 md:gap-10">
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
              className="group relative h-[280px] sm:h-[320px] md:h-[400px] lg:h-[480px] rounded-2xl md:rounded-[2.5rem] overflow-hidden cursor-pointer bg-slate-100 shadow-sm hover:shadow-2xl transition-all border border-slate-100"
            >
              <img
                src={item.image}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 md:duration-700 group-hover:scale-110"
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
    <section id="engineering" className="py-10 md:py-24 lg:py-32 bg-slate-950 text-white relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-section-engineering"
        style={{
          backgroundImage: "url(/photos/photo_5_2026-03-02_12-38-04.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-blue-950/40 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/60 to-transparent z-[2]" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mb-8 md:mb-20 text-center mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-normal mb-4 md:mb-6 leading-tight uppercase tracking-tighter">
            Профессиональный инжиниринг
          </h2>
          <p className="font-sans text-slate-400 font-normal text-lg leading-relaxed tracking-body">
            Мы не просто «вешаем ящики», а создаем проект, который учитывает архитектуру, бюджет и долгосрочную эффективность.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-20"
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
              className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/15 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-110 transition-all">
                <s.icon size={24} />
              </div>
              <h4 className="text-lg font-normal mb-3 uppercase tracking-wider">{s.title}</h4>
              <p className="text-sm text-slate-400 font-normal leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[3rem] p-6 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
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
    <section id="partners" className="py-10 md:py-20 lg:py-28 bg-white text-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8 md:mb-16 max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-normal mb-3 md:mb-5 tracking-tight leading-tight">
            Сотрудничество для профессионалов
          </h2>
          <p className="font-sans text-slate-600 font-normal text-lg leading-relaxed tracking-body">
            Мы становимся вашим инженерным отделом. Вы творите — мы обеспечиваем техническую реализацию.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 mb-8 md:mb-16">
          {benefits.map((b, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 p-6 md:p-10 rounded-[2.5rem]">
              <h3 className="text-xl md:text-2xl font-normal text-blue-600 mb-4 md:mb-6">{b.title}</h3>
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
    <section id="services" className="py-10 md:py-24 bg-white border-t border-slate-100">
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

const ContactForm = ({ onOpenLead, onOpenContact }) => {
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  return (
  <section id="contact" className="py-10 md:py-24 lg:py-32 bg-white">
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

          <a
            href={import.meta.env.VITE_TG_BOT_LINK || "https://t.me/vozduh_nsk_bot"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 shrink-0 group-hover:bg-blue-600/30 transition-colors">
                <MessageCircle size={28} />
              </div>
              <div>
                <h4 className="font-normal text-white mb-2 uppercase tracking-wide">
                  Воспользуйтесь нашим универсальным ТГ ботом техническим консультантом
                </h4>
                <p className="text-slate-400 text-sm font-normal">
                  Ответит на все ваши вопросы по вентиляции, кондиционированию и климатическому оборудованию.
                </p>
              </div>
            </div>
          </a>
        </div>

        <div className="lg:w-1/2 relative z-10 flex flex-col justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onOpenLead("Главная форма контактов", { name: formName, phone: formPhone });
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
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-blue-500 transition-all font-normal"
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                required
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
};

const CTAstrip = () => (
  <section className="py-8 md:py-12 bg-blue-600 text-white">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
      <p className="font-heading text-xl md:text-2xl font-normal uppercase tracking-tight text-center sm:text-left">
        Нужна консультация? Звоните
      </p>
      <a
        href="tel:+73832631551"
        className="px-8 py-4 bg-white text-blue-600 rounded-full font-normal text-lg hover:bg-slate-100 transition-colors shrink-0"
      >
        +7 (383) 263-15-51
      </a>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-10 md:py-20 lg:py-24 bg-slate-50 border-t border-slate-200">
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
              <a href="#catalog" className="hover:text-blue-600 transition-colors">Решения</a>
              <a href="#benefits" className="hover:text-blue-600 transition-colors">Почему мы</a>
              <a href="#engineering" className="hover:text-blue-600 transition-colors">Инжиниринг</a>
              <a href="#partners" className="hover:text-blue-600 transition-colors">Партнерам</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Контакты</a>
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 font-normal mb-4 uppercase tracking-widest text-[10px]">
              Клиентам
            </h4>
            <div className="flex flex-col gap-3 font-normal text-slate-600">
              <a href="#service" className="hover:text-blue-600 transition-colors">Сервис</a>
              <a href="#benefits" className="hover:text-blue-600 transition-colors">Гарантии</a>
              <a href="#catalog" className="hover:text-blue-600 transition-colors">Решения</a>
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

// --- Сервисное обслуживание ---
const ServiceSection = ({ onOpenLead }) => (
  <section id="service" className="py-10 md:py-24 bg-slate-950 text-white">
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
    let lastCall = 0;
    const THROTTLE_MS = 100;
    const onScroll = () => {
      if (ticking) return;
      const now = Date.now();
      if (now - lastCall < THROTTLE_MS) return;
      ticking = true;
      lastCall = now;
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
  const isInView = useInView(ref, { once: true, amount: 0.08, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`section-reveal transition-all duration-500 ${isInView ? "is-visible" : ""}`}
    >
      {children}
    </motion.div>
  );
};
function MainSite() {
  const [activeSolution, setActiveSolution] = useState(null);
  const [activeTurkovCategory, setActiveTurkovCategory] = useState(null);
  const [turkovCatalogOpen, setTurkovCatalogOpen] = useState(false);
  const [leadContext, setLeadContext] = useState(null);
  const [modalState, setModalState] = useState(null);

const [activeService, setActiveService] = useState(null);
const [calcOpen, setCalcOpen] = useState(false);
const [calcTab, setCalcTab] = useState("vent");
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

const modalOpen = turkovCatalogOpen || activeTurkovCategory || modalState || leadContext || activeSolution || activeService || calcOpen;
useEffect(() => {
  if (modalOpen) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "";
  return () => { document.body.style.overflow = ""; };
}, [modalOpen]);
// 'contact' | 'partner' | 'brief'

  const openContact = () => setModalState("contact");
  const openPartner = () => setModalState("partner");
  const openBrief = () => setModalState("brief");
  const openLead = (ctx, prefill) => setLeadContext(prefill ? { context: ctx, ...prefill } : ctx);

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
        <TurkovPromo
          onOpenCategory={setActiveTurkovCategory}
          onOpenLead={openLead}
          onOpenTurkovCatalog={() => setTurkovCatalogOpen(true)}
        />
      </Reveal>

      <Reveal>
        <BrandMarquee />
      </Reveal>

      <Reveal>
        <WorksMarquee />
      </Reveal>

      <Reveal>
        <BenefitsSection />
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
        <PartnersSection onOpenPartner={openPartner} />
      </Reveal>

      <Reveal>
        <ContactForm onOpenLead={openLead} onOpenContact={openContact} />
      </Reveal>

      <Reveal>
        <CTAstrip />
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
        {turkovCatalogOpen && (
          <TurkovCatalogModal
            onClose={() => setTurkovCatalogOpen(false)}
            onOpenCategory={(item) => {
              setTurkovCatalogOpen(false);
              setActiveTurkovCategory(item);
            }}
          />
        )}
        {activeTurkovCategory && (
          <TurkovCategoryModal
            category={activeTurkovCategory}
            onClose={() => {
              setActiveTurkovCategory(null);
              setTurkovCatalogOpen(true);
            }}
            onOpenLead={openLead}
          />
        )}
        {leadContext && <LeadModal leadContext={leadContext} onClose={() => setLeadContext(null)} />}
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
</AnimatePresence>
    </motion.div>
  );
}
export default function App() {
  return <MainSite />;
}
