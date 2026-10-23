import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiZap, FiEdit2, FiTrash2, FiMessageCircle, FiArrowUpRight } from "react-icons/fi";
import { Avatar, RecipeImage, rise } from "../ui/Primitives";
import { StarDisplay } from "../ui/StarRating";
import { humanCookingTime } from "../utils/format";
import "./RecipeCard.css";

// Moves the card's soft spotlight to follow the cursor
const trackSpotlight = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

const RecipeCard = ({
  recipe,
  stats = { avg: 0, count: 0 },
  authorName,
  isOwner = false,
  onShowReviews,
  onDelete,
  imageSrc,
  preview = false,
}) => {
  const viewUrl = recipe.recipeId ? `/view-recipe/${recipe.recipeId}` : null;

  return (
    <motion.article
      className={`sn-rcard ${preview ? "sn-rcard--preview" : ""}`}
      variants={preview ? undefined : rise}
      layout={!preview}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
      whileHover={preview ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      onMouseMove={trackSpotlight}
    >
      <div className="sn-rcard__media">
        <RecipeImage fileName={recipe.fileName} src={imageSrc} alt={recipe.name || "Recipe"} />
        <div className="sn-rcard__media-veil" />
        <div className="sn-rcard__badges">
          <span className="sn-pill">
            <FiClock /> {humanCookingTime(recipe.cookingTime)}
          </span>
          {stats.count > 0 ? (
            <span className="sn-pill sn-pill--gold">★ {stats.avg.toFixed(1)}</span>
          ) : (
            <span className="sn-pill sn-pill--new">New</span>
          )}
        </div>
        {viewUrl && !preview && (
          <Link to={viewUrl} className="sn-rcard__open" aria-label={`Open ${recipe.name}`}>
            <FiArrowUpRight />
          </Link>
        )}
      </div>

      <div className="sn-rcard__body">
        <h3 className="sn-rcard__title">
          {viewUrl && !preview ? <Link to={viewUrl}>{recipe.name}</Link> : recipe.name || "Untitled recipe"}
        </h3>
        <p className="sn-rcard__desc">{recipe.recipeDescription || "A short description will appear here."}</p>

        <div className="sn-rcard__meta">
          <span className="sn-rcard__author">
            <Avatar name={authorName || "Chef"} size={26} />
            {isOwner ? "You" : authorName || "Unknown cook"}
          </span>
          {recipe.kiloCalories !== undefined && recipe.kiloCalories !== "" && recipe.kiloCalories !== null && (
            <span className="sn-rcard__kcal">
              <FiZap /> {recipe.kiloCalories} kcal
            </span>
          )}
        </div>

        <div className="sn-rcard__rating">
          <StarDisplay value={stats.avg} size={15} count={stats.count} />
        </div>

        {!preview && (
          <div className="sn-rcard__footer">
            {onShowReviews ? (
              <button type="button" className="sn-btn sn-btn--ghost sn-btn--sm" onClick={onShowReviews}>
                <FiMessageCircle /> Reviews{stats.count ? ` (${stats.count})` : ""}
              </button>
            ) : (
              <Link to={viewUrl} className="sn-btn sn-btn--ghost sn-btn--sm">
                View recipe <FiArrowUpRight />
              </Link>
            )}
            {isOwner && (
              <div className="sn-rcard__owner">
                <Link
                  to={`/edit-recipe/${recipe.recipeId}`}
                  className="sn-icon-btn"
                  title="Edit recipe"
                  aria-label="Edit recipe"
                >
                  <FiEdit2 />
                </Link>
                {onDelete && (
                  <button
                    type="button"
                    className="sn-icon-btn sn-icon-btn--danger"
                    onClick={onDelete}
                    title="Delete recipe"
                    aria-label="Delete recipe"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default RecipeCard;
