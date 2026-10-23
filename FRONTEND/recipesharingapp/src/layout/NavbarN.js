import React from "react";
import { NavLink } from "react-router-dom";
import { Brand } from "./Navbar";
import "./Navbar.css";

// Navbar shown to signed-out visitors
const NavbarN = () => {
  return (
    <header className="sn-nav sn-nav--guest">
      <div className="sn-nav__inner">
        <Brand to="/" />
        <nav className="sn-nav__guest-links" aria-label="Account">
          <NavLink to="/" end className="sn-btn sn-btn--ghost sn-btn--sm">
            Sign in
          </NavLink>
          <NavLink to="/register" className="sn-btn sn-btn--primary sn-btn--sm">
            Create account
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default NavbarN;
