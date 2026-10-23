import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiHome,
  FiBookOpen,
  FiUsers,
  FiUser,
  FiPlus,
  FiLogOut,
  FiTrash2,
  FiChevronDown,
} from "react-icons/fi";
import { AuthContext } from "../App";
import { API_BASE } from "../api";
import { LogoMark } from "../ui/Illustrations";
import { Avatar } from "../ui/Primitives";
import ConfirmDialog from "../ui/ConfirmDialog";
import "./Navbar.css";

const LINKS = [
  { to: "/home", label: "Home", icon: FiHome },
  { to: "/recipes", label: "Recipes", icon: FiBookOpen },
  { to: "/dashboard", label: "Community", icon: FiUsers },
  { to: "/profile", label: "Profile", icon: FiUser },
];

export const Brand = ({ to }) => (
  <Link className="sn-nav__brand" to={to}>
    <LogoMark size={34} />
    <span>
      Recipe<b>Club</b>
    </span>
  </Link>
);

const Navbar = () => {
  const { setLoggedIn, userName, setUserName } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dialog, setDialog] = useState(null); // "logout" | "delete"
  const [busy, setBusy] = useState(false);
  const accountRef = useRef(null);
  const name = userName || localStorage.getItem("userName") || "Chef";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onClick = (e) => accountRef.current && !accountRef.current.contains(e.target) && setAccountOpen(false);
    const onKey = (e) => e.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const clearSession = () => {
    localStorage.removeItem("userId");
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("userName");
    setUserName(null);
  };

  const handleLogout = async () => {
    setBusy(true);
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(`${API_BASE}/users/logout/${userId}`);
      clearSession();
      toast.success("You have been successfully logged out.");
      navigate("/");
      setLoggedIn(false);
    } catch (err) {
      console.log(err);
      toast.error("Could not log out. Please try again.");
    } finally {
      setBusy(false);
      setDialog(null);
    }
  };

  const deleteUser = async () => {
    setBusy(true);
    try {
      const deleteId = localStorage.getItem("userId");
      await axios.delete(`${API_BASE}/users/${deleteId}`);
      clearSession();
      toast.success("Your account has been successfully deleted.");
      navigate("/");
      setLoggedIn(false);
    } catch (err) {
      console.log(err);
      toast.error("Could not delete your account. Please try again.");
    } finally {
      setBusy(false);
      setDialog(null);
    }
  };

  const openDialog = (kind) => {
    setAccountOpen(false);
    setMenuOpen(false);
    setDialog(kind);
  };

  return (
    <>
      <header className={`sn-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="sn-nav__inner">
          <Brand to="/home" />

          <nav className="sn-nav__links" aria-label="Main">
            {LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className="sn-nav__link">
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="sn-nav-pill"
                        className="sn-nav__pill"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="sn-nav__label">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="sn-nav__actions">
            <Link to="/add-recipe" className="sn-btn sn-btn--primary sn-btn--sm sn-nav__cta">
              <FiPlus /> Share recipe
            </Link>

            <div className="sn-nav__account" ref={accountRef}>
              <button
                type="button"
                className="sn-nav__account-btn"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <Avatar name={name} size={34} />
                <span className="sn-nav__account-name">{name.split(" ")[0]}</span>
                <FiChevronDown className={`sn-nav__chevron ${accountOpen ? "is-open" : ""}`} />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    className="sn-nav__menu sn-card"
                    role="menu"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="sn-nav__menu-head">
                      <Avatar name={name} size={42} />
                      <div>
                        <strong>{name}</strong>
                        <span>Signed in</span>
                      </div>
                    </div>
                    <Link to="/profile" role="menuitem" className="sn-nav__menu-item">
                      <FiUser /> My profile
                    </Link>
                    <button type="button" role="menuitem" className="sn-nav__menu-item" onClick={() => openDialog("logout")}>
                      <FiLogOut /> Log out
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="sn-nav__menu-item sn-nav__menu-item--danger"
                      onClick={() => openDialog("delete")}
                    >
                      <FiTrash2 /> Deactivate account
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              className={`sn-burger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="sn-nav__mobile"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="sn-nav__mobile-inner"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              >
                {LINKS.map(({ to, label, icon: Icon }) => (
                  <motion.div key={to} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
                    <NavLink to={to} className="sn-nav__mobile-link">
                      <Icon /> {label}
                    </NavLink>
                  </motion.div>
                ))}
                <motion.div variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
                  <Link to="/add-recipe" className="sn-btn sn-btn--primary sn-btn--block">
                    <FiPlus /> Share a recipe
                  </Link>
                </motion.div>
                <motion.div
                  className="sn-nav__mobile-actions"
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                >
                  <button type="button" className="sn-btn sn-btn--ghost" onClick={() => openDialog("logout")}>
                    <FiLogOut /> Log out
                  </button>
                  <button type="button" className="sn-btn sn-btn--danger" onClick={() => openDialog("delete")}>
                    <FiTrash2 /> Deactivate
                  </button>
                </motion.div>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <ConfirmDialog
        open={dialog === "logout"}
        title="Log out?"
        message="You can sign back in any time to pick up where you left off."
        confirmLabel="Log out"
        busy={busy}
        onConfirm={handleLogout}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "delete"}
        tone="danger"
        title="Delete your account?"
        message="This permanently removes your account. It can't be undone."
        confirmLabel="Delete account"
        busy={busy}
        onConfirm={deleteUser}
        onCancel={() => setDialog(null)}
      />
    </>
  );
};

export default Navbar;
