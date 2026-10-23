// "01:20:00" -> { hours: 1, minutes: 20, seconds: 0 }
export const parseCookingTime = (value) => {
  const [hours = 0, minutes = 0, seconds = 0] = String(value || "")
    .split(":")
    .map((part) => parseInt(part, 10) || 0);
  return { hours, minutes, seconds };
};

export const formatCookingTime = ({ hours, minutes, seconds }) =>
  [hours, minutes, seconds].map((part) => String(part || 0).padStart(2, "0")).join(":");

export const cookingMinutes = (value) => {
  const { hours, minutes, seconds } = parseCookingTime(value);
  return hours * 60 + minutes + seconds / 60;
};

// "01:20:00" -> "1 hr 20 min"
export const humanCookingTime = (value) => {
  const { hours, minutes, seconds } = parseCookingTime(value);
  const parts = [];
  if (hours) parts.push(`${hours} hr`);
  if (minutes) parts.push(`${minutes} min`);
  if (!hours && !minutes && seconds) parts.push(`${seconds} sec`);
  return parts.length ? parts.join(" ") : "—";
};

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

export const todayIso = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const averageRating = (ratings) =>
  ratings.length ? ratings.reduce((sum, r) => sum + Number(r.rating || 0), 0) / ratings.length : 0;

// Ratings are out of 10
export const ratingLabel = (value) => {
  if (!value) return "Tap a star to rate";
  if (value <= 2) return "Not for me";
  if (value <= 4) return "Needs work";
  if (value <= 6) return "Pretty good";
  if (value <= 8) return "Delicious";
  if (value === 9) return "Outstanding";
  return "Masterpiece";
};

export const initials = (name) =>
  String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";

export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
