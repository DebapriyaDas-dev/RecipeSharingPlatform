import React from "react";
import "./Illustrations.css";

// Hand-built SVG artwork for the Saffron Noir theme. Gradient ids are shared
// per illustration; repeated copies define identical gradients, so that's safe.

const SaffronGradient = ({ id }) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#ffcf6b" />
    <stop offset="0.5" stopColor="#faab00" />
    <stop offset="1" stopColor="#e2572b" />
  </linearGradient>
);

export const LogoMark = ({ size = 36, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
    <defs>
      <SaffronGradient id="sn-logo-grad" />
    </defs>
    <rect width="48" height="48" rx="14" fill="url(#sn-logo-grad)" />
    <g fill="none" stroke="#1a1206" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path className="sn-steam sn-steam--1" d="M19 9c-2 2.4 2 3.6 0 6" />
      <path className="sn-steam sn-steam--2" d="M24.5 8c-2 2.4 2 3.6 0 6" />
      <path className="sn-steam sn-steam--3" d="M30 9c-2 2.4 2 3.6 0 6" />
      <path d="M11 21h26" />
      <path d="M13.5 21v10a6 6 0 0 0 6 6h9a6 6 0 0 0 6-6V21" />
      <path d="M9 24h4.5M34.5 24H39" />
    </g>
  </svg>
);

// Shown wherever a recipe has no uploaded photo
export const PlatePlaceholder = ({ className = "", title = "" }) => (
  <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={`sn-art ${className}`} role="img" aria-label={title || "Recipe illustration"}>
    <defs>
      <radialGradient id="sn-plate-bg" cx="50%" cy="45%" r="75%">
        <stop offset="0" stopColor="#3a2614" />
        <stop offset="0.6" stopColor="#1c140d" />
        <stop offset="1" stopColor="#0f0b08" />
      </radialGradient>
      <radialGradient id="sn-plate-food" cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#ffd27a" />
        <stop offset="0.55" stopColor="#f39a1e" />
        <stop offset="1" stopColor="#b8431c" />
      </radialGradient>
      <linearGradient id="sn-plate-rim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f3e7d6" />
        <stop offset="1" stopColor="#9f8f7c" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sn-plate-bg)" />
    <g opacity="0.35" fill="#faab00">
      <circle cx="62" cy="58" r="2" />
      <circle cx="338" cy="72" r="2.5" />
      <circle cx="312" cy="238" r="1.8" />
      <circle cx="86" cy="232" r="2.2" />
      <circle cx="356" cy="160" r="1.5" />
    </g>
    <ellipse cx="200" cy="246" rx="120" ry="14" fill="#000" opacity="0.45" />
    <circle cx="200" cy="158" r="92" fill="url(#sn-plate-rim)" />
    <circle cx="200" cy="158" r="74" fill="#efe3d1" />
    <circle cx="200" cy="158" r="56" fill="url(#sn-plate-food)" />
    <g fill="#3f7d3a">
      <path d="M182 132c8-10 20-8 22 2-9 6-17 5-22-2z" />
      <path d="M210 150c9-6 19-1 18 8-10 3-17 0-18-8z" />
    </g>
    <g fill="#fff6e2" opacity="0.85">
      <circle cx="186" cy="170" r="5" />
      <circle cx="214" cy="178" r="4" />
      <circle cx="198" cy="186" r="3.5" />
    </g>
    <g fill="none" stroke="#c9b9a4" strokeWidth="6" strokeLinecap="round">
      <path d="M80 104v108" />
      <path d="M70 104v28a10 10 0 0 0 20 0v-28" strokeWidth="4" />
      <path d="M322 104c-12 18-12 44 0 58v50" />
    </g>
    <g fill="none" stroke="#ffcf6b" strokeWidth="4" strokeLinecap="round" opacity="0.7">
      <path className="sn-steam sn-steam--1" d="M180 60c-8 10 8 16 0 26" />
      <path className="sn-steam sn-steam--2" d="M200 52c-8 10 8 16 0 26" />
      <path className="sn-steam sn-steam--3" d="M220 60c-8 10 8 16 0 26" />
    </g>
  </svg>
);

export const EmptyBowl = ({ size = 180 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160" className="sn-art sn-float" aria-hidden="true">
    <defs>
      <SaffronGradient id="sn-bowl-grad" />
    </defs>
    <ellipse cx="100" cy="146" rx="62" ry="8" fill="#000" opacity="0.4" />
    <path d="M30 78h140c0 38-31 62-70 62S30 116 30 78z" fill="url(#sn-bowl-grad)" />
    <path d="M30 78h140" stroke="#ffe3a8" strokeWidth="4" strokeLinecap="round" />
    <path d="M48 94c8 18 26 30 52 30" stroke="#fff3d6" strokeOpacity="0.5" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M128 30l24 44" stroke="#c9b9a4" strokeWidth="7" strokeLinecap="round" />
    <ellipse cx="124" cy="24" rx="10" ry="14" transform="rotate(-28 124 24)" fill="#c9b9a4" />
    <g fill="#faab00">
      <path className="sn-twinkle" d="M54 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
      <path className="sn-twinkle sn-twinkle--late" d="M168 44l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
    </g>
  </svg>
);

export const NoReviews = ({ size = 150 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160" className="sn-art sn-float" aria-hidden="true">
    <defs>
      <SaffronGradient id="sn-review-grad" />
    </defs>
    <rect x="22" y="28" width="104" height="70" rx="18" fill="#2a2119" stroke="rgba(255,214,153,0.25)" strokeWidth="2" />
    <path d="M46 98l-6 22 26-22" fill="#2a2119" />
    <g fill="#5b4d3f">
      <rect x="40" y="50" width="62" height="8" rx="4" />
      <rect x="40" y="66" width="44" height="8" rx="4" />
    </g>
    <rect x="86" y="62" width="96" height="62" rx="18" fill="url(#sn-review-grad)" />
    <path d="M160 124l8 20-26-20" fill="#e2572b" />
    <path d="M134 76l5 10 11 1.6-8 7.8 1.9 11-9.9-5.2-9.9 5.2 1.9-11-8-7.8 11-1.6z" fill="#1a1206" />
  </svg>
);

export const CommunityArt = ({ size = 160 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 200 140" className="sn-art sn-float" aria-hidden="true">
    <defs>
      <SaffronGradient id="sn-community-grad" />
    </defs>
    <circle cx="62" cy="62" r="30" fill="#3a2d22" stroke="rgba(255,214,153,0.3)" strokeWidth="2" />
    <circle cx="138" cy="62" r="30" fill="#3a2d22" stroke="rgba(255,214,153,0.3)" strokeWidth="2" />
    <circle cx="100" cy="74" r="38" fill="url(#sn-community-grad)" />
    <circle cx="100" cy="64" r="12" fill="#1a1206" />
    <path d="M78 96c4-12 14-18 22-18s18 6 22 18" fill="#1a1206" />
  </svg>
);

const StepFrame = ({ children, id }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <SaffronGradient id={id} />
    </defs>
    <rect width="64" height="64" rx="18" fill="rgba(250,171,0,0.1)" stroke="rgba(250,171,0,0.35)" />
    <g fill="none" stroke={`url(#${id})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </svg>
);

export const StepShare = () => (
  <StepFrame id="sn-step-share">
    <rect x="18" y="14" width="24" height="34" rx="4" />
    <path d="M24 24h12M24 31h12M24 38h7" />
    <path d="M46 26l4 4-12 12h-4v-4z" />
  </StepFrame>
);

export const StepCook = () => (
  <StepFrame id="sn-step-cook">
    <path d="M16 30h32" />
    <path d="M19 30v9a7 7 0 0 0 7 7h12a7 7 0 0 0 7-7v-9" />
    <path className="sn-steam sn-steam--1" d="M26 14c-2 3 2 5 0 8" />
    <path className="sn-steam sn-steam--2" d="M32 12c-2 3 2 5 0 8" />
    <path className="sn-steam sn-steam--3" d="M38 14c-2 3 2 5 0 8" />
  </StepFrame>
);

export const StepRate = () => (
  <StepFrame id="sn-step-rate">
    <path d="M32 14l5.3 10.8 11.9 1.7-8.6 8.4 2 11.8L32 41.1l-10.6 5.6 2-11.8-8.6-8.4 11.9-1.7z" />
  </StepFrame>
);
