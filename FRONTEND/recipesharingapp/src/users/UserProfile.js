import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { FiArrowLeft, FiEdit2, FiMail, FiBookOpen, FiStar, FiAward, FiPlus, FiRefreshCw, FiClock } from "react-icons/fi";
import { API_BASE } from "../api";
import { Avatar, CountUp, EmptyState, RecipeImage, Skeleton, ease, rise, stagger } from "../ui/Primitives";
import { StarDisplay } from "../ui/StarRating";
import { CommunityArt, EmptyBowl, NoReviews } from "../ui/Illustrations";
import { averageRating, formatDate, humanCookingTime } from "../utils/format";
import cover from "../images/img3.jpg";
import "../component/ReviewsDrawer.css";
import "./UserProfile.css";

const TABS = [
  { id: "recipes", label: "Recipes", icon: FiBookOpen },
  { id: "reviews", label: "Reviews", icon: FiStar },
];

// Used by /profile (your own) and /viewuser/:id
const UserProfile = ({ userId, isOwn }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [tab, setTab] = useState("recipes");

  useEffect(() => {
    let cancelled = false;
    const loadUser = async () => {
      setStatus("loading");
      try {
        const result = await axios.get(`${API_BASE}/users/${userId}`);
        if (cancelled) return;
        setUser(result.data);
        setRatings(result.data.ratings || []);
        setRecipes(result.data.recipes || []);
        setStatus("ready");
        // The user aggregate omits photos and descriptions, so fetch the full recipes
        try {
          const full = await axios.get(`${API_BASE}/recipes/user/${userId}`);
          if (!cancelled) setRecipes(full.data || []);
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
        if (!cancelled) setStatus("error");
      }
    };
    if (userId) loadUser();
    else setStatus("error");
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (status === "loading") {
    return (
      <div className="sn-page sn-profile">
        <div className="sn-container">
          <Skeleton height={220} radius={28} />
          <div style={{ display: "flex", gap: 20, marginTop: -50, padding: "0 32px" }}>
            <Skeleton height={112} width={112} radius={999} />
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 24, maxWidth: 420 }}>
            <Skeleton height={36} width="70%" />
            <Skeleton height={16} width="50%" />
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
            art={<CommunityArt />}
            title={userId ? "Profile not available" : "You're not signed in"}
            text={
              userId
                ? "This cook may have left the platform, or the service is unreachable."
                : "Sign in to see your profile."
            }
            action={
              userId ? (
                <button type="button" className="sn-btn sn-btn--ghost" onClick={() => window.location.reload()}>
                  <FiRefreshCw /> Retry
                </button>
              ) : (
                <Link to="/" className="sn-btn sn-btn--primary">
                  Sign in
                </Link>
              )
            }
          />
        </div>
      </div>
    );
  }

  const avgGiven = averageRating(ratings);
  const stats = [
    { icon: FiBookOpen, label: "Recipes shared", value: recipes.length },
    { icon: FiStar, label: "Reviews written", value: ratings.length },
    { icon: FiAward, label: "Avg. score given", value: avgGiven, decimals: 1 },
  ];

  return (
    <div className="sn-page sn-profile">
      <div className="sn-container">
        <button type="button" className="sn-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <motion.section
          className="sn-profile__card sn-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="sn-profile__cover">
            <motion.img
              src={cover}
              alt=""
              aria-hidden="true"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease }}
            />
          </div>
          <div className="sn-profile__identity">
            <motion.div
              className="sn-profile__avatar"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.25 }}
            >
              <Avatar name={user.name} size={112} ring />
            </motion.div>
            <div className="sn-profile__names">
              <p className="sn-eyebrow">{isOwn ? "Your profile" : "Home cook"}</p>
              <h1>{user.name}</h1>
              <p className="sn-profile__email">
                <FiMail /> {user.email}
              </p>
            </div>
            <div className="sn-profile__actions">
              {isOwn ? (
                <>
                  <Link className="sn-btn sn-btn--ghost" to={`/edituser/${user.id}`}>
                    <FiEdit2 /> Edit profile
                  </Link>
                  <Link className="sn-btn sn-btn--primary" to="/add-recipe">
                    <FiPlus /> New recipe
                  </Link>
                </>
              ) : (
                <Link className="sn-btn sn-btn--ghost" to="/dashboard">
                  All members
                </Link>
              )}
            </div>
          </div>

          <motion.div className="sn-profile__stats" variants={stagger} initial="hidden" animate="show">
            {stats.map(({ icon: Icon, label, value, decimals }) => (
              <motion.div key={label} variants={rise} className="sn-profile__stat">
                <Icon />
                <strong>{value ? <CountUp value={value} decimals={decimals || 0} /> : "—"}</strong>
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <LayoutGroup id="profile-tabs">
          <div className="sn-tabs" role="tablist">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={`sn-tab ${tab === id ? "is-active" : ""}`}
                onClick={() => setTab(id)}
              >
                <Icon /> {label}
                <span className="sn-tab__count">{id === "recipes" ? recipes.length : ratings.length}</span>
                {tab === id && <motion.span layoutId="sn-tab-line" className="sn-tab__line" />}
              </button>
            ))}
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "recipes" &&
              (recipes.length === 0 ? (
                <EmptyState
                  art={<EmptyBowl size={150} />}
                  title="No recipes yet"
                  text={isOwn ? "Share your first dish with the community." : `${user.name} hasn't shared a recipe yet.`}
                  action={
                    isOwn && (
                      <Link className="sn-btn sn-btn--primary" to="/add-recipe">
                        <FiPlus /> Share a recipe
                      </Link>
                    )
                  }
                />
              ) : (
                <motion.div className="sn-mini-grid" variants={stagger} initial="hidden" animate="show">
                  {recipes.map((item) => (
                    <motion.div key={item.recipeId || item.name} variants={rise} whileHover={{ y: -5 }}>
                      <Link className="sn-mini" to={item.recipeId ? `/view-recipe/${item.recipeId}` : "/recipes"}>
                        <div className="sn-mini__img">
                          <RecipeImage fileName={item.fileName} alt={item.name} />
                        </div>
                        <div className="sn-mini__body">
                          <strong>{item.name}</strong>
                          <span>
                            <FiClock /> {humanCookingTime(item.cookingTime)} · {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ))}

            {tab === "reviews" &&
              (ratings.length === 0 ? (
                <EmptyState
                  art={<NoReviews />}
                  title="No reviews yet"
                  text={isOwn ? "Rate a recipe you've cooked to help others decide." : `${user.name} hasn't rated anything yet.`}
                  action={
                    isOwn && (
                      <Link className="sn-btn sn-btn--ghost" to="/recipes">
                        Browse recipes
                      </Link>
                    )
                  }
                />
              ) : (
                <motion.ul className="sn-reviews sn-profile__reviews" variants={stagger} initial="hidden" animate="show">
                  {ratings.map((item) => (
                    <motion.li key={item.ratingId} variants={rise} className="sn-review">
                      <div className="sn-review__content">
                        <div className="sn-review__top">
                          {item.recipe && item.recipe.recipeId ? (
                            <Link to={`/view-recipe/${item.recipe.recipeId}`} className="sn-profile__review-title">
                              {item.recipe.name}
                            </Link>
                          ) : (
                            <strong className="sn-profile__review-removed">
                              {item.recipe ? item.recipe.name : "Recipe removed"}
                            </strong>
                          )}
                          <StarDisplay value={Number(item.rating)} size={14} />
                        </div>
                        {item.comment ? <p>{item.comment}</p> : <p className="sn-review__nocomment">No comment left.</p>}
                        {isOwn && (
                          <div className="sn-review__actions">
                            <Link to={`/edit-rating/${item.ratingId}`} className="sn-btn sn-btn--ghost sn-btn--sm">
                              <FiEdit2 /> Edit
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
