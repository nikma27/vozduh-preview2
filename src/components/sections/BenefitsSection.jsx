import React from "react";
import { Shield, Users, Ruler, Zap, Award } from "lucide-react";

const BENEFITS = [
  {
    icon: Ruler,
    title: "Полный цикл",
    desc: "Проектирование, поставка, монтаж и сервис — всё в одном окне",
  },
  {
    icon: Shield,
    title: "Гарантия",
    desc: "Официальная гарантия на оборудование и выполненные работы",
  },
  {
    icon: Users,
    title: "Опытная команда",
    desc: "Сертифицированные специалисты с опытом от 5 лет",
  },
  {
    icon: Zap,
    title: "Быстрый расчёт",
    desc: "Первичный подбор за 24 часа, выезд на объект по заявке",
  },
  {
    icon: Award,
    title: "Партнёрство",
    desc: "Официальный партнёр ведущих производителей климатического оборудования",
  },
];

const BenefitsSection = () => (
  <section id="benefits" className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
    <div className="container mx-auto px-6">
      <h2 className="font-heading text-3xl md:text-4xl font-normal text-slate-900 mb-4 uppercase tracking-tighter">
        Почему <span className="text-blue-600">Воздух НСК</span>
      </h2>
      <p className="text-slate-600 font-normal mb-12 md:mb-16 max-w-2xl">
        Инжиниринговые решения полного цикла для жилых, коммерческих и промышленных объектов.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
        {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={i}
            className="p-6 md:p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 group"
          >
            <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
              <Icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-normal text-slate-900 mb-2 text-lg">{title}</h3>
            <p className="text-slate-600 text-sm font-normal leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
