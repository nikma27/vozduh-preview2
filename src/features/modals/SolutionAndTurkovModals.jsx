import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { turkovCategories } from "../../data/turkov";

const PANEL_TRANSITION = { duration: 0.22, ease: [0.22, 1, 0.36, 1] };
const OVERLAY_TRANSITION = { duration: 0.18, ease: "linear" };

export const SolutionDetailModal = ({ solution, onClose, onOpenLead }) => {
  const Icon = solution.icon;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_TRANSITION}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 modal-backdrop"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        transition={PANEL_TRANSITION}
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
                    <img
                      src={item.icon}
                      alt=""
                      className="w-8 h-8 opacity-80 transition-[filter,opacity] group-hover:opacity-100 group-hover:brightness-0 group-hover:invert"
                    />
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
                  <p className="text-slate-600 font-normal mb-4 leading-relaxed text-sm">{item.desc}</p>
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

export const TurkovCategoryModal = ({ category, onClose, onOpenLead }) => {
  const [openSheet, setOpenSheet] = useState(null);
  const infoSheets = category.infoSheets || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_TRANSITION}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 modal-backdrop"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        transition={PANEL_TRANSITION}
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
              <p className="text-xs font-normal text-slate-500 uppercase tracking-widest mb-4">
                Полезная информация
              </p>
              {infoSheets.map((sheet, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenSheet(openSheet === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left font-normal text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{sheet.title}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-500 transition-transform ${
                        openSheet === idx ? "rotate-180" : ""
                      }`}
                    />
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
                  <img
                    src={item.icon}
                    alt=""
                    className="w-6 h-6 opacity-80 transition-[filter,opacity] group-hover:opacity-100 group-hover:brightness-0 group-hover:invert"
                  />
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

export const TurkovCatalogModal = ({ onClose, onOpenCategory }) =>
  createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 font-sans overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_TRANSITION}
        className="absolute inset-0 bg-slate-950/60 modal-backdrop"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={PANEL_TRANSITION}
        className="relative z-10 w-full max-w-6xl max-h-[85dvh] overflow-hidden rounded-xl md:rounded-[2rem] bg-gradient-to-br from-blue-400/25 via-blue-600/30 to-slate-950 text-white shadow-2xl modal-panel"
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
                onClick={() => {
                  onClose();
                  onOpenCategory(item);
                }}
                className="group p-3 sm:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-400/30 to-slate-900/90 border border-blue-400/25 hover:from-blue-400/40 hover:to-slate-800/95 transition-all cursor-pointer flex flex-col min-h-0"
              >
                {item.icon && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-400/25 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:bg-blue-400/35 transition-colors shrink-0">
                    <img
                      src={item.icon}
                      alt=""
                      className="w-3 h-3 sm:w-4 sm:h-4 opacity-90 brightness-0 invert"
                    />
                  </div>
                )}
                <h4 className="font-normal text-white text-[10px] sm:text-xs mb-0.5 uppercase tracking-wide leading-tight line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-slate-300 text-[9px] sm:text-[10px] font-normal line-clamp-2 leading-snug flex-1 min-h-0">
                  {item.description}
                </p>
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
