import "./App.css";
import UserTable from "./component/UserTable";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import ViewRecipes from "./recipes/ViewRecipes";
import Navbar from "./layout/Navbar";
import Login from "./users/Login";
import NavbarN from "./layout/NavbarN";
import Homepage from "./pages/Homepage";
import Recipes from "./pages/Recipes";
import Profile from "./users/Profile";
import AddRecipes from "./recipes/AddRecipes";
import EditRecipes from "./recipes/EditRecipes";
import Ratings from "./pages/Ratings";
import EditRating from "./ratings/EditRating";
import { Ambient, Page } from "./ui/Primitives";
import { StarDefs } from "./ui/StarRating";
export const AuthContext = createContext();

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const page = (element) => <Page>{element}</Page>;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={page(<Login />)} />
        <Route path="/home" element={page(<Homepage />)} />
        <Route path="/recipes" element={page(<Recipes />)} />
        <Route path="/add-recipe" element={page(<AddRecipes />)} />
        <Route path="/view-recipe/:id" element={page(<ViewRecipes />)} />
        <Route path="/edit-recipe/:id" element={page(<EditRecipes />)} />
        <Route path="/recipe-ratings/:id" element={page(<Ratings />)} />
        <Route path="/edit-rating/:id" element={page(<EditRating />)} />
        <Route path="/dashboard" element={page(<UserTable />)} />
        <Route path="/profile" element={page(<Profile />)} />
        <Route path="/edituser/:id" element={page(<EditUser />)} />
        <Route path="/viewuser/:id" element={page(<ViewUser />)} />
        <Route path="/register" element={page(<AddUser />)} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // localStorage stores strings, so a logged-out user has "false" here
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [userName, setUserName] = useState(null);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userName, setUserName }}>
      <MotionConfig reducedMotion="user">
        <div className="App">
          <Ambient />
          <StarDefs />
          <Router>
            {loggedIn ? <Navbar /> : <NavbarN />}
            <main>
              <AnimatedRoutes />
            </main>
          </Router>
          <ToastContainer
            position="bottom-right"
            autoClose={3500}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </MotionConfig>
    </AuthContext.Provider>
  );
}

export default App;
