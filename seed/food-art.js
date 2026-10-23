// Paints a top-down food illustration on a canvas and returns it as a JPEG blob.
// Everything is procedural and seeded by the dish name, so a dish always gets the same image.

const TAU = Math.PI * 2;

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const hashString = (text) => [...text].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 2166136261);

// Lightens (amount > 0) or darkens (amount < 0) a #rrggbb colour; returns #rrggbb so calls can chain
const shade = (hex, amount) => {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.max(0, Math.min(255, Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)));
  return `#${[n >> 16, (n >> 8) & 255, n & 255].map((c) => mix(c).toString(16).padStart(2, "0")).join("")}`;
};

const SURFACES = [
  { light: "#34302b", dark: "#0f0d0b", grain: false },
  { light: "#4a3220", dark: "#140c07", grain: true },
  { light: "#2c3236", dark: "#0c0f11", grain: false },
  { light: "#3d2b1e", dark: "#110b07", grain: true },
];

export function paintDish(canvas, dish) {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext("2d");
  const rand = mulberry32(hashString(dish.name));
  const r = (min, max) => min + rand() * (max - min);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const art = dish.art;
  const [main, deep, accent, garnish] = art.colors;

  // ---------- surface ----------
  const surface = pick(SURFACES);
  const bg = ctx.createRadialGradient(W * 0.45, H * 0.4, H * 0.1, W * 0.5, H * 0.5, W * 0.8);
  bg.addColorStop(0, surface.light);
  bg.addColorStop(1, surface.dark);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  if (surface.grain) {
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "#000";
    for (let y = -40; y < H + 40; y += r(14, 30)) {
      ctx.lineWidth = r(1, 4);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 60) ctx.lineTo(x, y + Math.sin(x / r(80, 200) + y) * r(2, 8));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = rand() > 0.5 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.08)";
    ctx.fillRect(r(0, W), r(0, H), r(1, 3), r(1, 3));
  }

  // ---------- helpers ----------
  const circle = (x, y, radius, fill) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fillStyle = fill;
    ctx.fill();
  };

  const blob = (x, y, radius, fill, wobble = 0.25) => {
    ctx.beginPath();
    const points = 9;
    const offsets = Array.from({ length: points }, () => 1 + r(-wobble, wobble));
    for (let i = 0; i <= points; i++) {
      const a = (i / points) * TAU;
      const rr = radius * offsets[i % points];
      const px = x + Math.cos(a) * rr;
      const py = y + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py);
      else {
        const pa = ((i - 0.5) / points) * TAU;
        const pr = radius * (offsets[i - 1] + offsets[i % points]) / 2;
        ctx.quadraticCurveTo(x + Math.cos(pa) * pr * 1.05, y + Math.sin(pa) * pr * 1.05, px, py);
      }
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  const leaf = (x, y, length, angle, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(length * 0.5, -length * 0.42, length, 0);
    ctx.quadraticCurveTo(length * 0.5, length * 0.42, 0, 0);
    const g = ctx.createLinearGradient(0, -length * 0.3, 0, length * 0.3);
    g.addColorStop(0, shade(color, 0.25));
    g.addColorStop(1, shade(color, -0.25));
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = shade(color, 0.4);
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = Math.max(1, length * 0.04);
    ctx.beginPath();
    ctx.moveTo(length * 0.05, 0);
    ctx.lineTo(length * 0.9, 0);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  };

  const gloss = (x, y, radius, alpha = 0.35) => {
    const g = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, 0, x, y, radius);
    g.addColorStop(0, `rgba(255,255,255,${alpha})`);
    g.addColorStop(0.5, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  };

  const shadow = (x, y, radius) => {
    ctx.save();
    ctx.filter = "blur(26px)";
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.ellipse(x + radius * 0.08, y + radius * 0.12, radius * 1.02, radius * 0.98, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  };

  // ---------- props around the dish ----------
  const spiceColors = [accent, deep, "#c9952a", "#8a2a12", "#e0b04a"];
  for (let i = 0; i < 70; i++) {
    const a = r(0, TAU);
    const d = r(H * 0.43, W * 0.62);
    const x = W / 2 + Math.cos(a) * d * 1.2;
    const y = H / 2 + Math.sin(a) * d * 0.85;
    circle(x, y, r(1.5, 4.5), pick(spiceColors));
  }
  // herb sprigs at two corners
  [[W * 0.1, H * 0.86], [W * 0.88, H * 0.14]].forEach(([x, y], k) => {
    for (let i = 0; i < 6; i++) leaf(x + r(-30, 30), y + r(-20, 20), r(34, 58), r(0, TAU), k ? garnish : shade(garnish, -0.1));
  });
  // linen napkin corner
  ctx.save();
  ctx.translate(W * 0.02, H * 0.02);
  ctx.rotate(-0.12);
  ctx.fillStyle = "rgba(236,226,208,0.9)";
  ctx.fillRect(-80, -80, W * 0.2, H * 0.22);
  ctx.strokeStyle = "rgba(180,60,40,0.55)";
  ctx.lineWidth = 6;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(-80, 30 + k * 18);
    ctx.lineTo(W * 0.2 - 80, 30 + k * 18);
    ctx.stroke();
  }
  ctx.restore();
  // small side bowl
  if (art.side || rand() > 0.45) {
    const sx = W * 0.86, sy = H * 0.8, sr = H * 0.1;
    shadow(sx, sy, sr);
    circle(sx, sy, sr, "#ece5d8");
    circle(sx, sy, sr * 0.82, art.side || shade(pick([accent, main]), -0.15));
    gloss(sx, sy, sr * 0.82, 0.3);
  }

  // ---------- vessel ----------
  const cx = W * 0.5;
  const cy = H * 0.52;
  const R = H * 0.38;
  let foodR = R * 0.8;
  shadow(cx, cy, R);
  const vesselColor = art.bowl || "#ece5d8";

  if (art.vessel === "board") {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(r(-0.12, 0.12));
    const g = ctx.createLinearGradient(-R, -R, R, R);
    g.addColorStop(0, "#b07a45");
    g.addColorStop(1, "#7a4a24");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-R * 1.25, -R * 0.95, R * 2.5, R * 1.9, 40);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 3;
    for (let y = -R * 0.9; y < R * 0.9; y += 18) {
      ctx.beginPath();
      ctx.moveTo(-R * 1.2, y);
      ctx.bezierCurveTo(-R * 0.4, y + r(-6, 6), R * 0.4, y + r(-6, 6), R * 1.2, y);
      ctx.stroke();
    }
    ctx.restore();
    foodR = R * 0.86;
  } else if (art.vessel === "pan") {
    ctx.save();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 34;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + R * 0.9, cy - R * 0.2);
    ctx.lineTo(cx + R * 1.55, cy - R * 0.55);
    ctx.stroke();
    ctx.restore();
    circle(cx, cy, R, "#1c1c1e");
    circle(cx, cy, R * 0.92, "#2a2a2c");
    foodR = R * 0.88;
  } else if (art.vessel === "steamer") {
    circle(cx, cy, R, "#c9a46a");
    circle(cx, cy, R * 0.9, "#a8814a");
    ctx.strokeStyle = "rgba(90,60,20,0.35)";
    ctx.lineWidth = 3;
    for (let k = -R; k < R; k += 16) {
      ctx.beginPath();
      ctx.moveTo(cx + k, cy - R);
      ctx.lineTo(cx + k + R * 0.4, cy + R);
      ctx.stroke();
    }
    circle(cx, cy, R * 0.86, "#d8c49a");
    foodR = R * 0.84;
  } else if (art.vessel === "glass") {
    circle(cx, cy, R * 0.8, "rgba(255,255,255,0.18)");
    circle(cx, cy, R * 0.74, "rgba(255,255,255,0.08)");
    foodR = R * 0.7;
  } else if (art.vessel === "plate") {
    circle(cx, cy, R * 1.05, shade(vesselColor, -0.1));
    circle(cx, cy, R, vesselColor);
    circle(cx, cy, R * 0.78, shade(vesselColor, -0.05));
    foodR = R * 0.74;
  } else {
    // bowl
    const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.2, cx, cy, R);
    g.addColorStop(0, shade(vesselColor, 0.15));
    g.addColorStop(1, shade(vesselColor, -0.3));
    circle(cx, cy, R, g);
    circle(cx, cy, R * 0.86, shade(vesselColor, -0.45));
    foodR = R * 0.82;
  }

  // ---------- food ----------
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, foodR, 0, TAU);
  ctx.clip();

  const base = (inner, outer) => {
    const g = ctx.createRadialGradient(cx - foodR * 0.25, cy - foodR * 0.25, foodR * 0.1, cx, cy, foodR);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(cx - foodR, cy - foodR, foodR * 2, foodR * 2);
  };
  const inFood = (pad = 0.9) => {
    const a = r(0, TAU);
    const d = Math.sqrt(rand()) * foodR * pad;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
  };
  const herbs = (count, size = 28) => {
    for (let i = 0; i < count; i++) {
      const [x, y] = inFood(0.8);
      leaf(x, y, r(size * 0.7, size * 1.3), r(0, TAU), garnish);
    }
  };
  const cream = () => {
    ctx.strokeStyle = "rgba(255,248,235,0.85)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let t = 0; t < 14; t += 0.1) {
      const rr = t * foodR * 0.035;
      const x = cx + Math.cos(t) * rr + foodR * 0.08;
      const y = cy + Math.sin(t) * rr - foodR * 0.05;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const kind = art.kind;
  if (kind === "curry") {
    base(shade(main, 0.15), deep);
    const chunk = art.chunks || shade(main, -0.25);
    for (let i = 0; i < 14; i++) {
      const [x, y] = inFood(0.75);
      const size = r(foodR * 0.08, foodR * 0.15);
      blob(x, y, size, shade(chunk, r(-0.2, 0.05)), 0.3);
      gloss(x, y, size, 0.25);
    }
    for (let i = 0; i < 40; i++) {
      const [x, y] = inFood(0.95);
      circle(x, y, r(3, 9), `rgba(255,${Math.round(r(150, 200))},60,${r(0.25, 0.5)})`);
    }
    if (art.cream) cream();
    herbs(7, foodR * 0.12);
  } else if (kind === "rice") {
    base(main, shade(deep, art.creamy ? 0 : -0.1));
    const grainColors = [main, shade(main, 0.35), shade(main, -0.1), deep, "#fffaf0"];
    const grains = art.creamy ? 500 : 2200;
    for (let i = 0; i < grains; i++) {
      const [x, y] = inFood(1);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r(0, TAU));
      ctx.fillStyle = pick(grainColors);
      ctx.beginPath();
      ctx.ellipse(0, 0, art.creamy ? 9 : 7, art.creamy ? 4 : 2.6, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    if (art.creamy) {
      for (let i = 0; i < 12; i++) {
        const [x, y] = inFood(0.7);
        blob(x, y, r(18, 34), shade(accent, r(-0.2, 0.15)), 0.45);
      }
    }
    (art.toppings || [accent]).forEach((color) => {
      for (let i = 0; i < 6; i++) {
        const [x, y] = inFood(0.7);
        const size = r(foodR * 0.05, foodR * 0.1);
        blob(x, y, size, color, 0.35);
        gloss(x, y, size, 0.2);
      }
    });
    if (art.onions) {
      ctx.strokeStyle = "#7a3a14";
      ctx.lineWidth = 5;
      for (let i = 0; i < 40; i++) {
        const [x, y] = inFood(0.8);
        ctx.beginPath();
        ctx.arc(x, y, r(6, 14), r(0, TAU), r(0, TAU) + 2);
        ctx.stroke();
      }
    }
    herbs(8, foodR * 0.1);
  } else if (kind === "noodles" || kind === "ramen") {
    if (kind === "ramen") {
      base(shade(main, 0.2), deep);
      for (let i = 0; i < 30; i++) {
        const [x, y] = inFood(0.95);
        circle(x, y, r(4, 12), "rgba(255,230,160,0.35)");
      }
    } else {
      base(shade(main, -0.05), deep);
    }
    ctx.lineCap = "round";
    const strands = kind === "ramen" ? 26 : 70;
    for (let i = 0; i < strands; i++) {
      const [x, y] = inFood(kind === "ramen" ? 0.5 : 0.75);
      ctx.strokeStyle = shade(kind === "ramen" ? "#f2d48a" : main, r(-0.2, 0.15));
      ctx.lineWidth = r(7, 11);
      ctx.beginPath();
      ctx.arc(x, y, r(foodR * 0.15, foodR * 0.45), r(0, TAU), r(0, TAU) + r(1.5, 3.5));
      ctx.stroke();
    }
    if (kind === "ramen") {
      // eggs, chashu, nori, spring onion
      [[0.35, -0.25], [0.48, 0.1]].forEach(([dx, dy]) => {
        const x = cx + foodR * dx, y = cy + foodR * dy;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(r(-0.6, 0.6));
        ctx.fillStyle = "#fbf6ea";
        ctx.beginPath();
        ctx.ellipse(0, 0, foodR * 0.16, foodR * 0.12, 0, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#f29a2a";
        ctx.beginPath();
        ctx.ellipse(0, 0, foodR * 0.085, foodR * 0.07, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
      });
      for (let i = 0; i < 3; i++) {
        const x = cx - foodR * 0.35 + i * foodR * 0.12, y = cy + foodR * (0.25 + i * 0.08);
        circle(x, y, foodR * 0.18, "#d9a07a");
        circle(x, y, foodR * 0.12, "#f1c8a8");
      }
      ctx.save();
      ctx.translate(cx - foodR * 0.05, cy - foodR * 0.55);
      ctx.rotate(-0.25);
      ctx.fillStyle = "#1e2a1e";
      ctx.fillRect(-foodR * 0.18, -foodR * 0.3, foodR * 0.36, foodR * 0.5);
      ctx.restore();
      for (let i = 0; i < 26; i++) {
        const [x, y] = inFood(0.85);
        ctx.strokeStyle = garnish;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, r(5, 8), 0, TAU);
        ctx.stroke();
      }
    } else {
      for (let i = 0; i < 10; i++) {
        const [x, y] = inFood(0.6);
        blob(x, y, r(12, 22), accent, 0.4);
      }
      if (art.pepper) {
        for (let i = 0; i < 260; i++) {
          const [x, y] = inFood(0.85);
          circle(x, y, r(1, 2.6), "#1a1612");
        }
      }
      for (let i = 0; i < 120; i++) {
        const [x, y] = inFood(0.8);
        circle(x, y, r(1.5, 3.5), "#fffbea");
      }
    }
  } else if (kind === "soup") {
    base(shade(main, 0.2), deep);
    for (let i = 0; i < 40; i++) {
      const [x, y] = inFood(0.9);
      ctx.strokeStyle = shade(main, -0.35);
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(x, y, r(10, 26), r(0, TAU), r(0, TAU) + 2);
      ctx.stroke();
    }
    if (art.cheese) {
      blob(cx, cy, foodR * 0.55, "#f2c96a", 0.2);
      for (let i = 0; i < 40; i++) {
        const [x, y] = inFood(0.45);
        circle(x, y, r(6, 16), `rgba(${Math.round(r(150, 200))},${Math.round(r(90, 120))},30,0.6)`);
      }
      gloss(cx, cy, foodR * 0.55, 0.3);
    }
    herbs(6, foodR * 0.09);
  } else if (kind === "pizza") {
    const crust = ctx.createRadialGradient(cx, cy, foodR * 0.75, cx, cy, foodR);
    crust.addColorStop(0, main);
    crust.addColorStop(1, shade(main, -0.35));
    circle(cx, cy, foodR, crust);
    for (let i = 0; i < 26; i++) {
      const a = r(0, TAU);
      circle(cx + Math.cos(a) * foodR * 0.9, cy + Math.sin(a) * foodR * 0.9, r(6, 14), "rgba(40,20,10,0.6)");
    }
    blob(cx, cy, foodR * 0.8, deep, 0.06);
    for (let i = 0; i < 9; i++) {
      const [x, y] = inFood(0.6);
      const size = r(foodR * 0.1, foodR * 0.17);
      blob(x, y, size, accent, 0.35);
      gloss(x, y, size, 0.4);
    }
    herbs(8, foodR * 0.16);
    ctx.strokeStyle = "rgba(60,30,15,0.35)";
    ctx.lineWidth = 3;
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI + 0.3;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(a) * foodR, cy - Math.sin(a) * foodR);
      ctx.lineTo(cx + Math.cos(a) * foodR, cy + Math.sin(a) * foodR);
      ctx.stroke();
    }
  } else if (kind === "cake") {
    const cr = foodR * 0.82;
    const g = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, cr * 0.1, cx, cy, cr);
    g.addColorStop(0, shade(main, 0.15));
    g.addColorStop(1, deep);
    circle(cx, cy, cr, g);
    if (art.molten) {
      blob(cx + cr * 0.15, cy + cr * 0.2, cr * 0.42, shade(deep, -0.3), 0.35);
      gloss(cx + cr * 0.15, cy + cr * 0.2, cr * 0.42, 0.35);
    }
    if (art.dust) {
      for (let i = 0; i < 1400; i++) {
        const a = r(0, TAU), d = Math.sqrt(rand()) * cr;
        circle(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r(1, 2.4), art.dust);
      }
    }
    for (let i = 0; i < 220; i++) {
      const a = r(0, TAU), d = Math.sqrt(rand()) * cr;
      circle(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r(0.8, 2), "rgba(255,255,255,0.7)");
    }
    if (art.berries) {
      for (let i = 0; i < 7; i++) {
        const a = r(0, TAU), d = r(cr * 0.85, cr * 1.05);
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
        circle(x, y, r(14, 20), garnish);
        gloss(x, y, 18, 0.5);
      }
    }
    leaf(cx - cr * 0.2, cy - cr * 0.35, 46, -0.6, "#4f9a4a");
    leaf(cx - cr * 0.2, cy - cr * 0.35, 40, 0.4, "#4f9a4a");
  } else if (kind === "dumplings") {
    // Plump pleated crescents with golden pan-fried bottoms, around a bowl of dipping sauce
    const w = foodR * 0.3, h = foodR * 0.17;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + 0.3;
      const x = cx + Math.cos(a) * foodR * 0.58, y = cy + Math.sin(a) * foodR * 0.58;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + Math.PI / 2 + r(-0.15, 0.15));
      ctx.filter = "blur(4px)";
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(4, 8, w, h * 0.9, 0, 0, TAU);
      ctx.fill();
      ctx.filter = "none";
      ctx.beginPath();
      ctx.moveTo(-w, h * 0.35);
      ctx.bezierCurveTo(-w * 0.9, -h * 1.25, w * 0.9, -h * 1.25, w, h * 0.35);
      ctx.quadraticCurveTo(0, h * 0.95, -w, h * 0.35);
      const g = ctx.createLinearGradient(0, -h, 0, h);
      g.addColorStop(0, shade(main, 0.25));
      g.addColorStop(0.55, main);
      g.addColorStop(0.8, accent);
      g.addColorStop(1, shade(accent, -0.35));
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = shade(main, -0.3);
      ctx.lineWidth = 2.5;
      for (let k = -4; k <= 4; k++) {
        const px = k * w * 0.2;
        ctx.beginPath();
        ctx.moveTo(px, -h * 0.85 + Math.abs(k) * h * 0.08);
        ctx.quadraticCurveTo(px + w * 0.06, -h * 0.4, px + w * 0.02, -h * 0.05);
        ctx.stroke();
      }
      gloss(-w * 0.2, -h * 0.3, w * 0.7, 0.3);
      ctx.restore();
    }
    circle(cx, cy, foodR * 0.24, "#ece5d8");
    circle(cx, cy, foodR * 0.2, "#3a1f12");
    for (let i = 0; i < 25; i++) {
      const a = r(0, TAU), d = r(0, foodR * 0.17);
      circle(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r(1.5, 3.5), rand() > 0.5 ? "#d4471f" : "#f3ead8");
    }
    gloss(cx, cy, foodR * 0.2, 0.35);
    for (let i = 0; i < 14; i++) {
      const [x, y] = inFood(0.95);
      ctx.strokeStyle = garnish;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, r(5, 8), 0, TAU);
      ctx.stroke();
    }
  } else if (kind === "pancakes") {
    const count = art.flat ? 1 : 3;
    for (let k = count - 1; k >= 0; k--) {
      const pr = foodR * (art.flat ? 0.85 : 0.78) - k * 6;
      const g = ctx.createRadialGradient(cx - pr * 0.2, cy - pr * 0.2, pr * 0.1, cx, cy + k * 6, pr);
      g.addColorStop(0, shade(main, 0.25));
      g.addColorStop(0.8, main);
      g.addColorStop(1, deep);
      circle(cx, cy + k * 6, pr, g);
    }
    if (art.flat) {
      ctx.strokeStyle = shade(main, -0.25);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - foodR * 0.8, cy + foodR * 0.2);
      ctx.quadraticCurveTo(cx, cy - foodR * 0.1, cx + foodR * 0.8, cy + foodR * 0.25);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(190,110,30,0.85)";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let t = 0; t < 10; t += 0.2) {
      const x = cx + Math.cos(t * 1.3) * foodR * (0.2 + t * 0.04);
      const y = cy + Math.sin(t * 1.7) * foodR * (0.15 + t * 0.03);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    if (art.berries || art.colors[3]) {
      for (let i = 0; i < 9; i++) {
        const [x, y] = inFood(0.55);
        const size = r(12, 18);
        circle(x, y, size, garnish);
        gloss(x, y, size, 0.45);
      }
    }
    ctx.fillStyle = "#fbefb0";
    ctx.save();
    ctx.translate(cx, cy - foodR * 0.05);
    ctx.rotate(0.3);
    ctx.fillRect(-24, -18, 48, 36);
    ctx.restore();
    for (let i = 0; i < 300; i++) {
      const [x, y] = inFood(0.7);
      circle(x, y, r(0.8, 2), "rgba(255,255,255,0.8)");
    }
  } else if (kind === "dip") {
    base(shade(main, 0.15), deep);
    ctx.lineWidth = art.chunky ? 0 : 6;
    if (!art.chunky) {
      for (let k = 1; k < 8; k++) {
        ctx.strokeStyle = `rgba(0,0,0,${0.06 + k * 0.01})`;
        ctx.beginPath();
        ctx.arc(cx + r(-8, 8), cy + r(-8, 8), foodR * (k / 8.5), r(0, 1), r(4, 6.2));
        ctx.stroke();
      }
      blob(cx, cy, foodR * 0.25, "rgba(200,150,40,0.7)", 0.3);
      gloss(cx, cy, foodR * 0.25, 0.45);
      for (let i = 0; i < 160; i++) {
        const [x, y] = inFood(0.5);
        circle(x, y, r(1, 3), accent === "#c9952a" ? art.colors[3] : accent);
      }
      for (let i = 0; i < 9; i++) {
        const a = r(0, TAU), d = foodR * r(0.25, 0.4);
        circle(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r(10, 14), "#e2c48a");
      }
    } else {
      for (let i = 0; i < 40; i++) {
        const [x, y] = inFood(0.95);
        blob(x, y, r(14, 30), shade(main, r(-0.25, 0.2)), 0.4);
      }
      for (let i = 0; i < 30; i++) {
        const [x, y] = inFood(0.8);
        ctx.fillStyle = pick([accent, garnish, "#3f8a3a"]);
        ctx.fillRect(x, y, r(6, 12), r(6, 12));
      }
    }
    herbs(4, 22);
  } else if (kind === "flatbread") {
    const fillings = art.fillings || [deep, garnish, accent];
    for (let k = 0; k < 3; k++) {
      ctx.save();
      ctx.translate(cx + (k - 1) * foodR * 0.55, cy + (k % 2 ? 0.08 : -0.08) * foodR);
      ctx.rotate(r(-0.35, 0.35) + (art.tacos ? 0 : 0.8));
      const w = foodR * (art.tacos ? 0.42 : 0.3), h = foodR * (art.tacos ? 0.5 : 0.9);
      ctx.beginPath();
      if (art.tacos) ctx.ellipse(0, 0, w, h, 0, 0, TAU);
      else ctx.roundRect(-w, -h, w * 2, h * 2, w);
      ctx.fillStyle = main;
      ctx.fill();
      ctx.save();
      ctx.clip();
      for (let i = 0; i < 18; i++) circle(r(-w, w), r(-h, h), r(4, 10), "rgba(90,40,10,0.35)");
      fillings.forEach((color, fi) => {
        for (let i = 0; i < 14; i++) blob(r(-w * 0.6, w * 0.6), r(-h * 0.7, h * 0.7) + fi * 2, r(8, 16), color, 0.4);
      });
      ctx.strokeStyle = "rgba(255,250,240,0.85)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let y = -h; y < h; y += 20) ctx.lineTo(Math.sin(y / 9) * w * 0.5, y);
      ctx.stroke();
      ctx.restore();
      ctx.restore();
    }
  } else if (kind === "salad") {
    if (art.corn) {
      base(main, deep);
      for (let i = 0; i < 900; i++) {
        const [x, y] = inFood(1);
        circle(x, y, r(5, 8), shade(main, r(-0.2, 0.25)));
      }
      for (let i = 0; i < 200; i++) {
        const [x, y] = inFood(0.9);
        circle(x, y, r(2, 5), "#fbf8ee");
      }
      for (let i = 0; i < 160; i++) {
        const [x, y] = inFood(0.9);
        circle(x, y, r(1, 2.6), accent);
      }
      herbs(14, 22);
    } else {
      base(shade(main, -0.2), deep);
      for (let i = 0; i < 70; i++) {
        const [x, y] = inFood(1);
        leaf(x, y, r(40, 80), r(0, TAU), shade(main, r(-0.25, 0.25)));
      }
      (art.extras || [accent]).forEach((color) => {
        for (let i = 0; i < 9; i++) {
          const [x, y] = inFood(0.8);
          if (color === "#c9a46a") {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(r(0, TAU));
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, -16);
            ctx.lineTo(18, 14);
            ctx.lineTo(-18, 14);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else {
            circle(x, y, r(9, 16), color);
            gloss(x, y, 14, 0.35);
          }
        }
      });
    }
  } else if (kind === "shakshuka") {
    base(shade(main, 0.1), deep);
    for (let i = 0; i < 60; i++) {
      const [x, y] = inFood(0.95);
      blob(x, y, r(8, 20), shade(main, r(-0.3, 0.1)), 0.5);
    }
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + 0.4;
      const x = cx + Math.cos(a) * foodR * 0.45, y = cy + Math.sin(a) * foodR * 0.45;
      blob(x, y, foodR * 0.2, accent, 0.25);
      circle(x + 4, y - 2, foodR * 0.08, "#f2a21f");
      gloss(x + 4, y - 2, foodR * 0.08, 0.6);
    }
    for (let i = 0; i < 14; i++) {
      const [x, y] = inFood(0.8);
      ctx.fillStyle = "#f8f4ea";
      ctx.fillRect(x, y, r(8, 14), r(8, 14));
    }
    herbs(10, 20);
  } else if (kind === "drink") {
    base(shade(main, 0.15), deep);
    const foam = ctx.createRadialGradient(cx, cy, foodR * 0.6, cx, cy, foodR);
    foam.addColorStop(0, "rgba(0,0,0,0)");
    foam.addColorStop(1, art.foam || "#f6ead0");
    ctx.fillStyle = foam;
    ctx.fillRect(cx - foodR, cy - foodR, foodR * 2, foodR * 2);
    for (let i = 0; i < 60; i++) {
      const [x, y] = inFood(0.9);
      circle(x, y, r(2, 6), "rgba(255,255,255,0.25)");
    }
    for (let i = 0; i < 40; i++) {
      const [x, y] = inFood(0.5);
      ctx.strokeStyle = accent === "#fbe3a8" ? "#c0361f" : garnish;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + r(-8, 8), y + r(-8, 8));
      ctx.stroke();
    }
    leaf(cx + foodR * 0.2, cy - foodR * 0.25, 54, -0.8, "#4f9a4a");
    leaf(cx + foodR * 0.2, cy - foodR * 0.25, 46, 0.2, "#4f9a4a");
  } else if (kind === "spiral") {
    // Pepper-tomato sauce under the vegetable rounds
    base(shade(main, -0.1), shade(main, -0.55));
    const sliceColors = [main, art.colors[1], art.colors[2], art.colors[3]];
    let n = 0;
    for (let t = 0.3; t < 7.2; t += 0.18) {
      const rr = foodR * (0.1 + t * 0.115);
      const x = cx + Math.cos(t * 2.2) * rr * 0.98;
      const y = cy + Math.sin(t * 2.2) * rr * 0.98;
      const color = sliceColors[n++ % sliceColors.length];
      circle(x, y, foodR * 0.11, shade(color, -0.2));
      circle(x, y, foodR * 0.095, color);
      gloss(x, y, foodR * 0.1, 0.25);
    }
    herbs(6, 18);
  } else if (kind === "roll") {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.5);
    const w = foodR * 1.05, h = foodR * 0.26;
    const g = ctx.createLinearGradient(0, -h, 0, h);
    g.addColorStop(0, shade(main, 0.2));
    g.addColorStop(0.5, main);
    g.addColorStop(1, deep);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-w, -h, w * 2, h * 2, h);
    ctx.fill();
    for (let i = 0; i < 90; i++) circle(r(-w * 0.95, w * 0.95), r(-h * 0.8, h * 0.8), r(2, 6), "rgba(120,60,10,0.4)");
    ctx.restore();
    [[-0.45, 0.55, "#f3ead8"], [0.15, 0.62, accent], [0.62, 0.3, "#d98a2a"]].forEach(([dx, dy, color]) => {
      const x = cx + foodR * dx, y = cy + foodR * dy;
      circle(x, y, foodR * 0.2, "#ece5d8");
      circle(x, y, foodR * 0.16, color);
      gloss(x, y, foodR * 0.16, 0.35);
    });
    herbs(4, 18);
  } else if (kind === "balls") {
    base("#e8a23a", "#9a5a10");
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU, d = i === 5 ? 0 : foodR * 0.45;
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      const g = ctx.createRadialGradient(x - 14, y - 14, 4, x, y, foodR * 0.24);
      g.addColorStop(0, shade(main, 0.25));
      g.addColorStop(1, deep);
      circle(x, y, foodR * 0.24, g);
      gloss(x, y, foodR * 0.24, 0.55);
    }
    for (let i = 0; i < 30; i++) {
      const [x, y] = inFood(0.8);
      ctx.fillStyle = garnish;
      ctx.fillRect(x, y, r(8, 14), r(3, 5));
    }
  } else if (kind === "sticks") {
    for (let k = 0; k < 6; k++) {
      ctx.save();
      ctx.translate(cx - foodR * 0.2 + k * 10, cy - foodR * 0.4 + k * foodR * 0.14);
      ctx.rotate(-0.35 + r(-0.1, 0.1));
      const w = foodR * 0.75, h = foodR * 0.07;
      ctx.fillStyle = main;
      ctx.beginPath();
      ctx.roundRect(-w, -h, w * 2, h * 2, h);
      ctx.fill();
      ctx.strokeStyle = deep;
      ctx.lineWidth = 3;
      for (let s = -1; s <= 1; s++) {
        ctx.beginPath();
        ctx.moveTo(-w, s * h * 0.5);
        ctx.lineTo(w, s * h * 0.5);
        ctx.stroke();
      }
      for (let i = 0; i < 50; i++) circle(r(-w, w), r(-h, h), r(1, 2.2), accent);
      ctx.restore();
    }
    const x = cx + foodR * 0.55, y = cy + foodR * 0.5;
    circle(x, y, foodR * 0.3, "#ece5d8");
    circle(x, y, foodR * 0.25, garnish);
    gloss(x, y, foodR * 0.25, 0.4);
  }

  // soft rim shading over the food
  const rim = ctx.createRadialGradient(cx, cy, foodR * 0.75, cx, cy, foodR);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = rim;
  ctx.fillRect(cx - foodR, cy - foodR, foodR * 2, foodR * 2);
  ctx.restore();

  // vessel rim highlight
  if (art.vessel !== "board") {
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.97, Math.PI * 1.05, Math.PI * 1.55);
    ctx.stroke();
  }

  // ---------- steam ----------
  if (art.hot) {
    ctx.save();
    ctx.filter = "blur(6px)";
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    for (let k = -1; k <= 1; k++) {
      ctx.beginPath();
      const x0 = cx + k * R * 0.3;
      ctx.moveTo(x0, cy - R * 0.2);
      ctx.bezierCurveTo(x0 - 40, cy - R * 0.55, x0 + 40, cy - R * 0.8, x0, cy - R * 1.15);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---------- warm light + vignette ----------
  const light = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W * 0.7);
  light.addColorStop(0, "rgba(255,200,120,0.12)");
  light.addColorStop(1, "rgba(255,200,120,0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, W, H);
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
}

export const renderDishJpeg = (dish, width = 1200, height = 900) =>
  new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    paintDish(canvas, dish);
    canvas.toBlob(resolve, "image/jpeg", 0.88);
  });
