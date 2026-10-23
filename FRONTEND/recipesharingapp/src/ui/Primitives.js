import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { recipeImageUrl } from "../api";
import { initials } from "../utils/format";
import { PlatePlaceholder } from "./Illustrations";
import "./ui.css";

export const ease = [0.22, 1, 0.36, 1];

// Route-level transition; App wraps every route element in this
export const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.45, ease }}
  >
    {children}
  </motion.div>
);

// Drifting background glows shared by every page
export const Ambient = () => (
  <div className="sn-ambient" aria-hidden="true">
    <span className="sn-ambient__blob sn-ambient__blob--a" />
    <span className="sn-ambient__blob sn-ambient__blob--b" />
    <span className="sn-ambient__blob sn-ambient__blob--c" />
    <div className="sn-ambient__grain" />
  </div>
);

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

// Fades its children in once they scroll into view
export const Reveal = ({ children, delay = 0, className = "", as = "div" }) => {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease, delay }}
    >
      {children}
    </Component>
  );
};

export const PageHeader = ({ eyebrow, title, highlight, subtitle, actions, children }) => (
  <motion.header className="sn-page-header" variants={stagger} initial="hidden" animate="show">
    <div className="sn-page-header__text">
      {eyebrow && (
        <motion.p variants={rise} className="sn-eyebrow">
          {eyebrow}
        </motion.p>
      )}
      <motion.h1 variants={rise} className="sn-page-header__title">
        {title} {highlight && <em className="sn-gradient-text">{highlight}</em>}
      </motion.h1>
      {subtitle && (
        <motion.p variants={rise} className="sn-page-header__subtitle">
          {subtitle}
        </motion.p>
      )}
      {children}
    </div>
    {actions && (
      <motion.div variants={rise} className="sn-page-header__actions">
        {actions}
      </motion.div>
    )}
  </motion.header>
);

const AVATAR_GRADIENTS = [
  ["#ffcf6b", "#e2572b"],
  ["#faab00", "#7c3a5c"],
  ["#f6a96b", "#c2410c"],
  ["#e9c46a", "#2a9d8f"],
  ["#ff9f80", "#9d174d"],
  ["#fcd34d", "#b45309"],
];

const hash = (text) => [...String(text || "")].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export const Avatar = ({ name, size = 40, ring = false, className = "" }) => {
  const [from, to] = AVATAR_GRADIENTS[hash(name) % AVATAR_GRADIENTS.length];
  return (
    <span
      className={`sn-avatar ${ring ? "sn-avatar--ring" : ""} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
};

// Uploaded photo when there is one, otherwise the plate illustration
export const RecipeImage = ({ fileName, src, alt, className = "" }) => {
  const url = src || recipeImageUrl(fileName);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [url]);

  if (!url || failed) {
    return <PlatePlaceholder className={`sn-recipe-img ${className}`} title={alt} />;
  }
  return (
    <img
      src={url}
      alt={alt}
      className={`sn-recipe-img ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export const EmptyState = ({ art, title, text, action }) => (
  <motion.div
    className="sn-empty"
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease }}
  >
    {art}
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {action}
  </motion.div>
);

// Animates from 0 to `value` the first time it is on screen
export const CountUp = ({ value, decimals = 0, duration = 1.4, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }
    const controls = animate(0, value, { duration, ease, onUpdate: setDisplay });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const Skeleton = ({ height = 16, width = "100%", radius, className = "" }) => (
  <div className={`sn-skeleton ${className}`} style={{ height, width, borderRadius: radius }} />
);

export const RecipeCardSkeleton = () => (
  <div className="sn-card sn-card-skeleton">
    <Skeleton height={0} className="sn-card-skeleton__img" radius={0} />
    <div className="sn-card-skeleton__body">
      <Skeleton height={22} width="70%" />
      <Skeleton height={14} />
      <Skeleton height={14} width="85%" />
      <Skeleton height={38} width="45%" />
    </div>
  </div>
);
