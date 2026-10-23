import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { toast } from "react-toastify";
import { FiPlus, FiSearch, FiX, FiRefreshCw } from "react-icons/fi";
import { API_BASE, currentUserId } from "../api";
import { useRecipeData, emptyStats } from "../hooks/useRecipeData";
import RecipeCard from "../component/RecipeCard";
import ReviewsDrawer from "../component/ReviewsDrawer";
import ConfirmDialog from "../ui/ConfirmDialog";
import { EmptyState, PageHeader, RecipeCardSkeleton, stagger } from "../ui/Primitives";
import { EmptyBowl } from "../ui/Illustrations";
import { cookingMinutes } from "../utils/format";
import "../component/RecipeCard.css";
import "./Recipes.css";

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "top", label: "Top rated" },
  { id: "quick", label: "Quickest" },
  { id: "light", label: "Lightest" },
];

const Recipes = () => {
  const loggedInUserId = currentUserId();
  const { recipes, usersById, statsByRecipe, loading, error, reload, setRecipes, setRatings } = useRecipeData();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [mineOnly, setMineOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null); // { kind, item }
  const [busy, setBusy] = useState(false);

  // Filtering derives a new list, so clearing the search brings everything back
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const stat = (r) => statsByRecipe[r.recipeId] || emptyStats;
    const list = recipes.filter((r) => {
      if (mineOnly && r.userId !== loggedInUserId) return false;
      if (!term) return true;
      return (
        (r.name || "").toLowerCase().includes(term) ||
        (r.recipeDescription || "").toLowerCase().includes(term)
      );
    });
    const sorters = {
      newest: (a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")),
      top: (a, b) => stat(b).avg - stat(a).avg || stat(b).count - stat(a).count,
      quick: (a, b) => cookingMinutes(a.cookingTime) - cookingMinutes(b.cookingTime),
      light: (a, b) => Number(a.kiloCalories || 0) - Number(b.kiloCalories || 0),
    };
    return [...list].sort(sorters[sort]);
  }, [recipes, statsByRecipe, search, sort, mineOnly, loggedInUserId]);

  const closeDrawer = useCallback(() => setSelectedRecipe(null), []);

  const deleteRecipe = async (recipe) => {
    try {
      await axios.delete(`${API_BASE}/recipes/${recipe.recipeId}`);
      toast.success("Recipe Deleted successfully!");
      setRecipes((list) => list.filter((r) => r.recipeId !== recipe.recipeId));
    } catch (err) {
      console.log(err);
      toast.error("Could not delete the recipe.");
    }
  };

  const deleteRating = async (rating) => {
    try {
      await axios.delete(`${API_BASE}/ratings/${rating.ratingId}`);
      toast.success("Rating Deleted successfully!");
      setRatings((list) => list.filter((r) => r.ratingId !== rating.ratingId));
    } catch (err) {
      console.log(err);
      toast.error("Could not delete the rating.");
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    if (pendingDelete.kind === "recipe") await deleteRecipe(pendingDelete.item);
    else await deleteRating(pendingDelete.item);
    setBusy(false);
    setPendingDelete(null);
  };

  const drawerRatings = selectedRecipe ? (statsByRecipe[selectedRecipe.recipeId] || emptyStats).ratings : [];

  return (
    <div className="sn-page">
      <div className="sn-container">
        <PageHeader
          eyebrow="The cookbook"
          title="Discover"
          highlight="recipes"
          subtitle="Every dish the community has shared. Search, sort and find tonight's dinner."
          actions={
            <Link to="/add-recipe" className="sn-btn sn-btn--primary sn-shine">
              <FiPlus /> Post new recipe
            </Link>
          }
        />

        <motion.div
          className="sn-toolbar sn-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="sn-input-wrap sn-toolbar__search">
            <FiSearch />
            <input
              className="sn-input"
              type="search"
              placeholder="Search recipes or descriptions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search recipes"
            />
            {search && (
              <button type="button" className="sn-toolbar__clear" onClick={() => setSearch("")} aria-label="Clear search">
                <FiX />
              </button>
            )}
          </div>
          <LayoutGroup id="sort">
            <div className="sn-toolbar__chips" role="group" aria-label="Sort recipes">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`sn-chip sn-toolbar__chip ${sort === s.id ? "is-active" : ""}`}
                  onClick={() => setSort(s.id)}
                  aria-pressed={sort === s.id}
                >
                  {sort === s.id && <motion.span layoutId="sn-sort-pill" className="sn-toolbar__chip-bg" />}
                  <span>{s.label}</span>
                </button>
              ))}
              <span className="sn-toolbar__divider" />
              <button
                type="button"
                className={`sn-chip ${mineOnly ? "sn-chip--active" : ""}`}
                onClick={() => setMineOnly((v) => !v)}
                aria-pressed={mineOnly}
              >
                My recipes
              </button>
            </div>
          </LayoutGroup>
        </motion.div>

        {!loading && !error && (
          <p className="sn-results" aria-live="polite">
            Showing <strong>{visible.length}</strong> of {recipes.length} recipes
          </p>
        )}

        {loading ? (
          <div className="sn-rgrid">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            art={<EmptyBowl />}
            title="Couldn't load recipes"
            text="The kitchen seems to be closed. Check that the backend services are running and try again."
            action={
              <button type="button" className="sn-btn sn-btn--ghost" onClick={reload}>
                <FiRefreshCw /> Try again
              </button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            art={<EmptyBowl />}
            title={recipes.length ? "Nothing matches that search" : "No recipes yet"}
            text={
              recipes.length
                ? "Try a different word, or clear the filters to see everything."
                : "Be the first to put something on the table."
            }
            action={
              recipes.length ? (
                <button
                  type="button"
                  className="sn-btn sn-btn--ghost"
                  onClick={() => {
                    setSearch("");
                    setMineOnly(false);
                  }}
                >
                  Clear filters
                </button>
              ) : (
                <Link to="/add-recipe" className="sn-btn sn-btn--primary">
                  <FiPlus /> Share a recipe
                </Link>
              )
            }
          />
        ) : (
          <motion.div className="sn-rgrid" variants={stagger} initial="hidden" animate="show">
            <AnimatePresence>
              {visible.map((recipe) => (
                <RecipeCard
                  key={recipe.recipeId}
                  recipe={recipe}
                  stats={statsByRecipe[recipe.recipeId]}
                  authorName={usersById[recipe.userId] && usersById[recipe.userId].name}
                  isOwner={recipe.userId === loggedInUserId}
                  onShowReviews={() => setSelectedRecipe(recipe)}
                  onDelete={() => setPendingDelete({ kind: "recipe", item: recipe })}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ReviewsDrawer
        recipe={selectedRecipe}
        ratings={drawerRatings}
        usersById={usersById}
        currentUserId={loggedInUserId}
        onClose={closeDrawer}
        onDeleteRating={(rating) => setPendingDelete({ kind: "rating", item: rating })}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        tone="danger"
        title={pendingDelete && pendingDelete.kind === "recipe" ? "Delete this recipe?" : "Delete your rating?"}
        message={
          pendingDelete && pendingDelete.kind === "recipe"
            ? `"${pendingDelete.item.name}" will be removed for everyone.`
            : "Your score and comment will be removed."
        }
        confirmLabel="Delete"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default Recipes;
