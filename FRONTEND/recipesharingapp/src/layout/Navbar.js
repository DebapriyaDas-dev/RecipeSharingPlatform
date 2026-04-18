import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBurger, faTimes } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../App";

library.add(fab);

const Navbar = () => {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        const userId = localStorage.getItem("userId");
        setLoggedIn(false);
        await axios.post(`http://localhost:8080/users/logout/${userId}`);
        localStorage.removeItem("userId");
        localStorage.setItem("loggedIn", false);
        localStorage.removeItem("userName");
        window.alert("You have been successfully logged out.");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deleteUser = async () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to delete account?"
    );
    if (confirmLogout) {
      try {
        const deleteId = localStorage.getItem("userId");
        setLoggedIn(false);
        await axios.delete(`http://localhost:8080/users/${deleteId}`);
        localStorage.removeItem("userId");
        localStorage.setItem("loggedIn", false);
        localStorage.removeItem("userName");
        window.alert("Your account has been successfully deleted.");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-logo" to="/home">
          <FontAwesomeIcon
            icon={menuOpen ? faTimes : faBurger}
            size="lg"
            style={{
              color: "#ffa21f",
            }}
          />
          <span className="navbar-brand">Recipe App</span>
        </Link>
        <button
          className={`navbar-toggler ${menuOpen ? "collapsed" : ""}`}
          type="button"
          onClick={handleMenuToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/home"
                className={`nav-link ${
                  location.pathname === "/home" ? "active" : ""
                }`}
                style={{
                  color: location.pathname === "/home" ? "#ffa21f" : "#fff",
                  borderBottom:
                    location.pathname === "/home"
                      ? "2px solid #ffa21f"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#ffa21f";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color =
                    location.pathname === "/home" ? "#ffa21f" : "#fff";
                }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/recipes"
                className={`nav-link ${
                  location.pathname === "/recipes" ? "active" : ""
                }`}
                style={{
                  color: location.pathname === "/recipes" ? "#ffa21f" : "#fff",
                  borderBottom:
                    location.pathname === "/recipes"
                      ? "2px solid #ffa21f"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#ffa21f";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color =
                    location.pathname === "/recipes" ? "#ffa21f" : "#fff";
                }}
              >
                Recipes
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className={`nav-link ${
                  location.pathname === "/profile" ? "active" : ""
                }`}
                style={{
                  color: location.pathname === "/profile" ? "#ffa21f" : "#fff",
                  borderBottom:
                    location.pathname === "/profile"
                      ? "2px solid #ffa21f"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#ffa21f";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color =
                    location.pathname === "/profile" ? "#ffa21f" : "#fff";
                }}
              >
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={`nav-link ${
                  location.pathname === "/dashboard" ? "active" : ""
                }`}
                style={{
                  color:
                    location.pathname === "/dashboard" ? "#ffa21f" : "#fff",
                  borderBottom:
                    location.pathname === "/dashboard"
                      ? "2px solid #ffa21f"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#ffa21f";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color =
                    location.pathname === "/dashboard" ? "#ffa21f" : "#fff";
                }}
              >
                Users
              </Link>
            </li>
          </ul>
          <div className="navbar-actions">
            <button
              onClick={handleLogout}
              className="btn btn-outline-light"
              style={{ marginRight: "20px" }}
            >
              Logout
            </button>
            <button onClick={deleteUser} className="btn btn-outline-light">
              Deactivate
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
