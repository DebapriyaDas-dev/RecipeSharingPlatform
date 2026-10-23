import React, { useContext, useEffect, useState } from "react";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineArrowRight,
  AiOutlineCheck,
} from "react-icons/ai";
import { VscKey } from "react-icons/vsc";
import { GiCookingPot } from "react-icons/gi";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../App";
import heroImage from "../images/img1.jpg";
import "./Login.css";

const ROTATING_WORDS = ["Share", "Savor", "Inspire", "Create"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};

const rise = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const Login = () => {
  const { setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const shake = useAnimationControls();
  const [wordIndex, setWordIndex] = useState(0);

  // Hero parallax follows the pointer
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 20 });
  const imageX = useTransform(smoothX, (v) => v * -18);
  const imageY = useTransform(smoothY, (v) => v * -18);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setInterval(
      () => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length),
      2600
    );
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const handlePointerMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleChange = (e) => {
    setLoginError(false);
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const setUserIdentity = (userId, userName, loggedIn) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("loggedIn", loggedIn);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("loading");
    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        user
      );
      const data = response.data;
      if (data.loggedIn) {
        setLoginError(false);
        setStatus("success");
        setUserIdentity(data.id, data.name, data.loggedIn);
        setLoggedIn(data.loggedIn);
        toast.success("Welcome " + data.name);
        setTimeout(() => {
          navigate("/home");
        }, 2500);
      } else {
        setStatus("idle");
      }
    } catch (err) {
      setStatus("idle");
      setLoginError(true);
      if (!reduceMotion) {
        shake.start({
          x: [0, -12, 10, -8, 6, -3, 0],
          transition: { duration: 0.5 },
        });
      }
      console.log(err);
    }
  };

  return (
    <div className="lx-page" onMouseMove={handlePointerMove}>
      <div className="lx-aurora" aria-hidden="true">
        <span className="lx-blob lx-blob--saffron" />
        <span className="lx-blob lx-blob--ember" />
        <span className="lx-blob lx-blob--plum" />
      </div>
      <div className="lx-embers" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>
      <div className="lx-grain" aria-hidden="true" />

      <motion.div
        className="lx-shell"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <section className="lx-hero" aria-hidden="true">
          <motion.img
            src={heroImage}
            alt=""
            className="lx-hero__img"
            style={{ x: imageX, y: imageY }}
          />
          <div className="lx-hero__veil" />
          <div className="lx-hero__content">
            <span className="lx-badge">
              <GiCookingPot /> The Recipe Club
            </span>
            <h2 className="lx-hero__title">
              <span className="lx-rotator">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ROTATING_WORDS[wordIndex]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="lx-shimmer"
                  >
                    {ROTATING_WORDS[wordIndex]}.
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              Every recipe finds its table.
            </h2>
            <p className="lx-hero__copy">
              Home cooks and chefs trading the dishes they love, one plate at a
              time.
            </p>
            <div className="lx-chips">
              <span className="lx-chip">🍛 Curated recipes</span>
              <span className="lx-chip">⭐ Honest ratings</span>
              <span className="lx-chip">🔥 Fresh every day</span>
            </div>
          </div>
        </section>

        <section className="lx-panel">
          <motion.div className="lx-card" animate={shake}>
            <motion.form
              onSubmit={handleSubmit}
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={rise} className="lx-logo">
                <GiCookingPot />
              </motion.div>
              <motion.p variants={rise} className="lx-eyebrow">
                Members only
              </motion.p>
              <motion.h1 variants={rise} className="lx-title">
                Welcome <em>back</em>
              </motion.h1>
              <motion.p variants={rise} className="lx-subtitle">
                Sign in to pick up where your kitchen left off.
              </motion.p>

              <motion.div variants={rise} className="lx-field">
                <AiOutlineMail className="lx-field__icon" aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={user.email || ""}
                  onChange={handleChange}
                  placeholder=" "
                  autoComplete="email"
                  required
                />
                <label htmlFor="login-email">Email address</label>
                <span className="lx-field__glow" aria-hidden="true" />
              </motion.div>

              <motion.div variants={rise} className="lx-field">
                <VscKey className="lx-field__icon" aria-hidden="true" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={user.password || ""}
                  onChange={handleChange}
                  placeholder=" "
                  autoComplete="current-password"
                  minLength={6}
                  required
                />
                <label htmlFor="login-password">Password</label>
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="lx-field__toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
                <span className="lx-field__glow" aria-hidden="true" />
              </motion.div>

              <div className="lx-error" aria-live="polite">
                <AnimatePresence>
                  {loginError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      Invalid email or password.
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
                    <span className="lx-spinner" aria-hidden="true" />
                    Signing in…
                  </>
                )}
                {status === "success" && (
                  <>
                    <AiOutlineCheck /> Welcome in
                  </>
                )}
                {status === "idle" && (
                  <>
                    Sign in <AiOutlineArrowRight className="lx-button__arrow" />
                  </>
                )}
              </motion.button>

              <motion.div variants={rise} className="lx-divider">
                <span>new here?</span>
              </motion.div>

              <motion.p variants={rise} className="lx-footer">
                Join the table and start sharing.{" "}
                <Link to="/register" className="lx-link">
                  Register now
                </Link>
              </motion.p>
            </motion.form>
          </motion.div>
        </section>
      </motion.div>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Login;
