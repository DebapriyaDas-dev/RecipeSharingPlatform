import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiBookOpen,
  FiClock,
  FiImage,
  FiPlus,
  FiTrash2,
  FiUploadCloud,
  FiZap,
  FiCheck,
  FiList,
} from "react-icons/fi";
import { API_BASE, currentUserId, currentUserName, errorMessage, recipeImageUrl } from "../api";
import { uploadPostImage } from "../service/PostService";
import RecipeCard from "../component/RecipeCard";
import { PageHeader, Skeleton, ease } from "../ui/Primitives";
import { formatCookingTime, parseCookingTime, todayIso } from "../utils/format";
import "../component/RecipeCard.css";
import "./RecipeForm.css";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // recipe-service multipart limit
const TIME_PRESETS = [
  { label: "15 min", hours: 0, minutes: 15 },
  { label: "30 min", hours: 0, minutes: 30 },
  { label: "45 min", hours: 0, minutes: 45 },
  { label: "1 hr", hours: 1, minutes: 0 },
  { label: "1 hr 30", hours: 1, minutes: 30 },
];

// `_key` keeps row animations stable; it is stripped before saving
let rowSeq = 0;
const blankIngredient = () => ({ name: "", quantity: "", _key: `new-${rowSeq++}` });
const withoutKey = ({ _key, ...ingredient }) => ingredient;

const Section = ({ icon: Icon, step, title, hint, children, delay = 0 }) => (
  <motion.section
    className="sn-card sn-card--pad sn-form-section"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease, delay }}
  >
    <header className="sn-form-section__head">
      <span className="sn-form-section__icon">
        <Icon />
      </span>
      <div>
        <p className="sn-form-section__step">Step {step}</p>
        <h2>{title}</h2>
        {hint && <p className="sn-hint">{hint}</p>}
      </div>
    </header>
    {children}
  </motion.section>
);

// Shared by /add-recipe (mode "create") and /edit-recipe/:id (mode "edit")
const RecipeForm = ({ mode }) => {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [recipe, setRecipe] = useState({
    userId: currentUserId(),
    name: "",
    createdAt: todayIso(),
    recipeDescription: "",
    kiloCalories: "",
    ingredients: [blankIngredient()],
    fileName: "",
  });
  const [time, setTime] = useState({ hours: 0, minutes: 30, seconds: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const loadRecipe = async () => {
      try {
        const result = await axios.get(`${API_BASE}/recipes/${id}`);
        const data = result.data;
        setRecipe({
          ...data,
          ingredients:
            data.ingredients && data.ingredients.length
              ? data.ingredients.map((ing) => ({ ...ing, _key: `id-${ing.id}` }))
              : [blankIngredient()],
        });
        // Keep the saved cooking time instead of resetting it
        setTime(parseCookingTime(data.cookingTime));
        setPreview(recipeImageUrl(data.fileName));
      } catch (err) {
        console.log(err);
        toast.error("Could not load that recipe.");
        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [isEdit, id, navigate]);

  const handleChange = (e) => {
    setRecipe((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleIngredientChange = (index, field, value) => {
    setRecipe((current) => ({
      ...current,
      ingredients: current.ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    }));
  };

  const addIngredient = () => {
    setRecipe((current) => ({ ...current, ingredients: [...current.ingredients, blankIngredient()] }));
  };

  const removeIngredient = (index) => {
    setRecipe((current) => ({
      ...current,
      ingredients:
        current.ingredients.length === 1 ? [blankIngredient()] : current.ingredients.filter((_, i) => i !== index),
    }));
  };

  const acceptFile = (localFile) => {
    if (!localFile) return;
    if (localFile.type !== "image/png" && localFile.type !== "image/jpeg") {
      toast.error("Please choose a PNG or JPEG image.");
      return;
    }
    if (localFile.size > MAX_IMAGE_BYTES) {
      toast.error("That image is over 10 MB. Please choose a smaller one.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (r) => setPreview(r.target.result);
    reader.readAsDataURL(localFile);
    setImageFile(localFile);
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(isEdit ? recipeImageUrl(recipe.fileName) : null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const text = (value) => String(value === null || value === undefined ? "" : value).trim();
  const filledIngredients = recipe.ingredients.filter((ing) => text(ing.name) || text(ing.quantity));
  const errors = {
    name: text(recipe.name).length < 3 ? "Give your recipe a name of at least 3 characters." : "",
    recipeDescription: !text(recipe.recipeDescription) ? "Add a short description." : "",
    kiloCalories:
      text(recipe.kiloCalories) === "" || Number(recipe.kiloCalories) < 0 ? "Enter the calories (0 or more)." : "",
    time: time.hours * 60 + time.minutes + time.seconds === 0 ? "Set a cooking time." : "",
    ingredients: !filledIngredients.length
      ? "Add at least one ingredient."
      : filledIngredients.some((ing) => !text(ing.name) || !text(ing.quantity))
      ? "Each ingredient needs a name and a quantity."
      : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const showError = (key) => submitted && errors[key];

  const checklist = [
    { label: "Name", done: !errors.name },
    { label: "Description", done: !errors.recipeDescription },
    { label: "Cook time", done: !errors.time },
    { label: "Calories", done: !errors.kiloCalories },
    { label: "Ingredients", done: !errors.ingredients },
    { label: "Photo", done: Boolean(preview) },
  ];
  const progress = checklist.filter((c) => c.done).length / checklist.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors || saving) {
      toast.error("A few details still need attention.");
      return;
    }
    setSaving(true);
    const payload = {
      ...recipe,
      kiloCalories: Number(recipe.kiloCalories),
      cookingTime: formatCookingTime(time),
      ingredients: filledIngredients.map(withoutKey),
    };
    try {
      const response = isEdit
        ? await axios.put(`${API_BASE}/recipes/update-recipe/${id}`, payload)
        : await axios.post(`${API_BASE}/recipes/new-recipe`, payload);
      const recipeId = response.data.recipeId;
      // Only upload when a new photo was chosen
      if (imageFile) {
        try {
          await uploadPostImage(imageFile, recipeId);
          toast.success(isEdit ? "Image updated successfully!" : "Image uploaded successfully!");
        } catch (uploadError) {
          console.log(uploadError);
          toast.error("Error in uploading image");
        }
      }
      toast.success(isEdit ? "Recipe updated successfully!" : "Recipe posted successfully!");
      setTimeout(() => navigate(`/view-recipe/${recipeId}`), 900);
    } catch (err) {
      console.error(err);
      toast.error(errorMessage(err, isEdit ? "Error in updating data!" : "Error in posting data!"));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="sn-page">
        <div className="sn-container">
          <Skeleton height={56} width="50%" />
          <div className="sn-form-layout" style={{ marginTop: 32 }}>
            <div style={{ display: "grid", gap: 20 }}>
              <Skeleton height={220} radius={24} />
              <Skeleton height={180} radius={24} />
            </div>
            <Skeleton height={460} radius={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sn-page">
      <div className="sn-container">
        <Link to="/recipes" className="sn-back">
          <FiArrowLeft /> All recipes
        </Link>
        <PageHeader
          eyebrow={isEdit ? "Edit recipe" : "New recipe"}
          title={isEdit ? "Polish your" : "Share your"}
          highlight={isEdit ? "recipe" : "signature dish"}
          subtitle={
            isEdit
              ? "Update the details below. The preview shows how it will look to everyone."
              : "Fill in the details below and watch your recipe card come together on the right."
          }
        />

        <form className="sn-form-layout" onSubmit={handleSubmit} noValidate>
          <div className="sn-form-main">
            <Section icon={FiBookOpen} step={1} title="The basics">
              <div className="sn-field">
                <label className="sn-label" htmlFor="rf-name">
                  Recipe name
                </label>
                <input
                  id="rf-name"
                  name="name"
                  className="sn-input"
                  value={recipe.name ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. Smoky butter chicken"
                  aria-invalid={Boolean(showError("name"))}
                  maxLength={80}
                />
                {showError("name") && <p className="sn-error-text">{errors.name}</p>}
              </div>
              <div className="sn-field">
                <label className="sn-label" htmlFor="rf-desc">
                  Short description
                </label>
                <textarea
                  id="rf-desc"
                  name="recipeDescription"
                  className="sn-textarea"
                  value={recipe.recipeDescription ?? ""}
                  onChange={handleChange}
                  placeholder="What makes it special? Flavours, occasion, a little story…"
                  aria-invalid={Boolean(showError("recipeDescription"))}
                  maxLength={240}
                  rows={3}
                />
                <div className="sn-form-row-between">
                  {showError("recipeDescription") ? (
                    <p className="sn-error-text">{errors.recipeDescription}</p>
                  ) : (
                    <span />
                  )}
                  <span className="sn-hint">{text(recipe.recipeDescription).length}/240</span>
                </div>
              </div>
            </Section>

            <Section icon={FiClock} step={2} title="Time & nutrition" delay={0.08}>
              <div className="sn-form-grid-2">
                <div className="sn-field">
                  <span className="sn-label">Cooking time</span>
                  <div className="sn-time">
                    <label className="sn-time__unit">
                      <select
                        className="sn-select"
                        value={time.hours}
                        onChange={(e) => setTime({ ...time, hours: Number(e.target.value) })}
                        aria-label="Hours"
                      >
                        {Array.from({ length: 13 }, (_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      <span>hr</span>
                    </label>
                    <label className="sn-time__unit">
                      <select
                        className="sn-select"
                        value={time.minutes}
                        onChange={(e) => setTime({ ...time, minutes: Number(e.target.value) })}
                        aria-label="Minutes"
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i}>
                            {String(i).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      <span>min</span>
                    </label>
                  </div>
                  <div className="sn-time__presets">
                    {TIME_PRESETS.map((p) => {
                      const active = time.hours === p.hours && time.minutes === p.minutes;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          className={`sn-chip ${active ? "sn-chip--active" : ""}`}
                          onClick={() => setTime({ hours: p.hours, minutes: p.minutes, seconds: 0 })}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                  {showError("time") && <p className="sn-error-text">{errors.time}</p>}
                </div>
                <div className="sn-field">
                  <label className="sn-label" htmlFor="rf-kcal">
                    Calories per serving
                  </label>
                  <div className="sn-input-wrap sn-kcal">
                    <FiZap />
                    <input
                      id="rf-kcal"
                      name="kiloCalories"
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className="sn-input"
                      value={recipe.kiloCalories ?? ""}
                      onChange={handleChange}
                      placeholder="450"
                      aria-invalid={Boolean(showError("kiloCalories"))}
                    />
                    <span className="sn-kcal__unit">kcal</span>
                  </div>
                  {showError("kiloCalories") && <p className="sn-error-text">{errors.kiloCalories}</p>}
                </div>
              </div>
            </Section>

            <Section
              icon={FiList}
              step={3}
              title="Ingredients"
              hint="List each ingredient with its quantity."
              delay={0.16}
            >
              <motion.ul className="sn-ing-rows" layout>
                <AnimatePresence initial={false}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.li
                      key={ingredient._key}
                      className="sn-ing-row"
                      layout
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, x: 30 }}
                      transition={{ duration: 0.28, ease }}
                    >
                      <span className="sn-ing-row__num">{index + 1}</span>
                      <input
                        className="sn-input"
                        value={ingredient.name ?? ""}
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                        placeholder="Ingredient, e.g. Basmati rice"
                        aria-label={`Ingredient ${index + 1} name`}
                      />
                      <input
                        className="sn-input sn-ing-row__qty"
                        value={ingredient.quantity ?? ""}
                        onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (index === recipe.ingredients.length - 1) addIngredient();
                          }
                        }}
                        placeholder="Qty, e.g. 2 cups"
                        aria-label={`Ingredient ${index + 1} quantity`}
                      />
                      <button
                        type="button"
                        className="sn-icon-btn sn-icon-btn--danger"
                        onClick={() => removeIngredient(index)}
                        aria-label={`Remove ingredient ${index + 1}`}
                        title="Remove"
                      >
                        <FiTrash2 />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
              <button type="button" className="sn-btn sn-btn--ghost sn-ing-add" onClick={addIngredient}>
                <FiPlus /> Add ingredient
              </button>
              {showError("ingredients") && <p className="sn-error-text">{errors.ingredients}</p>}
            </Section>

            <Section icon={FiImage} step={4} title="Photo" hint="PNG or JPEG, up to 10 MB. Optional, but recipes with photos get more love." delay={0.24}>
              <label
                className={`sn-drop ${dragging ? "is-dragging" : ""} ${preview ? "has-image" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  acceptFile(e.dataTransfer.files[0]);
                }}
              >
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => acceptFile(e.target.files[0])}
                />
                <AnimatePresence mode="wait">
                  {preview ? (
                    <motion.img
                      key={preview}
                      src={preview}
                      alt="Recipe preview"
                      className="sn-drop__img"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  ) : (
                    <motion.div key="empty" className="sn-drop__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="sn-drop__icon">
                        <FiUploadCloud />
                      </span>
                      <strong>Drop a photo here</strong>
                      <span>or click to browse</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {preview && <span className="sn-drop__change">Click or drop to replace</span>}
              </label>
              {imageFile && (
                <div className="sn-drop__meta">
                  <span>
                    <FiCheck /> {imageFile.name}
                  </span>
                  <button type="button" className="sn-btn sn-btn--ghost sn-btn--sm" onClick={clearImage}>
                    {isEdit ? "Keep current photo" : "Remove"}
                  </button>
                </div>
              )}
            </Section>
          </div>

          <aside className="sn-form-aside">
            <motion.div
              className="sn-form-aside__inner"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.2 }}
            >
              <div className="sn-card sn-card--pad sn-progress-card">
                <div className="sn-ring" aria-hidden="true">
                  <svg viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="19" className="sn-ring__track" />
                    <motion.circle
                      cx="22"
                      cy="22"
                      r="19"
                      className="sn-ring__value"
                      initial={false}
                      animate={{ pathLength: progress }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </svg>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div>
                  <strong>{progress === 1 ? "Ready to serve!" : "Almost there"}</strong>
                  <ul className="sn-progress-card__list">
                    {checklist.map((c) => (
                      <li key={c.label} className={c.done ? "is-done" : ""}>
                        {c.done ? <FiCheck /> : <span className="sn-dot" />} {c.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="sn-eyebrow sn-form-aside__label">Live preview</p>
              <RecipeCard
                recipe={{ ...recipe, cookingTime: formatCookingTime(time) }}
                imageSrc={preview}
                authorName={currentUserName() || "You"}
                preview
              />

              <div className="sn-form-actions">
                <Link to="/recipes" className="sn-btn sn-btn--ghost">
                  Cancel
                </Link>
                <button type="submit" className="sn-btn sn-btn--primary sn-shine" disabled={saving}>
                  {saving ? <span className="sn-spinner" aria-hidden="true" /> : <FiCheck />}
                  {saving ? "Saving…" : isEdit ? "Save changes" : "Publish recipe"}
                </button>
              </div>
            </motion.div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
