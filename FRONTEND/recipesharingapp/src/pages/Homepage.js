import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiPlus, FiBookOpen, FiStar, FiUsers } from "react-icons/fi";
import "./Homepage.css";

import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import img4 from "../images/img4.jpg";
import { useRecipeData, emptyStats } from "../hooks/useRecipeData";
import RecipeCard from "../component/RecipeCard";
import "../component/RecipeCard.css";
import { CountUp, RecipeCardSkeleton, Reveal, ease, rise, stagger } from "../ui/Primitives";
import { StepShare, StepCook, StepRate, EmptyBowl } from "../ui/Illustrations";
import { currentUserId, currentUserName } from "../api";
import { greeting } from "../utils/format";

const SLIDES = [
  { image: img1, caption: "Spice-route curries & saffron rice" },
  { image: img2, caption: "Potluck spreads from the community" },
  { image: img3, caption: "Seasonal cooking, chef's table" },
  { image: img4, caption: "Biryani, kebabs & copper-pot classics" },
];

const SLIDE_MS = 5500;

const STEPS = [
  { art: <StepShare />, title: "Share your recipe", text: "Post a dish with ingredients, cook time, calories and a photo in a couple of minutes." },
  { art: <StepCook />, title: "Cook from the community", text: "Browse what others are making, search by name and sort by the quickest or the best rated." },
  { art: <StepRate />, title: "Rate & review", text: "Leave a score out of ten and a note, so every cook knows what's worth making next." },
];

const Homepage = () => {
  const reduceMotion = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const { recipes, ratings, users, usersById, statsByRecipe, loading } = useRecipeData();
  const userId = currentUserId();
  const firstName = currentUserName().split(" ")[0];

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [slide, reduceMotion]);

  // Best average first, more reviews breaks ties; unrated recipes fill the gaps
  const trending = useMemo(
    () =>
      [...recipes]
        .sort((a, b) => {
          const sa = statsByRecipe[a.recipeId] || emptyStats;
          const sb = statsByRecipe[b.recipeId] || emptyStats;
          return sb.avg - sa.avg || sb.count - sa.count;
        })
        .slice(0, 3),
    [recipes, statsByRecipe]
  );

  return (
    <div className="sn-home">
      {/* ---------- Hero ---------- */}
      <section className="sn-hero">
        <div className="sn-hero__media" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.img
              key={slide}
              src={SLIDES[slide].image}
              alt=""
              className="sn-hero__img"
              initial={{ opacity: 0, scale: 1.14 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.2 }, scale: { duration: SLIDE_MS / 1000 + 1.2, ease: "linear" } }}
            />
          </AnimatePresence>
          <div className="sn-hero__veil" />
        </div>

        <div className="sn-container sn-hero__inner">
          <motion.div className="sn-hero__copy" variants={stagger} initial="hidden" animate="show">
            <motion.p variants={rise} className="sn-eyebrow">
              {greeting()}
              {firstName ? `, ${firstName}` : ""} 👋
            </motion.p>
            <motion.h1 variants={rise} className="sn-hero__title">
              Cook it. <em className="sn-gradient-text">Share it.</em>
              <br />
              Savor every rating.
            </motion.h1>
            <motion.p variants={rise} className="sn-hero__lead">
              A home for the dishes you love: post recipes, discover what the community is cooking, and rate the
              plates worth repeating.
            </motion.p>
            <motion.div variants={rise} className="sn-hero__ctas">
              <Link to="/recipes" className="sn-btn sn-btn--primary sn-btn--lg sn-shine">
                Explore recipes <FiArrowRight />
              </Link>
              <Link to="/add-recipe" className="sn-btn sn-btn--ghost sn-btn--lg">
                <FiPlus /> Share a recipe
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="sn-hero__stats"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
          >
            <div className="sn-stat sn-card">
              <FiBookOpen />
              <strong>
                <CountUp value={recipes.length} />
              </strong>
              <span>Recipes shared</span>
            </div>
            <div className="sn-stat sn-card">
              <FiStar />
              <strong>
                <CountUp value={ratings.length} />
              </strong>
              <span>Ratings given</span>
            </div>
            <div className="sn-stat sn-card">
              <FiUsers />
              <strong>
                <CountUp value={users.length} />
              </strong>
              <span>Home cooks</span>
            </div>
          </motion.div>
        </div>

        <div className="sn-container sn-hero__footer">
          <AnimatePresence mode="wait">
            <motion.span
              key={slide}
              className="sn-hero__caption"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {SLIDES[slide].caption}
            </motion.span>
          </AnimatePresence>
          <div className="sn-hero__dots" role="tablist" aria-label="Featured photos">
            {SLIDES.map((s, i) => (
              <button
                key={s.caption}
                type="button"
                role="tab"
                aria-selected={i === slide}
                aria-label={s.caption}
                className={`sn-hero__dot ${i === slide ? "is-active" : ""}`}
                onClick={() => setSlide(i)}
              >
                <span key={i === slide ? `on-${slide}` : "off"} style={{ animationDuration: `${SLIDE_MS}ms` }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Trending ---------- */}
      <section className="sn-container sn-section">
        <Reveal className="sn-section-head">
          <div>
            <p className="sn-eyebrow">Trending now</p>
            <h2>The community's favourites</h2>
          </div>
          <Link to="/recipes" className="sn-btn sn-btn--ghost">
            View all recipes <FiArrowRight />
          </Link>
        </Reveal>

        {loading ? (
          <div className="sn-rgrid">
            {[0, 1, 2].map((i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : trending.length ? (
          <motion.div
            className="sn-rgrid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {trending.map((recipe) => (
              <RecipeCard
                key={recipe.recipeId}
                recipe={recipe}
                stats={statsByRecipe[recipe.recipeId]}
                authorName={usersById[recipe.userId] && usersById[recipe.userId].name}
                isOwner={recipe.userId === userId}
              />
            ))}
          </motion.div>
        ) : (
          <div className="sn-card sn-home__empty">
            <EmptyBowl />
            <h3>No recipes yet</h3>
            <p className="sn-muted">Be the first to put something on the table.</p>
            <Link to="/add-recipe" className="sn-btn sn-btn--primary">
              <FiPlus /> Share a recipe
            </Link>
          </div>
        )}
      </section>

      {/* ---------- How it works ---------- */}
      <section className="sn-container sn-section">
        <Reveal className="sn-section-head sn-section-head--center">
          <div>
            <p className="sn-eyebrow">How it works</p>
            <h2>From your stove to the whole table</h2>
          </div>
        </Reveal>
        <div className="sn-steps">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12} className="sn-step sn-card">
              <span className="sn-step__num">0{i + 1}</span>
              {step.art}
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="sn-container sn-section">
        <Reveal className="sn-cta">
          <img src={img4} alt="" className="sn-cta__img" aria-hidden="true" />
          <div className="sn-cta__veil" />
          <div className="sn-cta__content">
            <p className="sn-eyebrow">Your kitchen has a story</p>
            <h2>Got a dish everyone asks you for?</h2>
            <p>Write it down once and let the whole community cook it.</p>
            <Link to="/add-recipe" className="sn-btn sn-btn--primary sn-btn--lg sn-shine">
              <FiPlus /> Post your recipe
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Homepage;
