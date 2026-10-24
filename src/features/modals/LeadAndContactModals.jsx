import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Loader2, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  formatPhoneInput,
  getLeadDraft,
  isValidPhone,
  postLead,
  saveLeadDraft,
} from "../../api/leads";
import { fetchGeminiResponse } from "../../api/gemini";

const PANEL_TRANSITION = { duration: 0.22, ease: [0.22, 1, 0.36, 1] };
const OVERLAY_TRANSITION = { duration: 0.18, ease: "linear" };

export const ContactModal = ({ onClose, title = "Оставить заявку" }) => {
  const draft = useMemo(() => getLeadDraft(), []);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(draft.name || "");
  const [phone, setPhone] = useState(draft.phone ? formatPhoneInput(draft.phone) : "");
  const [hp, setHp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    saveLeadDraft({ name, phone });
  }, [name, phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg("");

    if (!isValidPhone(phone)) {
      setErrorMsg("Введите корректный номер телефона (+7 и 10 цифр).");
      return;
    }

    setLoading(true);
    try {
      await postLead({ type: "contact", context: title, name: name.trim(), phone, hp });
      setSubmitted(true);
      setTimeout(onClose, 1600);
    } catch {
      setErrorMsg("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_TRANSITION}
        className="absolute inset-0 bg-slate-900/60 modal-backdrop"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.985 }}
        transition={PANEL_TRANSITION}
        className="relative z-10 bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl modal-panel"
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
                type="text"
                name="website"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                maxLength={100}
                placeholder="Ваше имя"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-normal text-user-msg"
              />
              <input
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhoneInput(e.target.value));
                  if (errorMsg) setErrorMsg("");
                }}
                type="tel"
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-normal text-user-msg"
              />
              {errorMsg && (
                <p className="text-xs text-red-600 font-normal">{errorMsg}</p>
              )}
              <button
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-normal disabled:opacity-60"
              >
                {loading ? "Отправляем..." : "Жду звонка"}
              </button>
              <p className="text-[10px] text-center text-slate-500">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a
                  href="/privacy-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  политикой обработки персональных данных (152-ФЗ РФ)
                </a>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export const PartnerModal = ({ onClose }) => {
  const draft = useMemo(() => getLeadDraft(), []);
  const [form, setForm] = useState({
    fio: draft.fio || draft.name || "",
    phone: draft.phone ? formatPhoneInput(draft.phone) : "",
    city: draft.city || "",
    role: draft.role || "designer",
    activity: "",
  });
  const [hp, setHp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => {
    setForm((p) => {
      const next = { ...p, [k]: v };
      saveLeadDraft({
        fio: next.fio,
        name: next.fio || draft.name,
        phone: next.phone,
        city: next.city,
        role: next.role,
      });
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg("");

    if (!isValidPhone(form.phone)) {
      setErrorMsg("Введите корректный номер телефона (+7 и 10 цифр).");
      return;
    }

    setLoading(true);
    try {
      await postLead({
        type: "partner",
        context: "Анкета партнера",
        name: form.fio.trim(),
        phone: form.phone,
        payload: form,
        hp,
      });
      setSubmitted(true);
      setTimeout(onClose, 1800);
    } catch {
      setErrorMsg("Не удалось отправить анкету. Попробуйте ещё раз.");
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_TRANSITION}
        className="absolute inset-0 bg-slate-900/60 modal-backdrop"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.985 }}
        transition={PANEL_TRANSITION}
        className="relative z-10 bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl modal-panel"
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
              <input
                type="text"
                name="website"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
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
                maxLength={120}
                placeholder="Ваше ФИО"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                value={form.fio}
                onChange={(e) => setField("fio", e.target.value)}
              />
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Город"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
              <input
                type="tel"
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                value={form.phone}
                onChange={(e) => {
                  setField("phone", formatPhoneInput(e.target.value));
                  if (errorMsg) setErrorMsg("");
                }}
              />
              {errorMsg && (
                <p className="text-xs text-red-600 font-normal">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-normal text-lg shadow-lg disabled:opacity-60"
              >
                {loading ? "Отправляем..." : "Отправить анкету"}
              </button>
              <p className="text-[10px] text-center text-slate-500">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a
                  href="/privacy-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  политикой обработки персональных данных (152-ФЗ РФ)
                </a>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export const BriefGeneratorModal = ({ onClose, onOpenLead }) => {
  const savedBrief = useMemo(() => getLeadDraft()?.brief || {}, []);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: savedBrief.type || "",
    area: savedBrief.area || "",
    height: savedBrief.height || "",
    people: savedBrief.people || "",
  });
  const [generatedBrief, setGeneratedBrief] = useState(savedBrief.generatedBrief || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    saveLeadDraft({
      brief: { ...formData, generatedBrief },
    });
  }, [formData, generatedBrief]);

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_TRANSITION}
        className="absolute inset-0 bg-slate-900/70 modal-backdrop"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.985 }}
        transition={PANEL_TRANSITION}
        className="relative z-10 bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] modal-panel"
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
                  value={formData.type}
                  maxLength={120}
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                  placeholder="Тип объекта (Кафе, офис...)"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <input
                  type="number"
                  value={formData.area}
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                  placeholder="Площадь (м2)"
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
                <input
                  type="number"
                  value={formData.height}
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                  placeholder="Высота потолков (м)"
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
                <input
                  type="number"
                  value={formData.people}
                  className="p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-user-msg"
                  placeholder="Кол-во людей"
                  onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !formData.type.trim()}
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
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-slate-200 rounded-xl font-normal text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Изменить данные
                </button>
                {onOpenLead && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenLead("AI Генератор ТЗ (Расчёт инженера)", {
                        payload: {
                          objectType: formData.type,
                          areaM2: formData.area,
                          heightM: formData.height,
                          people: formData.people,
                          brief: generatedBrief,
                          summary: `${formData.type}, ${formData.area || "—"} м², h=${formData.height || "—"} м, ${formData.people || "—"} чел.`,
                        },
                      });
                    }}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-normal hover:bg-blue-700 transition-all"
                  >
                    Передать ТЗ инженеру
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-32 py-4 bg-slate-900 text-white rounded-xl font-normal hover:bg-slate-800 transition-all"
                >
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

export const LeadModal = ({ onClose, leadContext }) => {
  const draft = useMemo(() => getLeadDraft(), []);
  const ctx = typeof leadContext === "string" ? leadContext : leadContext?.context ?? "";
  const attachedPayload = typeof leadContext === "object" ? leadContext?.payload : undefined;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(
    (typeof leadContext === "object" && leadContext?.name) || draft.name || ""
  );
  const [phone, setPhone] = useState(
    typeof leadContext === "object" && leadContext?.phone
      ? formatPhoneInput(leadContext.phone)
      : draft.phone
        ? formatPhoneInput(draft.phone)
        : ""
  );
  const [hp, setHp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    saveLeadDraft({ name, phone });
  }, [name, phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg("");

    if (!isValidPhone(phone)) {
      setErrorMsg("Введите корректный номер телефона (+7 и 10 цифр).");
      return;
    }

    setLoading(true);
    try {
      await postLead({
        type: "lead",
        context: ctx,
        name: name.trim(),
        phone,
        payload: attachedPayload,
        hp,
      });
      setSubmitted(true);
      setTimeout(onClose, 1600);
    } catch {
      setErrorMsg("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_TRANSITION}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 modal-backdrop"
      />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.985 }}
        transition={PANEL_TRANSITION}
        className="bg-white rounded-3xl w-full max-w-md relative z-10 p-8 shadow-2xl modal-panel"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-[10px] font-normal text-blue-600 uppercase tracking-widest mb-1">
              Раздел:
            </div>
            <h3 className="text-lg font-normal leading-tight text-slate-900">{ctx}</h3>
            {attachedPayload?.summary && (
              <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                Параметры: {attachedPayload.summary}
              </p>
            )}
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
              type="text"
              name="website"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              maxLength={100}
              placeholder="Ваше имя"
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-normal text-user-msg transition-all"
            />
            <input
              value={phone}
              onChange={(e) => {
                setPhone(formatPhoneInput(e.target.value));
                if (errorMsg) setErrorMsg("");
              }}
              type="tel"
              required
              placeholder="+7 (___) ___-__-__"
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-normal text-user-msg transition-all"
            />
            {errorMsg && (
              <p className="text-xs text-red-600 font-normal">{errorMsg}</p>
            )}
            <button
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-normal hover:bg-blue-600 transition-all disabled:opacity-60"
            >
              {loading ? "Отправляем..." : "Запросить подбор"}
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a
                href="/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                политикой обработки персональных данных (152-ФЗ РФ)
              </a>
            </p>
          </form>
        )}
      </motion.div>
    </div>,
    document.body
  );
};
