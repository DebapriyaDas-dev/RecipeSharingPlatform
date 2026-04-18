import React from "react";
import "./NavbarN.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./Navbar.css";
library.add(fab);

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
      {/* <div className="navbar-logo">
        <i className="bi bi-egg-fried" style={{color:"white"}}></i>
        <span className="navbar-brand">Recipe App</span>
      </div> */}
      <div className="navbar-center">
        <FontAwesomeIcon icon={faPizzaSlice} size="2xl" style={{ color: "#faab00", marginRight:"10px" }} />
        <h4 style={{ color: "white" }}>Welcome to Recipe Sharing Platform!</h4>
      </div>
    </nav>
  );
};

export default Navbar;
