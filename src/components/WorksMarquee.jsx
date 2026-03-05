import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const NASHI_IMAGES = [
  "/nashi/photo_2007@27-07-2023_16-03-39.jpg",
  "/nashi/photo_2007@27-07-2023_16-03-39 — копия — копия.jpg",
  "/nashi/photo_2015@27-07-2023_16-03-39 — копия — копия.jpg",
  "/nashi/photo_2048@04-08-2023_20-02-19 — копия — копия.jpg",
  "/nashi/photo_2051@04-08-2023_20-02-19 — копия — копия.jpg",
  "/nashi/photo_2088@10-08-2023_13-38-18 — копия — копия.jpg",
  "/nashi/photo_2091@10-08-2023_13-38-18 — копия — копия.jpg",
  "/nashi/photo_2093@11-08-2023_20-14-23 — копия — копия.jpg",
  "/nashi/photo_2142@25-08-2023_16-48-43 — копия — копия.jpg",
  "/nashi/photo_2374@15-11-2023_15-44-56 — копия — копия.jpg",
  "/nashi/photo_2379@15-11-2023_15-44-56 — копия — копия.jpg",
  "/nashi/photo_2380@15-11-2023_15-44-56 — копия — копия.jpg",
  "/nashi/photo_2387@17-11-2023_17-16-26 — копия — копия.jpg",
  "/nashi/photo_2412@24-11-2023_16-04-36 — копия — копия.jpg",
  "/nashi/photo_2419@28-11-2023_21-36-03 — копия — копия.jpg",
  "/nashi/photo_2422@29-11-2023_18-10-15 — копия — копия.jpg",
  "/nashi/photo_2448@14-12-2023_17-22-56 — копия — копия.jpg",
  "/nashi/photo_2458@15-12-2023_16-57-33 — копия — копия.jpg",
  "/nashi/photo_2463@21-12-2023_13-59-06 — копия — копия.jpg",
  "/nashi/photo_2483@28-12-2023_18-30-12 — копия — копия.jpg",
  "/nashi/photo_2485@28-12-2023_18-30-12 — копия — копия.jpg",
  "/nashi/photo_2489@08-01-2024_20-17-13 — копия — копия.jpg",
  "/nashi/photo_2490@08-01-2024_20-17-13 — копия — копия.jpg",
  "/nashi/photo_2493@09-01-2024_18-54-16 — копия — копия.jpg",
  "/nashi/photo_2496@09-01-2024_18-54-16 — копия — копия.jpg",
  "/nashi/photo_2497@09-01-2024_18-54-16 — копия — копия.jpg",
  "/nashi/photo_2514@14-01-2024_17-51-24 — копия — копия.jpg",
  "/nashi/photo_2522@14-01-2024_19-00-11 — копия — копия.jpg",
  "/nashi/photo_2540@19-01-2024_12-10-45 — копия — копия.jpg",
  "/nashi/photo_2545@19-01-2024_12-10-45 — копия — копия.jpg",
];

const WorksMarquee = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const trackRef = useRef(null);
  const [scrollPx, setScrollPx] = useState(0);
  const scrollPxRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scroll: 0 });
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  const allImages = [...NASHI_IMAGES, ...NASHI_IMAGES];
  const halfWidthRef = useRef(0);

  // Auto-scroll вправо: 280 сек на полный цикл
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    halfWidthRef.current = track.scrollWidth / 2;
  }, [allImages.length]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const animate = (t) => {
      if (isDragging || hoveredIndex !== null) return;
      const dt = t - lastTimeRef.current;
      lastTimeRef.current = t;
      const half = halfWidthRef.current;
      if (half <= 0) return;
      const speed = half / (280 * 1000);
      setScrollPx((prev) => {
        const next = prev + speed * dt;
        const val = next >= 0 ? next - half : next;
        scrollPxRef.current = val;
        return val;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [isDragging, hoveredIndex]);

  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: getClientX(e), scroll: scrollPxRef.current };
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    dragStart.current = { x: getClientX(e), scroll: scrollPxRef.current };
  };

  useEffect(() => {
    if (!isDragging) return;
    const half = halfWidthRef.current;
    const onMove = (e) => {
      const dx = getClientX(e) - dragStart.current.x;
      const next = Math.max(-half, Math.min(0, dragStart.current.scroll + dx));
      scrollPxRef.current = next;
      setScrollPx(next);
    };
    const onTouchMove = (e) => {
      onMove(e);
      e.cancelable && e.preventDefault();
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    window.addEventListener("touchcancel", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchcancel", onUp);
    };
  }, [isDragging]);

  return (
    <section id="works" className="py-14 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-6 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900">
          Наши работы
        </h2>
        <p className="mt-2 md:mt-3 text-slate-600 max-w-2xl">
          Живые фото с объектов: кондиционирование, вентиляция, инженерные узлы.
        </p>
      </div>

      <div
        className="relative flex overflow-x-hidden select-none touch-pan-x"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseLeave={() => setHoveredIndex(null)}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 items-center shrink-0 will-change-transform"
          style={{ transform: `translate3d(${scrollPx}px, 0, 0)` }}
        >
          {allImages.map((src, i) => {
            const isThisHovered = hoveredIndex === i;
            const shouldDim = hoveredIndex !== null && hoveredIndex !== i;

            return (
              <div
                key={`${src}-${i}`}
                className="relative shrink-0 w-[308px] md:w-[396px] h-[198px] md:h-[242px] rounded-2xl overflow-hidden cursor-pointer"
                style={{ zIndex: isThisHovered ? 10 : 1 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  className="w-full h-full rounded-2xl overflow-hidden"
                  initial={false}
                  animate={{
                    scale: isThisHovered ? 1.1 : 1,
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  <img
                    src={src}
                    alt={`Работа ${(i % NASHI_IMAGES.length) + 1}`}
                    className="w-full h-full object-cover rounded-2xl"
                    loading="lazy"
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  animate={{
                    backgroundColor: shouldDim ? "rgba(15, 23, 42, 0.35)" : "rgba(15, 23, 42, 0)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorksMarquee;
