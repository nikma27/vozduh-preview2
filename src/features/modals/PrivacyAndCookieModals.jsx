import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Shield, X } from "lucide-react";
import { motion } from "framer-motion";

const COOKIE_CONSENT_KEY = "vozduh_cookie_consent_v1";

export const PrivacyPolicyModal = ({ onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 modal-backdrop"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        className="relative z-10 bg-white rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl modal-panel"
      >
        <div className="bg-slate-900 p-6 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-blue-400" />
            <div>
              <h3 className="text-base md:text-lg font-normal">
                Политика обработки персональных данных (152-ФЗ РФ)
              </h3>
              <p className="text-xs text-slate-400 font-normal">
                ООО «ВОЗДУХ НСК» (ИНН 5405074634, ОГРН 1225400025190)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="p-2 hover:bg-white/10 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1">
            <p>
              <strong>Оператор ПДн:</strong> ООО «ВОЗДУХ НСК» (ИНН 5405074634, КПП 540101001, ОГРН 1225400025190)
            </p>
            <p>
              <strong>Адрес местонахождения:</strong> 630015, РФ, Новосибирская обл., г. Новосибирск, ул. Королева, д. 40, корп. 3, оф. 208
            </p>
            <p>
              <strong>Контакты оператора:</strong> info@vozduh-nsk54.ru, +7 (383) 263-15-51
            </p>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-1">
              1. Локализация данных на территории Российской Федерации
            </h4>
            <p>
              В соответствии с ч. 5 ст. 18 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», сбор, запись, систематизация, накопление и хранение всех данных пользователей сайта осуществляются исключительно на серверах, расположенных на территории Российской Федерации. Трансграничная передача данных иностранным сервисам не производится.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-1">
              2. Какие данные мы собираем и зачем
            </h4>
            <p>
              При заполнении форм обратной связи, калькулятора расчёта мощности или генератора технического задания мы обрабатываем: имя (ФИО), номер контактного телефона, город (для анкеты партнёра) и введённые вами параметры помещения. Эти данные используются исключительно для связи инженера с вами и подготовки расчёта оборудования ОВиК.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-1">
              3. Использование технических файлов Cookie и локального хранилища
            </h4>
            <p>
              Сайт использует локальное хранилище браузера для автосохранения введённых вами параметров расчёта, чтобы данные не терялись при случайном закрытии окна или временном обрыве связи.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-1">
              4. Защита данных и порядок отзыва согласия
            </h4>
            <p>
              Передача данных защищена шифрованием HTTPS/TLS, фильтрацией от XSS-инъекций и защитой от автоматического спама. Вы можете в любой момент отозвать согласие и потребовать удаления своих данных, направив письмо на <a href="mailto:info@vozduh-nsk54.ru" className="text-blue-600 underline">info@vozduh-nsk54.ru</a>.
            </p>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href="/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Открыть полную печатную версию документа (152-ФЗ) →
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-normal hover:bg-blue-600 transition-colors"
          >
            Понятно, закрыть
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export const CookieConsentBanner = ({ onOpenPrivacy }) => {
  const [visible, setVisible] = useState(() => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return false;
      return !window.localStorage.getItem(COOKIE_CONSENT_KEY);
    } catch {
      return false;
    }
  });

  const accept = () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-lg z-[85] bg-slate-900/95 backdrop-blur-md text-white p-4 md:p-5 rounded-2xl border border-white/10 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-slate-300 leading-relaxed mb-0">
          Мы используем технические файлы cookie и локальное хранилище на серверах в РФ для сохранения ваших расчётов в соответствии с{" "}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-blue-400 underline hover:text-blue-300"
          >
            Политикой обработки ПДн (152-ФЗ)
          </button>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl shrink-0 transition-colors"
        >
          Принять
        </button>
      </div>
    </div>
  );
};
