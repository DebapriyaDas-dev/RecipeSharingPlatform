import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";
import { averageRating } from "../utils/format";

// Loads recipes, ratings and users together and derives per-recipe stats
export const useRecipeData = () => {
  const [recipes, setRecipes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const [recipeRes, ratingRes, userRes] = await Promise.allSettled([
      axios.get(`${API_BASE}/recipes/all-recipes`),
      axios.get(`${API_BASE}/ratings/all-ratings`),
      axios.get(`${API_BASE}/users`),
    ]);
    if (recipeRes.status === "fulfilled") {
      setRecipes(recipeRes.value.data || []);
    } else {
      console.error(recipeRes.reason);
      setError(true);
    }
    if (ratingRes.status === "fulfilled") setRatings(ratingRes.value.data || []);
    else console.log(ratingRes.reason);
    if (userRes.status === "fulfilled") setUsers(userRes.value.data || []);
    else console.log(userRes.reason);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const usersById = useMemo(() => {
    const map = {};
    users.forEach((user) => {
      map[user.id] = user;
    });
    return map;
  }, [users]);

  const statsByRecipe = useMemo(() => {
    const grouped = {};
    ratings.forEach((rating) => {
      (grouped[rating.recipeId] = grouped[rating.recipeId] || []).push(rating);
    });
    const stats = {};
    Object.keys(grouped).forEach((id) => {
      stats[id] = { avg: averageRating(grouped[id]), count: grouped[id].length, ratings: grouped[id] };
    });
    return stats;
  }, [ratings]);

  return {
    recipes,
    ratings,
    users,
    usersById,
    statsByRecipe,
    loading,
    error,
    reload: load,
    setRecipes,
    setRatings,
  };
};

export const emptyStats = { avg: 0, count: 0, ratings: [] };
