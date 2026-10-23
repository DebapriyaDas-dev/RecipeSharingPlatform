// Every backend call goes through the API gateway
export const API_BASE = "http://localhost:8080";

export const recipeImageUrl = (fileName) =>
  fileName ? `${API_BASE}/recipes/image/${encodeURIComponent(fileName)}` : null;

export const currentUserId = () => localStorage.getItem("userId");

export const currentUserName = () => localStorage.getItem("userName") || "";

// Backend error responses carry a readable `message`
export const errorMessage = (error, fallback) =>
  (error && error.response && error.response.data && error.response.data.message) || fallback;
