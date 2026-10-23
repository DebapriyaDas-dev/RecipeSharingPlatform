import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Avatar, RecipeImage, stagger, rise } from "../ui/Primitives";
import { StarDisplay } from "../ui/StarRating";
import { NoReviews } from "../ui/Illustrations";
import { averageRating } from "../utils/format";
import "./ReviewsDrawer.css";

// Slide-over panel listing a recipe's ratings
const ReviewsDrawer = ({ recipe, ratings = [], usersById, currentUserId, onClose, onDeleteRating }) => {
  const open = Boolean(recipe);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const avg = averageRating(ratings);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sn-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.aside
            className="sn-drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Reviews for ${recipe.name}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <header className="sn-drawer__head">
              <div className="sn-drawer__thumb">
                <RecipeImage fileName={recipe.fileName} alt={recipe.name} />
              </div>
              <div className="sn-drawer__title">
                <p className="sn-eyebrow">Reviews</p>
                <h2>{recipe.name}</h2>
                <StarDisplay value={avg} size={15} count={ratings.length} />
              </div>
              <button type="button" className="sn-icon-btn" onClick={onClose} aria-label="Close reviews">
                <FiX />
              </button>
            </header>

            <div className="sn-drawer__body">
              {ratings.length === 0 ? (
                <div className="sn-drawer__empty">
                  <NoReviews />
                  <h3>No reviews yet</h3>
                  <p>Cooked this one? Be the first to tell everyone how it went.</p>
                </div>
              ) : (
                <motion.ul className="sn-reviews" variants={stagger} initial="hidden" animate="show">
                  <AnimatePresence>
                    {ratings.map((rating) => {
                      const author = usersById[rating.userId];
                      const mine = rating.userId === currentUserId;
                      const name = mine ? "You" : author ? author.name : "Former member";
                      return (
                        <motion.li
                          key={rating.ratingId}
                          className={`sn-review ${mine ? "sn-review--mine" : ""}`}
                          variants={rise}
                          layout
                          exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                        >
                          <Avatar name={author ? author.name : "?"} size={40} />
                          <div className="sn-review__content">
                            <div className="sn-review__top">
                              <strong>{name}</strong>
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
                                <button
                                  type="button"
                                  className="sn-btn sn-btn--danger sn-btn--sm"
                                  onClick={() => onDeleteRating(rating)}
                                >
                                  <FiTrash2 /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>

            <footer className="sn-drawer__foot">
              <Link to={`/recipe-ratings/${recipe.recipeId}`} className="sn-btn sn-btn--primary sn-btn--block sn-shine">
                <FiPlus /> Add your rating
              </Link>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewsDrawer;
