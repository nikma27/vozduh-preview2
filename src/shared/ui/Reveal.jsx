import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Reveal = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.08, margin: "-40px" });
  const shouldUseLightReveal =
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches);
  if (shouldUseLightReveal) {
    return (
      <div ref={ref} className="section-reveal is-visible">
        {children}
      </div>
    );
  }

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
