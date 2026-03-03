# Аудит: задержка при прокрутке на мобильной версии

## Выявленные проблемы

### 1. Scroll-слушатели без троттлинга (критично)
- **Navbar** (строка ~854): `handleScroll` вызывает `setIsScrolled` на каждом scroll event
- **BackToTop** (строка ~2413): `onScroll` вызывает `setShow` на каждом scroll event

На мобильных scroll events срабатывают до 60+ раз/сек при инерционной прокрутке → частые re-render Navbar и BackToTop.

### 2. backdrop-filter (backdrop-blur) — тяжёлая операция на мобильных
Используется в:
- Navbar: `backdrop-blur-md` (всегда видим при скролле)
- Мобильное меню: `backdrop-blur-xl`
- Hero badge, кнопки: `backdrop-blur-sm`, `backdrop-blur-md`
- Карточки каталога: `backdrop-blur-md` на иконках
- Карточки «Наши работы»: `backdrop-blur`
- Контакт-форма: `backdrop-blur-sm`

`backdrop-filter` вызывает композитинг всего слоя под элементом — на слабых GPU мобильных даёт заметную лаг.

### 3. Много Framer Motion whileInView
- **Reveal**: 12+ обёрток секций, каждая с IntersectionObserver
- **CloudPromo**: 7 motion.div с whileInView
- **WorksSection**: 6 карточек с whileInView
- **Catalog**: 4 карточки + layoutId для layout-анимаций

При скролле IntersectionObserver срабатывает часто → пересчёт анимаций, layout.

### 4. BrandMarquee — бесконечная анимация
Framer Motion `animate={{ x: "-50%" }}` с `repeat: Infinity` — постоянная анимация transform. На мобильных может конкурировать за GPU с scroll.

### 5. Изображения
- Hero: крупное фото без `loading="lazy"`
- Каталог: 4+ карточки с внешними Unsplash (до 1600px) + локальные
- Локальные фото: duct-industrial 353KB, industrial-gallery 334KB — крупные

### 6. scroll-behavior: smooth
`html { scroll-behavior: smooth }` — на части устройств добавляет задержку при нативной прокрутке.

### 7. Catalog: тяжёлые эффекты
- `layoutId` на каждой карточке (для AnimatePresence)
- `grayscale` + `scale(1.1)` на hover
- `transition-all duration-1000`

---

## Рекомендуемые исправления

| Приоритет | Действие | Ожидаемый эффект |
|-----------|----------|------------------|
| P0 | Троттлинг scroll-обработчиков | Сильное снижение re-render при скролле |
| P0 | Отключить backdrop-blur на мобильных (media query) | Ускорение композитинга |
| P1 | Заменить BrandMarquee на CSS-анимацию | Снижение нагрузки от Framer Motion |
| P1 | Добавить loading="lazy" на Hero и карточки каталога | Меньше блокирующих запросов |
| P2 | Упростить Reveal на мобильных / prefers-reduced-motion | Меньше анимаций при скролле |
| P2 | Убрать layoutId с карточек каталога | Снижение layout-расчётов |
