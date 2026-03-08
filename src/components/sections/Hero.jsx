import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const Hero = ({ onOpenCalc, onOpenAssistant, onOpenBrief }) => (
  <section className="relative h-[100vh] flex items-center overflow-hidden bg-slate-900 text-white">
    <div className="absolute inset-0 opacity-40">
      <img
        src="/photos/photo_10_2026-03-02_12-37-33.jpg"
        className="w-full h-full object-cover hero-bg-img md:object-center"
        alt="Background"
        decoding="async"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="inline-flex items-center gap-3 px-3 py-1.5 sm:px-4 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] font-normal uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 md:mb-10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Проектирование • Поставка • Монтаж • Сервис
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight mb-6 md:mb-10">
          Климат{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            как искусство
          </span>
        </h1>

        <p className="max-w-2xl text-base md:text-lg lg:text-xl font-normal text-slate-500 mb-8 md:mb-12 leading-relaxed">
          Проектирование, монтаж и сервис систем вентиляции, кондиционирования, дымоудаления, автоматизации для жилых, коммерческих и промышленных объектов.
        </p>

        <div className="flex flex-wrap gap-3 md:gap-5">
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
          <button
            type="button"
            onClick={onOpenAssistant}
            className="px-10 py-5 bg-emerald-500/90 hover:bg-emerald-500 border border-emerald-400/30 rounded-full font-normal text-lg text-white transition-all text-center flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle size={20} /> AI-консультант на сайте
          </button>
          <button
            type="button"
            onClick={onOpenBrief}
            className="px-10 py-5 bg-white/5 border border-white/20 backdrop-blur-md rounded-full font-normal text-lg hover:bg-white/10 transition-all text-center flex items-center justify-center gap-3"
          >
            <ArrowRight size={20} /> AI-генератор ТЗ
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
