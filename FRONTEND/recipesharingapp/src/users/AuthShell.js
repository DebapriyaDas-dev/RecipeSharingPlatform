import React, { useEffect, useState } from "react";
import { GiCookingPot } from "react-icons/gi";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import "./Login.css";

// Two-panel animated layout shared by the sign-in and sign-up pages
const AuthShell = ({ image, rotatingWords, headline, copy, chips, children }) => {
  const reduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);

  // Hero parallax follows the pointer
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 20 });
  const imageX = useTransform(smoothX, (v) => v * -18);
  const imageY = useTransform(smoothY, (v) => v * -18);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setInterval(
      () => setWordIndex((i) => (i + 1) % rotatingWords.length),
      2600
    );
    return () => clearInterval(timer);
  }, [reduceMotion, rotatingWords.length]);

  const handlePointerMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div className="lx-page" onMouseMove={handlePointerMove}>
      <div className="lx-aurora" aria-hidden="true">
        <span className="lx-blob lx-blob--saffron" />
        <span className="lx-blob lx-blob--ember" />
        <span className="lx-blob lx-blob--plum" />
      </div>
      <div className="lx-embers" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            style={{ "--i": i, "--size": `${3 + ((i * 7) % 4)}px`, "--dur": `${9 + ((i * 13) % 7)}s` }}
          />
        ))}
      </div>
      <div className="lx-grain" aria-hidden="true" />

      <motion.div
        className="lx-shell"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <section className="lx-hero" aria-hidden="true">
          <motion.img
            src={image}
            alt=""
            className="lx-hero__img"
            style={{ x: imageX, y: imageY }}
          />
          <div className="lx-hero__veil" />
          <div className="lx-hero__content">
            <span className="lx-badge">
              <GiCookingPot /> The Recipe Club
            </span>
            <h2 className="lx-hero__title">
              <span className="lx-rotator">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="lx-shimmer"
                  >
                    {rotatingWords[wordIndex]}.
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              {headline}
            </h2>
            <p className="lx-hero__copy">{copy}</p>
            <div className="lx-chips">
              {chips.map((chip) => (
                <span key={chip} className="lx-chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="lx-panel">{children}</section>
      </motion.div>
    </div>
  );
};

export default AuthShell;
