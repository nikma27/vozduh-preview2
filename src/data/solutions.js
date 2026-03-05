import { Wind, Snowflake, Droplets, Waves, Utensils, Factory } from "lucide-react";

/**
 * Комплексные решения по сегментам: life, business, industry
 */
export const complexSolutions = [
  // LIFE
  {
    id: "life-ac",
    segment: "life",
    icon: Snowflake,
    title: "Кондиционирование жилья",
    description:
      "Комфортная прохлада без сквозняков: тихие инверторные системы и аккуратная интеграция в интерьер.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Инверторные системы",
        desc: "Тихие решения для спален: плавное охлаждение без ледяного потока.",
        icon: "/icons/inverter.svg",
        subImage:
          "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Мульти-сплит",
        desc: "Один внешний блок — до 5 комнат. Удобно для фасадных ограничений.",
        icon: "/icons/multi-split.svg",
        subImage:
          "https://images.unsplash.com/photo-1627236585127-18c72807e335?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Канальные системы",
        desc: "Скрытый монтаж: видны только решётки/диффузоры. Максимальная эстетика.",
        icon: "/icons/duct.svg",
        subImage:
          "https://images.unsplash.com/photo-1596238612140-52cb23214b2d?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "life-vent",
    segment: "life",
    icon: Wind,
    title: "Вентиляция квартиры и дома",
    description:
      "Свежий воздух 24/7 при закрытых окнах. Фильтрация пыли, аллергенов и контроль CO₂.",
    image:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Бризеры",
        desc: "Приток в одну комнату: подогрев, фильтрация, тихая работа.",
        icon: "/icons/breezer.svg",
        subImage:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "ПВУ с рекуперацией",
        desc: "Экономия тепла до 80%: приток нагревается вытяжным воздухом.",
        icon: "/icons/recuperation.svg",
        subImage:
          "https://images.unsplash.com/photo-1581093583449-8255a6d338ce?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Умные режимы",
        desc: "Автоматическая подача по датчикам (CO₂/влажность/присутствие).",
        icon: "/icons/smart-modes.svg",
        subImage:
          "https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "life-humid",
    segment: "life",
    icon: Droplets,
    title: "Увлажнение воздуха",
    description:
      "Здоровый микроклимат и сохранность отделки. Автоподдержание 40–60% зимой.",
    image:
      "/photos/photo_6_2026-03-02_12-37-46.jpg",
    details: [
      {
        title: "Форсуночное увлажнение",
        desc: "Микрораспыление воды: эффективно и гигиенично при правильной подготовке.",
        icon: "/icons/spray-humid.svg",
        subImage:
          "https://images.unsplash.com/photo-1534127003460-6b6070a319f0?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Адиабатическое",
        desc: "Естественное испарение через канальные блоки вентиляции.",
        icon: "/icons/adiabatic.svg",
        subImage:
          "https://images.unsplash.com/photo-1585776245991-cf79dd8fc78b?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "life-dry",
    segment: "life",
    icon: Waves,
    title: "Осушение (бассейны)",
    description:
      "Защита от плесени и конденсата в зонах бассейнов/саун. Контроль точки росы.",
    image:
      "/photos/bassein-1.jpg",
    details: [
      {
        title: "Настенные осушители",
        desc: "Компактные решения для небольших бассейнов и купелей.",
        icon: "/icons/wall-dehumidifier.svg",
        subImage:
          "https://images.unsplash.com/photo-1563456073177-380d381b83d8?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Канальные системы",
        desc: "Скрытый монтаж + подмес свежего воздуха: полный климат-контроль.",
        icon: "/icons/duct.svg",
        subImage:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  // BUSINESS
  {
    id: "biz-ac",
    segment: "business",
    icon: Snowflake,
    title: "Коммерческий холод",
    description:
      "Офисы, отели, торговые залы: энергоэффективность и централизованное управление.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "VRF/VRV",
        desc: "Многозональное управление климатом здания с одной точкой подключения.",
        subImage:
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Кассетные блоки",
        desc: "Равномерная подача 360° — идеальна для Open Space.",
        subImage:
          "https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Прецизионные",
        desc: "Точное поддержание температуры/влажности для серверных и ЦОД.",
        subImage:
          "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "biz-vent",
    segment: "business",
    icon: Utensils,
    title: "Вентиляция HoReCa",
    description:
      "Ресторанные и кухонные зоны: удаление запахов, жира и избыточного тепла.",
    image:
      "/photos/horeca-ducts.jpg",
    details: [
      {
        title: "Вытяжные зонты",
        desc: "Эффективное удаление жира и жара, лабиринтные фильтры.",
        subImage:
          "https://images.unsplash.com/photo-1621871908119-28a5b35c03eb?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Общеобменная",
        desc: "Подготовка и подача свежего воздуха в залы для гостей.",
        subImage:
          "https://images.unsplash.com/photo-1599407357322-92df91866782?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  // INDUSTRY
  {
    id: "ind-cool",
    segment: "industry",
    icon: Factory,
    title: "Промышленный холод",
    description:
      "Технологическое охлаждение оборудования и складов. Мегаваттные мощности.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80",
    details: [
      {
        title: "Модульные чиллеры",
        desc: "Высокая мощность для систем вода–воздух и охлаждения станков.",
        subImage:
          "https://images.unsplash.com/photo-1590636735492-36c997321a0f?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Градирни",
        desc: "Охлаждение технической воды для производственных циклов.",
        subImage:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "ККБ",
        desc: "Компрессорно-конденсаторные блоки для интеграции в приточные установки.",
        subImage:
          "https://images.unsplash.com/photo-1565193566173-0923d5a633f3?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "ind-vent",
    segment: "industry",
    icon: Wind,
    title: "Пром. вентиляция",
    description:
      "Аспирация и очистка воздуха в цехах. Работа с агрессивными средами и температурами.",
    image:
      "/photos/photo_5_2026-03-02_12-38-04.jpg",
    details: [
      {
        title: "Аспирация",
        desc: "Удаление пыли, стружки, сварочных аэрозолей и выбросов.",
        subImage:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Дымоудаление",
        desc: "Противопожарная безопасность: удаление дыма и подпор воздуха.",
        subImage:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];
