import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CheckCircle2,
  Fan,
  FileText,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Send,
  Settings,
  Shield,
  Snowflake,
  Sparkles,
  Thermometer,
  UserCheck,
  Wind,
} from "lucide-react";
import { motion } from "framer-motion";
import { complexSolutions } from "../../data/solutions";
import { getSafeTelegramLink } from "../../utils/safeExternalUrl";

export const TurkovPromo = ({ onOpenLead, onOpenTurkovCatalog }) => (
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

export const Catalog = ({ onOpenSolution }) => {
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

/**
 * Объединённая секция «Почему выбирают нас»: услуги под ключ, инжиниринг, сервис
 */
export const WhyChooseUsSection = ({ onOpenService, onOpenBrief, onOpenLead }) => {
  const services = [
    { key: "vent", icon: Wind, title: "Вентиляция", desc: "Проектирование, поставка, монтаж и пусконаладка систем любой сложности." },
    { key: "ac", icon: Snowflake, title: "Кондиционирование", desc: "Бытовые и коммерческие системы охлаждения: от подбора до сервиса." },
    { key: "auto", icon: Settings, title: "Автоматизация", desc: "Диспетчеризация, умный дом, управление климатом и энергоэффективность." },
    { key: "smoke", icon: Fan, title: "Дымоудаление", desc: "Системы противодымной вентиляции и подпора воздуха для безопасности." },
  ];
  const engineering = [
    { icon: Calculator, title: "Теплотехнический расчёт", desc: "Расчёт теплопритоков и теплопотерь здания." },
    { icon: Wind, title: "Расчёт воздухообмена", desc: "Определение кратности обмена воздуха согласно нормам." },
    { icon: Layers, title: "BIM-моделирование", desc: "Создание 3D-модели систем в Revit." },
    { icon: FileText, title: "Рабочая документация", desc: "Оформление полного комплекта чертежей." },
  ];
  const serviceItems = [
    { h: "Диагностика", p: "Проверка режимов, датчиков, автоматики, протечек, уровня шума и вибраций." },
    { h: "Чистка и дезинфекция", p: "Фильтры, теплообменники, дренаж, внутренние блоки, воздуховоды и решётки." },
    { h: "Пусконаладка и настройка", p: "Балансировка расхода воздуха, настройка контроллеров, рекомендации по эксплуатации." },
  ];

  return (
    <section id="why-us" className="py-8 md:py-14 lg:py-20 bg-slate-950 text-white relative overflow-hidden">
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
        <div className="max-w-4xl mb-6 md:mb-10">
          <h2 className="font-heading text-2xl md:text-4xl font-normal mb-2 md:mb-3 leading-tight uppercase tracking-tighter">
            Почему выбирают нас
          </h2>
          <p className="font-sans text-slate-400 font-normal text-base leading-relaxed tracking-body">
            Полный цикл: от проекта до сервиса. Мы не просто «вешаем ящики» — создаём решения, которые учитывают архитектуру, бюджет и долгосрочную эффективность.
          </p>
        </div>

        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-normal text-blue-400 uppercase tracking-widest mb-4">Услуги под ключ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {services.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => onOpenService(s.key)}
                className="text-left p-4 md:p-5 bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all group"
              >
                <s.icon size={22} className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-base font-normal mb-1 uppercase tracking-wider">{s.title}</h4>
                <p className="text-slate-400 text-xs font-normal leading-relaxed">{s.desc}</p>
                <span className="inline-flex items-center gap-2 text-[10px] font-normal uppercase tracking-widest text-blue-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Подробнее <ArrowRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-normal text-blue-400 uppercase tracking-widest mb-4">Профессиональный инжиниринг</h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {engineering.map((s, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-4 md:p-5 bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-sm">
                  <s.icon size={20} />
                </div>
                <h4 className="text-base font-normal mb-1 uppercase tracking-wider">{s.title}</h4>
                <p className="text-xs text-slate-400 font-normal leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-normal text-blue-400 uppercase tracking-widest mb-4">Сервисное обслуживание</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {serviceItems.map((b) => (
              <div key={b.h} className="p-4 md:p-5 bg-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-xl border border-white/20">
                <div className="text-base font-normal mb-1 md:mb-2">{b.h}</div>
                <div className="text-xs text-slate-300 font-normal leading-relaxed">{b.p}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-1 bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="max-w-xl">
              <h4 className="text-lg md:text-xl font-normal mb-1">Нужна помощь с техзаданием?</h4>
              <p className="text-slate-400 font-normal text-xs">AI-помощник сформирует черновик ТЗ за пару минут.</p>
            </div>
            <button
              onClick={onOpenBrief}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-normal hover:bg-blue-500 transition-all shadow-xl flex items-center gap-2 shrink-0 text-sm"
              type="button"
            >
              <Sparkles size={18} className="text-blue-200" /> AI-генератор ТЗ
            </button>
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-white/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="max-w-xl">
              <h4 className="text-lg md:text-xl font-normal mb-1">Нужен регламент обслуживания?</h4>
              <p className="text-slate-400 font-normal text-xs">Подскажем периодичность, состав работ и подготовим КП под ваш объект.</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenLead("Сервис: Обслуживание")}
              className="px-6 py-3 bg-blue-600 rounded-xl font-normal hover:bg-blue-500 transition-all shadow-xl shrink-0 text-sm"
            >
              Запросить сервис
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const PartnersSection = ({ onOpenPartner }) => {
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

export const ContactForm = ({ onOpenLead, onOpenContact }) => {
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
              href={getSafeTelegramLink(import.meta.env.VITE_TG_BOT_LINK)}
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

export const CTAstrip = () => (
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

export const Footer = () => (
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
              <a href="#why-us" className="hover:text-blue-600 transition-colors">Почему выбирают нас</a>
              <a href="#partners" className="hover:text-blue-600 transition-colors">Партнерам</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Контакты</a>
            </div>
          </div>
          <div>
            <h4 className="text-slate-900 font-normal mb-4 uppercase tracking-widest text-[10px]">
              Клиентам
            </h4>
            <div className="flex flex-col gap-3 font-normal text-slate-600">
              <a href="#why-us" className="hover:text-blue-600 transition-colors">Услуги и сервис</a>
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
