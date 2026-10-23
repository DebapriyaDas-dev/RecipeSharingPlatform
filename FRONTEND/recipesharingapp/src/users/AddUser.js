import React, { useState } from "react";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiOutlineArrowRight,
  AiOutlineCheck,
} from "react-icons/ai";
import { VscKey } from "react-icons/vsc";
import { FiCheck, FiX } from "react-icons/fi";
import { GiChefToque } from "react-icons/gi";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { API_BASE, errorMessage } from "../api";
import heroImage from "../images/img3.jpg";
import AuthShell from "./AuthShell";
import { container, rise } from "./Login";
import "./AddUser.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the backend's password validation on the User entity
const PASSWORD_RULES = [
  { label: "8+ characters", test: (p) => p.length >= 8 },
  { label: "A number", test: (p) => /[0-9]/.test(p) },
  { label: "A special character (@#$%^&+=)", test: (p) => /[@#$%^&+=]/.test(p) },
  { label: "No spaces", test: (p) => p.length > 0 && !/\s/.test(p) },
];

const STRENGTH = ["Too weak", "Weak", "Getting there", "Almost", "Strong"];

const AddUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    password: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [serverError, setServerError] = useState("");

  const passed = PASSWORD_RULES.filter((rule) => rule.test(user.password)).length;
  const passwordValid = passed === PASSWORD_RULES.length;
  const emailValid = EMAIL_REGEX.test(user.email);
  const nameValid = user.name.trim().length >= 3;

  const handleChange = (e) => {
    setServerError("");
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (!nameValid || !emailValid || !passwordValid || status !== "idle") return;
    setStatus("loading");
    try {
      await axios.post(`${API_BASE}/users/register`, user);
      setStatus("success");
      toast.success("Registration successful. Please log in, " + user.name);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.log(err);
      setStatus("idle");
      setServerError(errorMessage(err, "Registration failed. That email may already be registered."));
    }
  };

  const fieldError = (name, valid, message) =>
    touched[name] && !valid ? <p className="sn-reg__error">{message}</p> : null;

  return (
    <AuthShell
      image={heroImage}
      rotatingWords={["Cook", "Share", "Rate", "Repeat"]}
      headline="Your recipes deserve an audience."
      copy="Create a free account to post your dishes, collect ratings and discover what other cooks are making."
      chips={["👩‍🍳 Your own cookbook", "💬 Real feedback", "🌶️ New flavours"]}
    >
      <div className="lx-card">
        <motion.form onSubmit={handleSubmit} variants={container} initial="hidden" animate="show" noValidate>
          <motion.div variants={rise} className="lx-logo">
            <GiChefToque />
          </motion.div>
          <motion.p variants={rise} className="lx-eyebrow">
            Join the club
          </motion.p>
          <motion.h1 variants={rise} className="lx-title">
            Create <em>account</em>
          </motion.h1>
          <motion.p variants={rise} className="lx-subtitle">
            It takes less than a minute.
          </motion.p>

          <motion.div variants={rise} className="lx-field">
            <AiOutlineUser className="lx-field__icon" aria-hidden="true" />
            <input
              id="reg-name"
              name="name"
              type="text"
              value={user.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              autoComplete="name"
              aria-invalid={touched.name && !nameValid}
              required
            />
            <label htmlFor="reg-name">Full name</label>
            <span className="lx-field__glow" aria-hidden="true" />
          </motion.div>
          {fieldError("name", nameValid, "Name must be at least 3 characters.")}

          <motion.div variants={rise} className="lx-field">
            <AiOutlineMail className="lx-field__icon" aria-hidden="true" />
            <input
              id="reg-email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              autoComplete="email"
              aria-invalid={touched.email && !emailValid}
              required
            />
            <label htmlFor="reg-email">Email address</label>
            <span className="lx-field__glow" aria-hidden="true" />
          </motion.div>
          {fieldError("email", emailValid, "Enter a valid email address.")}

          <motion.div variants={rise} className="lx-field">
            <VscKey className="lx-field__icon" aria-hidden="true" />
            <input
              id="reg-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              autoComplete="new-password"
              aria-invalid={touched.password && !passwordValid}
              required
            />
            <label htmlFor="reg-password">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="lx-field__toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            <span className="lx-field__glow" aria-hidden="true" />
          </motion.div>

          <motion.div variants={rise} className="sn-reg__strength" aria-live="polite">
            <div className="sn-reg__meter">
              {PASSWORD_RULES.map((rule, i) => (
                <span key={rule.label} className={i < passed ? `is-on is-on--${passed}` : ""} />
              ))}
            </div>
            <span className="sn-reg__strength-label">{user.password ? STRENGTH[passed] : "Password strength"}</span>
          </motion.div>

          <motion.ul variants={rise} className="sn-reg__rules">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(user.password);
              return (
                <li key={rule.label} className={ok ? "is-ok" : ""}>
                  <motion.span
                    key={String(ok)}
                    initial={{ scale: 0.4, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  >
                    {ok ? <FiCheck /> : <FiX />}
                  </motion.span>
                  {rule.label}
                </li>
              );
            })}
          </motion.ul>

          <div className="lx-error" aria-live="polite">
            <AnimatePresence>
              {serverError && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            variants={rise}
            type="submit"
            className={`lx-button lx-button--${status}`}
            whileHover={status === "idle" ? { scale: 1.02 } : undefined}
            whileTap={status === "idle" ? { scale: 0.98 } : undefined}
            disabled={status !== "idle"}
          >
            <span className="lx-button__shine" aria-hidden="true" />
            {status === "loading" && (
              <>
                <span className="lx-spinner" aria-hidden="true" /> Creating account…
              </>
            )}
            {status === "success" && (
              <>
                <AiOutlineCheck /> You're in
              </>
            )}
            {status === "idle" && (
              <>
                Create account <AiOutlineArrowRight className="lx-button__arrow" />
              </>
            )}
          </motion.button>

          <motion.div variants={rise} className="lx-divider">
            <span>already a member?</span>
          </motion.div>
          <motion.p variants={rise} className="lx-footer">
            Welcome back to the table.{" "}
            <Link to="/" className="lx-link">
              Sign in
            </Link>
          </motion.p>
        </motion.form>
      </div>
    </AuthShell>
  );
};

export default AddUser;
