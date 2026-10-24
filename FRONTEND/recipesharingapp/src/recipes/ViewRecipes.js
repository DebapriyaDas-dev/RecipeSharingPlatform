import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiClock, FiZap, FiCalendar, FiStar, FiEdit2, FiCheck, FiRefreshCw } from "react-icons/fi";
import { API_BASE, currentUserId } from "../api";
import { Avatar, CountUp, EmptyState, RecipeImage, Skeleton, ease, rise, stagger } from "../ui/Primitives";
import { StarDisplay } from "../ui/StarRating";
import { EmptyBowl, NoReviews } from "../ui/Illustrations";
import { averageRating, formatDate, humanCookingTime, parseCookingTime } from "../utils/format";
import "../component/ReviewsDrawer.css";
import "./ViewRecipes.css";

const ViewRecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [author, setAuthor] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [reviewers, setReviewers] = useState({});
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [checked, setChecked] = useState({});
  const userId = currentUserId();

  useEffect(() => {
    let cancelled = false;
    const fetchRecipe = async () => {
      setStatus("loading");
      try {
        const response = await axios.get(`${API_BASE}/recipes/${id}`);
        if (cancelled) return;
        setRecipe({ ...response.data, ingredients: response.data.ingredients || [] });
        setStatus("ready");

        const [authorRes, ratingsRes, usersRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/users/${response.data.userId}`),
          axios.get(`${API_BASE}/ratings/recipe/${id}`),
          axios.get(`${API_BASE}/users`),
        ]);
        if (cancelled) return;
        if (authorRes.status === "fulfilled") setAuthor(authorRes.value.data);
        if (ratingsRes.status === "fulfilled") setRatings(ratingsRes.value.data || []);
        if (usersRes.status === "fulfilled") {
          const map = {};
          (usersRes.value.data || []).forEach((u) => {
            map[u.id] = u;
          });
          setReviewers(map);
        }
      } catch (error) {
        console.log(error);
        if (!cancelled) setStatus("error");
      }
    };
    fetchRecipe();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="sn-page">
        <div className="sn-container sn-recipe__hero">
          <Skeleton className="sn-recipe__media-skel" radius={28} />
          <div style={{ display: "grid", gap: 16, alignContent: "center" }}>
            <Skeleton height={14} width="30%" />
            <Skeleton height={52} width="80%" />
            <Skeleton height={18} />
            <Skeleton height={18} width="70%" />
            <Skeleton height={90} />
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="sn-page">
        <div className="sn-container">
          <EmptyState
            art={<EmptyBowl />}
            title="Recipe not found"
            text="It may have been removed, or the recipe service isn't reachable right now."
            action={
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" className="sn-btn sn-btn--ghost" onClick={() => window.location.reload()}>
                  <FiRefreshCw /> Retry
                </button>
                <Link to="/recipes" className="sn-btn sn-btn--primary">
                  Back to recipes
                </Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  const time = parseCookingTime(recipe.cookingTime);
  const totalMinutes = time.hours * 60 + time.minutes;
  const avg = averageRating(ratings);
  const isOwner = recipe.userId === userId;
  const doneCount = recipe.ingredients.filter((_, i) => checked[i]).length;

  const stats = [
    {
      icon: FiClock,
      label: "Cook time",
      value: totalMinutes ? <CountUp value={totalMinutes} suffix=" min" /> : humanCookingTime(recipe.cookingTime),
      hint: totalMinutes >= 60 ? humanCookingTime(recipe.cookingTime) : null,
    },
    {
      icon: FiZap,
      label: "Calories",
      value: recipe.kiloCalories ? <CountUp value={Number(recipe.kiloCalories)} suffix=" kcal" /> : "—",
    },
    { icon: FiCalendar, label: "Added on", value: formatDate(recipe.createdAt) },
    {
      icon: FiStar,
      label: "Rating",
      value: ratings.length ? <CountUp value={avg} decimals={1} suffix="/10" /> : "New",
      hint: `${ratings.length} ${ratings.length === 1 ? "review" : "reviews"}`,
    },
  ];

  return (
    <div className="sn-page">
      <div className="sn-container">
        <motion.button
          type="button"
          className="sn-back"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FiArrowLeft /> Back
        </motion.button>

        <section className="sn-recipe__hero">
          <motion.div
            className="sn-recipe__media"
            initial={{ opacity: 0, scale: 0.96, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <RecipeImage fileName={recipe.fileName} alt={recipe.name} />
            {ratings.length > 0 && (
              <motion.div
                className="sn-recipe__badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              >
                <strong>{avg.toFixed(1)}</strong>
                <span>community score</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div className="sn-recipe__info" variants={stagger} initial="hidden" animate="show">
            <motion.p variants={rise} className="sn-eyebrow">
              Recipe
            </motion.p>
            <motion.h1 variants={rise} className="sn-recipe__title">
              {recipe.name}
            </motion.h1>
            <motion.p variants={rise} className="sn-recipe__desc">
              {recipe.recipeDescription}
            </motion.p>

            <motion.div variants={rise} className="sn-recipe__author">
              <Avatar name={author ? author.name : "?"} size={44} ring />
              <div className="sn-recipe__author-text">
                <span>Created by</span>
                {author ? (
                  <Link to={isOwner ? "/profile" : `/viewuser/${author.id}`}>{isOwner ? "You" : author.name}</Link>
                ) : (
                  <strong>Unknown cook</strong>
                )}
              </div>
              <div className="sn-recipe__author-stars">
                <StarDisplay value={avg} size={16} showValue={false} />
              </div>
            </motion.div>

            <motion.div variants={rise} className="sn-recipe__stats">
              {stats.map(({ icon: Icon, label, value, hint }) => (
                <div key={label} className="sn-recipe__stat">
                  <Icon />
                  <span className="sn-recipe__stat-label">{label}</span>
                  <strong>{value}</strong>
                  {hint && <small>{hint}</small>}
                </div>
              ))}
            </motion.div>

            <motion.div variants={rise} className="sn-recipe__actions">
              <Link to={`/recipe-ratings/${recipe.recipeId}`} className="sn-btn sn-btn--primary sn-shine">
                <FiStar /> Rate this recipe
              </Link>
              {isOwner && (
                <Link to={`/edit-recipe/${recipe.recipeId}`} className="sn-btn sn-btn--ghost">
                  <FiEdit2 /> Edit recipe
                </Link>
              )}
            </motion.div>
          </motion.div>
        </section>

        <section className="sn-recipe__details">
          <motion.div
            className="sn-card sn-card--pad sn-ingredients"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="sn-ingredients__head">
              <div>
                <p className="sn-eyebrow">Mise en place</p>
                <h2>Ingredients</h2>
              </div>
              {recipe.ingredients.length > 0 && (
                <span className="sn-ingredients__progress">
                  {doneCount}/{recipe.ingredients.length} ready
                </span>
              )}
            </div>
            {recipe.ingredients.length > 0 && (
              <div className="sn-ingredients__bar">
                <motion.span
                  animate={{ width: `${(doneCount / recipe.ingredients.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                />
              </div>
            )}
            {recipe.ingredients.length === 0 ? (
              <p className="sn-muted">No ingredients were listed for this recipe.</p>
            ) : (
              <ul className="sn-ingredients__list">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={ingredient.id || i}>
                    <button
                      type="button"
                      className={`sn-ingredient ${checked[i] ? "is-done" : ""}`}
                      onClick={() => setChecked((current) => ({ ...current, [i]: !current[i] }))}
                      aria-pressed={Boolean(checked[i])}
                    >
                      <span className="sn-ingredient__box">
                        <AnimatePresence>
                          {checked[i] && (
                            <motion.span
                              initial={{ scale: 0, rotate: -60 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 24 }}
                            >
                              <FiCheck />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="sn-ingredient__name">{ingredient.name}</span>
                      <span className="sn-ingredient__qty">{ingredient.quantity}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          <motion.div
            className="sn-card sn-card--pad sn-recipe-reviews"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            <div className="sn-ingredients__head">
              <div>
                <p className="sn-eyebrow">From the table</p>
                <h2>Reviews</h2>
              </div>
              <StarDisplay value={avg} size={15} count={ratings.length} showValue={ratings.length > 0} />
            </div>
            {ratings.length === 0 ? (
              <div className="sn-recipe-reviews__empty">
                <NoReviews size={130} />
                <p>No one has rated this yet. Be the first!</p>
                <Link to={`/recipe-ratings/${recipe.recipeId}`} className="sn-btn sn-btn--ghost sn-btn--sm">
                  <FiStar /> Write a review
                </Link>
              </div>
            ) : (
              <motion.ul className="sn-reviews" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {ratings.map((rating) => {
                  const reviewer = reviewers[rating.userId];
                  const mine = rating.userId === userId;
                  return (
                    <motion.li key={rating.ratingId} variants={rise} className={`sn-review ${mine ? "sn-review--mine" : ""}`}>
                      <Avatar name={reviewer ? reviewer.name : "?"} size={38} />
                      <div className="sn-review__content">
                        <div className="sn-review__top">
                          <strong>{mine ? "You" : reviewer ? reviewer.name : "Former member"}</strong>
                          <StarDisplay value={Number(rating.rating)} size={13} />
                        </div>
                        {rating.comment ? (
                          <p>{rating.comment}</p>
                        ) : (
                          <p className="sn-review__nocomment">No comment left.</p>
                        )}
                        {mine && (
                          <div className="sn-review__actions">
                            <Link to={`/edit-rating/${rating.ratingId}`} className="sn-btn sn-btn--ghost sn-btn--sm">
                              <FiEdit2 /> Edit
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default ViewRecipePage;
