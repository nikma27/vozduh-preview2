/**
 * Анимированная иконка ветра для логотипа.
 * При наведении белые линии с крючками плавно расправляются.
 */
import { useState } from "react";
import { motion } from "framer-motion";

const paths = [
  "M12.8 19.6A2 2 0 1 0 14 16H2",
  "M17.5 8a2.5 2.5 0 1 1 2 4H2",
  "M9.8 4.4A2 2 0 1 1 11 8H2",
];

export default function AnimatedWindLogo({ className = "w-8 h-8", size = 24, isHovered: isHoveredProp }) {
  const [isHoveredLocal, setIsHoveredLocal] = useState(false);
  const isHovered = isHoveredProp !== undefined ? isHoveredProp : isHoveredLocal;
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      onMouseEnter={() => setIsHoveredLocal(true)}
      onMouseLeave={() => setIsHoveredLocal(false)}
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          initial={false}
          animate={{
            pathLength: isHovered ? 1 : 0.58,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </motion.svg>
  );
}
