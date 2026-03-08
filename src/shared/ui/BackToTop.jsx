import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastCall = 0;
    const THROTTLE_MS = 100;

    const onScroll = () => {
      if (ticking) return;
      const now = Date.now();
      if (now - lastCall < THROTTLE_MS) return;
      ticking = true;
      lastCall = now;
      requestAnimationFrame(() => {
        setShow(window.scrollY > 600);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-blue-600 transition-colors"
          aria-label="Наверх"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
