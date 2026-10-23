import React, { useState } from "react";
import { motion } from "framer-motion";
import { ratingLabel } from "../utils/format";

const STAR_PATH =
  "M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z";

const Star = ({ fill = 1, size }) => (
  <span className="sn-star" style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={STAR_PATH} fill="rgba(255,255,255,0.12)" />
    </svg>
    <span className="sn-star__fill" style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d={STAR_PATH} fill="url(#sn-star-grad)" />
      </svg>
    </span>
  </span>
);

// Defines the star gradient once; rendered by App
export const StarDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <linearGradient id="sn-star-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffd98a" />
        <stop offset="0.6" stopColor="#faab00" />
        <stop offset="1" stopColor="#f08a1c" />
      </linearGradient>
    </defs>
  </svg>
);

// Ratings are stored out of 10 and drawn as five stars
export const StarDisplay = ({ value = 0, size = 16, showValue = true, count }) => {
  const stars = value / 2;
  return (
    <span className="sn-stars" aria-label={`Rated ${value.toFixed(1)} out of 10`}>
      <span className="sn-stars__row">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={size} fill={stars - i} />
        ))}
      </span>
      {showValue && count === 0 && <span className="sn-stars__none">No reviews yet</span>}
      {showValue && count !== 0 && (
        <span className="sn-stars__value">
          {value ? value.toFixed(1) : "—"}
          <small>/10</small>
          {count !== undefined && <small className="sn-stars__count"> · {count} {count === 1 ? "review" : "reviews"}</small>}
        </span>
      )}
    </span>
  );
};

// Ten-star picker with hover preview and keyboard support
export const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(10, (value || 0) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(1, (value || 1) - 1));
    }
  };

  return (
    <div className="sn-picker">
      <div className="sn-picker__score" aria-live="polite">
        {/* Remounts on each value for a pop-in. No exit animation: sweeping across the
            stars changes the value many times a second, and overlapping exits left
            stale numbers on screen. */}
        <motion.span
          key={shown}
          className="sn-picker__number"
          initial={{ y: 10, opacity: 0.4, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 28 }}
        >
          {shown || 0}
        </motion.span>
        <span className="sn-picker__outof">/10</span>
        <span className="sn-picker__label">{ratingLabel(shown)}</span>
      </div>
      <div
        className="sn-picker__stars"
        role="radiogroup"
        aria-label="Rating out of 10"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHover(0)}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <motion.button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} out of 10`}
            tabIndex={-1}
            className={`sn-picker__star ${n <= shown ? "is-on" : ""}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            whileHover={{ scale: 1.22, rotate: -8 }}
            whileTap={{ scale: 0.85 }}
            animate={value === n ? { scale: [1, 1.35, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={STAR_PATH} />
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
