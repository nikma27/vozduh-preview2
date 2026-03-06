import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wind, Menu, X } from "lucide-react";

const navLinks = [
  { name: "РЕШЕНИЯ", href: "#catalog" },
  { name: "ПРОИЗВОДИТЕЛИ", href: "#manufacturers" },
  { name: "РАБОТЫ", href: "#works" },
  { name: "ИНЖИНИРИНГ", href: "#engineering" },
  { name: "СЕРВИС", href: "#service" },
  { name: "ПАРТНЕРАМ", href: "#partners" },
  { name: "КОНТАКТЫ", href: "#contact" },
];

/**
 * Шапка сайта: логотип, навигация, кнопка заявки, мобильное меню.
 * Троттлинг scroll (100ms + RAF) для isScrolled — меньше re-render при прокрутке.
 */
const Navbar = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastCall = 0;
    const THROTTLE_MS = 100;
    const handleScroll = () => {
      if (ticking) return;
      const now = Date.now();
      if (now - lastCall < THROTTLE_MS) return;
      ticking = true;
      lastCall = now;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <span className="inline-block animate-[logoFlow_0.5s_ease-out_forwards]">Воздух</span>
            <span className="text-blue-600 inline-block animate-[logoFlow_0.5s_ease-out_0.03s_forwards]">НСК</span>
          </span>
        </a>

        <div className="hidden xl:flex items-center gap-4 xl:gap-5 2xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-nav font-normal hover:text-blue-500 hover:font-normal transition-colors text-slate-800 whitespace-nowrap uppercase"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-3 xl:gap-4 2xl:gap-6">
          <div className="flex flex-col items-end text-nav text-slate-900">
            <span className="font-normal">+7 (383) 263-15-51</span>
          </div>
          <button
            onClick={onOpenContact}
            className="text-nav px-3 sm:px-4 lg:px-4 xl:px-5 py-1.5 rounded-full font-normal transition-all hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 uppercase"
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
                  <span className="relative z-10 group-hover:text-blue-600 transition-colors uppercase">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-slate-200 text-center shrink-0 pb-6">
              <a href="tel:+73832631551" className="block text-2xl font-normal mb-2 text-slate-900">
                +7 (383) 263-15-51
              </a>
              <p className="text-slate-600 mb-4 font-normal">Новосибирск, ул. Королева 40</p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-normal uppercase"
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

export default Navbar;
