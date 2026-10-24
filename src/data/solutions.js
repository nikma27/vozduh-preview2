import { Wind, Snowflake, Droplets, Waves, Utensils, Factory } from "lucide-react";

/**
 * Комплексные решения по сегментам: life, business, industry.
 * Все изображения и иконки хранятся локально на российском сервере (/photos/ и /icons/),
 * исключая внешние запросы к зарубежным CDN.
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
    image: "/photos/ac-apartment-wide.jpg",
    fallbackImage: "/photos/ac-apartment-wide.jpg",
    details: [
      {
        title: "Инверторные системы",
        desc: "Тихие решения для спален: плавное охлаждение без ледяного потока.",
        icon: "/icons/inverter.svg",
        subImage: "/photos/ac-apartment-wide.jpg",
      },
      {
        title: "Мульти-сплит",
        desc: "Один внешний блок — до 5 комнат. Удобно для фасадных ограничений.",
        icon: "/icons/multi-split.svg",
        subImage: "/photos/ac-apartment-wide.jpg",
      },
      {
        title: "Канальные системы",
        desc: "Скрытый монтаж: видны только решётки/диффузоры. Максимальная эстетика.",
        icon: "/icons/duct.svg",
        subImage: "/photos/home-vent-diffuser.jpg",
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
    image: "/photos/home-vent-diffuser.jpg",
    fallbackImage: "/photos/home-vent-diffuser.jpg",
    details: [
      {
        title: "Бризеры",
        desc: "Приток в одну комнату: подогрев, фильтрация, тихая работа.",
        icon: "/icons/breezer.svg",
        subImage: "/photos/home-vent-diffuser.jpg",
      },
      {
        title: "ПВУ с рекуперацией",
        desc: "Экономия тепла до 80%: приток нагревается вытяжным воздухом.",
        icon: "/icons/recuperation.svg",
        subImage: "/photos/vent-units.jpg",
      },
      {
        title: "Умные режимы",
        desc: "Автоматическая подача по датчикам (CO₂/влажность/присутствие).",
        icon: "/icons/smart-modes.svg",
        subImage: "/photos/control-panel.jpg",
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
    image: "/photos/photo_6_2026-03-02_12-37-46.jpg",
    fallbackImage: "/photos/photo_6_2026-03-02_12-37-46.jpg",
    details: [
      {
        title: "Форсуночное увлажнение",
        desc: "Микрораспыление воды: эффективно и гигиенично при правильной подготовке.",
        icon: "/icons/spray-humid.svg",
        subImage: "/photos/photo_6_2026-03-02_12-37-46.jpg",
      },
      {
        title: "Адиабатическое",
        desc: "Естественное испарение через канальные блоки вентиляции.",
        icon: "/icons/adiabatic.svg",
        subImage: "/photos/vent-units.jpg",
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
    image: "/photos/bassein-1.jpg",
    fallbackImage: "/photos/bassein-1.jpg",
    details: [
      {
        title: "Настенные осушители",
        desc: "Компактные решения для небольших бассейнов и купелей.",
        icon: "/icons/wall-dehumidifier.svg",
        subImage: "/photos/bassein-1.jpg",
      },
      {
        title: "Канальные системы",
        desc: "Скрытый монтаж + подмес свежего воздуха: полный климат-контроль.",
        icon: "/icons/duct.svg",
        subImage: "/photos/bassein-1.jpg",
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
    image: "/photos/engineering-room-wide.jpg",
    fallbackImage: "/photos/engineering-room-wide.jpg",
    details: [
      {
        title: "VRF/VRV",
        desc: "Многозональное управление климатом здания с одной точкой подключения.",
        icon: "/icons/vrf.svg",
        subImage: "/photos/engineering-room-wide.jpg",
      },
      {
        title: "Кассетные блоки",
        desc: "Равномерная подача 360° — идеальна для Open Space.",
        icon: "/icons/cassette.svg",
        subImage: "/photos/ac-apartment-wide.jpg",
      },
      {
        title: "Прецизионные",
        desc: "Точное поддержание температуры/влажности для серверных и ЦОД.",
        icon: "/icons/precision.svg",
        subImage: "/photos/control-panel.jpg",
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
    image: "/photos/horeca-ducts.jpg",
    fallbackImage: "/photos/horeca-ducts.jpg",
    details: [
      {
        title: "Вытяжные зонты",
        desc: "Эффективное удаление жира и жара, лабиринтные фильтры.",
        icon: "/icons/kitchen-hood.svg",
        subImage: "/photos/kitchen-hoods.jpg",
      },
      {
        title: "Общеобменная",
        desc: "Подготовка и подача свежего воздуха в залы для гостей.",
        icon: "/icons/air-exchange.svg",
        subImage: "/photos/duct-industrial.jpg",
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
    image: "/photos/industrial-gallery.jpg",
    fallbackImage: "/photos/industrial-gallery.jpg",
    details: [
      {
        title: "Модульные чиллеры",
        desc: "Высокая мощность для систем вода–воздух и охлаждения станков.",
        icon: "/icons/chiller.svg",
        subImage: "/photos/engineering-room.jpg",
      },
      {
        title: "Градирни",
        desc: "Охлаждение технической воды для производственных циклов.",
        icon: "/icons/cooling-tower.svg",
        subImage: "/photos/industrial-gallery.jpg",
      },
      {
        title: "ККБ",
        desc: "Компрессорно-конденсаторные блоки для интеграции в приточные установки.",
        icon: "/icons/kkb.svg",
        subImage: "/photos/vent-units.jpg",
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
    image: "/photos/photo_5_2026-03-02_12-38-04.jpg",
    fallbackImage: "/photos/photo_5_2026-03-02_12-38-04.jpg",
    details: [
      {
        title: "Аспирация",
        desc: "Удаление пыли, стружки, сварочных аэрозолей и выбросов.",
        icon: "/icons/aspiration.svg",
        subImage: "/photos/duct-industrial.jpg",
      },
      {
        title: "Дымоудаление",
        desc: "Противопожарная безопасность: удаление дыма и подпор воздуха.",
        icon: "/icons/smoke-exhaust.svg",
        subImage: "/photos/photo_5_2026-03-02_12-38-04.jpg",
      },
    ],
  },
];
