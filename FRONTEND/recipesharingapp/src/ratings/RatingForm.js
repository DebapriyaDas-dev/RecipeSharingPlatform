import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiArrowLeft, FiCheck, FiClock } from "react-icons/fi";
import { API_BASE, currentUserId } from "../api";
import { RecipeImage, Skeleton, ease, rise, stagger } from "../ui/Primitives";
import { StarPicker } from "../ui/StarRating";
import { humanCookingTime } from "../utils/format";
import "./RatingForm.css";

const MAX_COMMENT = 500;
const QUICK_NOTES = ["Would cook again 🔁", "Family loved it ❤️", "Perfectly spiced 🌶️", "Easy to follow ✅"];

// Shared by /recipe-ratings/:recipeId (mode "create") and /edit-rating/:ratingId (mode "edit")
const RatingForm = ({ mode }) => {
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = currentUserId();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        let recipeId = id;
        if (isEdit) {
          const response = await axios.get(`${API_BASE}/ratings/${id}`);
          if (cancelled) return;
          setRating(Number(response.data.rating) || 0);
          setComment(response.data.comment || "");
          recipeId = response.data.recipeId;
        }
        try {
          const recipeResponse = await axios.get(`${API_BASE}/recipes/${recipeId}`);
          if (!cancelled) setRecipe(recipeResponse.data);
        } catch (recipeError) {
          console.log(recipeError);
        }
      } catch (error) {
        toast.error("Error retrieving rating. Please try again.");
        navigate("/recipes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  const addQuickNote = (note) => {
    setComment((current) => {
      const next = current ? `${current.trim()} ${note}` : note;
      return next.slice(0, MAX_COMMENT);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await axios.put(`${API_BASE}/ratings/update-rating/${id}`, { rating, comment });
        toast.success("Rating updated successfully!");
      } else {
        await axios.post(`${API_BASE}/ratings/new-rating`, { userId, recipeId: id, rating, comment });
        toast.success("Rating submitted successfully!");
      }
      setTimeout(() => navigate(recipe ? `/view-recipe/${recipe.recipeId}` : "/recipes"), 700);
    } catch (error) {
      toast.error(isEdit ? "Error updating rating. Please try again." : "Error submitting rating. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="sn-page">
      <div className="sn-container sn-container--narrow">
        <Link to={recipe ? `/view-recipe/${recipe.recipeId}` : "/recipes"} className="sn-back">
          <FiArrowLeft /> Back to recipe
        </Link>

        <motion.form
          className="sn-card sn-rate"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="sn-rate__recipe">
            {loading ? (
              <>
                <Skeleton height={84} width={84} radius={18} />
                <div style={{ flex: 1, display: "grid", gap: 10 }}>
                  <Skeleton height={14} width="30%" />
                  <Skeleton height={26} width="70%" />
                </div>
              </>
            ) : (
              <>
                <div className="sn-rate__thumb">
                  <RecipeImage fileName={recipe && recipe.fileName} alt={recipe ? recipe.name : "Recipe"} />
                </div>
                <div>
                  <p className="sn-eyebrow">{isEdit ? "Edit your review" : "Rate & review"}</p>
                  <h1>{recipe ? recipe.name : "This recipe"}</h1>
                  {recipe && (
                    <span className="sn-rate__meta">
                      <FiClock /> {humanCookingTime(recipe.cookingTime)}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <motion.div className="sn-rate__body" variants={stagger} initial="hidden" animate="show">
            <motion.div variants={rise} className="sn-rate__picker">
              <p className="sn-label sn-rate__question">How did it turn out?</p>
              <StarPicker value={rating} onChange={setRating} />
            </motion.div>

            <motion.div variants={rise} className="sn-field">
              <label className="sn-label" htmlFor="rate-comment">
                Your review <span className="sn-faint">(optional)</span>
              </label>
              <textarea
                id="rate-comment"
                className="sn-textarea"
                rows={4}
                value={comment}
                maxLength={MAX_COMMENT}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What worked, what you'd change, any tips for the next cook…"
              />
              <div className="sn-rate__notes">
                <div className="sn-rate__chips">
                  {QUICK_NOTES.map((note) => (
                    <button key={note} type="button" className="sn-chip" onClick={() => addQuickNote(note)}>
                      {note}
                    </button>
                  ))}
                </div>
                <span className="sn-hint">
                  {comment.length}/{MAX_COMMENT}
                </span>
              </div>
            </motion.div>

            <motion.div variants={rise} className="sn-rate__actions">
              <Link to="/recipes" className="sn-btn sn-btn--ghost">
                Cancel
              </Link>
              <button type="submit" className="sn-btn sn-btn--primary sn-shine" disabled={saving || loading}>
                {saving ? <span className="sn-spinner" aria-hidden="true" /> : <FiCheck />}
                {saving ? "Saving…" : isEdit ? "Update rating" : "Submit rating"}
              </button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default RatingForm;
