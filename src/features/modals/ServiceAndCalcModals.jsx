import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Calculator, X } from "lucide-react";
import { motion } from "framer-motion";
import { SERVICE_INFO } from "../../data/services";
import { AC_PRESETS, VENT_PRESETS, pickNearestKW, round1 } from "../../data/presets";

const PANEL_TRANSITION = { duration: 0.22, ease: [0.22, 1, 0.36, 1] };
const OVERLAY_TRANSITION = { duration: 0.18, ease: "linear" };

export const ServiceInfoModal = ({ serviceKey, onClose, onOpenLead }) => {
  const item = SERVICE_INFO[serviceKey];
  if (!item) return null;
  const Icon = item.icon;

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
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        transition={PANEL_TRANSITION}
        className="relative z-10 bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl modal-panel"
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

export const QuickCalcModal = ({ initialTab = "vent", onClose, onOpenLead }) => {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_TRANSITION}
        className="absolute inset-0 bg-slate-900/70 modal-backdrop"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={PANEL_TRANSITION}
        className="relative z-10 bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] modal-panel"
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
