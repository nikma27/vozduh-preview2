import React from 'react';

const brands = [
  "DAICHI", "MIDEA", "DAIKIN", "KENTATSU", "AXIOMA",
  "TION", "BALLU", "VENTS", "KORF", "BREEZART"
];

const BrandMarquee = () => (
  <section id="manufacturers" className="py-10 md:py-16 bg-white border-y border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 mb-6 md:mb-10 text-center">
      <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        Наши основные бренды
      </p>
    </div>
    <div className="relative flex overflow-x-hidden">
      <div className="marquee-track flex whitespace-nowrap gap-20 items-center">
        {[...brands, ...brands].map((b, i) => (
          <span
            key={`${b}-${i}`}
            className="font-heading text-3xl font-bold text-slate-200 hover:text-blue-600 transition-colors cursor-default select-none"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default BrandMarquee;
