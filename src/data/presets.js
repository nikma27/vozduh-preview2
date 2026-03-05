export const VENT_PRESETS = [
  { key: "apartment", name: "Квартира / дом", perPerson: 30, ach: 0.35 },
  { key: "office", name: "Офис", perPerson: 40, ach: 2.0 },
  { key: "cafe", name: "Кафе / ресторан", perPerson: 60, ach: 6.0 },
  { key: "production", name: "Производство", perPerson: 60, ach: 4.0 },
];

export const AC_PRESETS = [
  { key: "res", name: "Жильё", wpm2: 100, q: 35 },
  { key: "office", name: "Офис", wpm2: 120, q: 40 },
  { key: "retail", name: "Торговля", wpm2: 125, q: 40 },
];

export const round1 = (n) => Math.round(n * 10) / 10;

export const pickNearestKW = (kw) => {
  const options = [
    { kw: 2.0, label: "07 (≈2.0 кВт)" },
    { kw: 2.5, label: "09 (≈2.5 кВт)" },
    { kw: 3.5, label: "12 (≈3.5 кВт)" },
    { kw: 5.0, label: "18 (≈5.0 кВт)" },
    { kw: 7.0, label: "24 (≈7.0 кВт)" },
    { kw: 10.0, label: "36 (≈10 кВт)" },
  ];
  let best = options[0];
  for (const o of options) if (Math.abs(o.kw - kw) < Math.abs(best.kw - kw)) best = o;
  return best;
};
