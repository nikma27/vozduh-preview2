import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Обёртка для плавного появления секций при скролле.
 * Использует IntersectionObserver (через useInView) — когда секция попадает в viewport,
 * срабатывает анимация opacity и translateY.
 */
const Reveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.08, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`section-reveal transition-all duration-500 ${isInView ? "is-visible" : ""}`}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
