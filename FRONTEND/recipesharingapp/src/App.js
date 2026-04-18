import "./App.css";
import UserTable from "./component/UserTable";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import ViewRecipes from "./recipes/ViewRecipes";
import Navbar from "./layout/Navbar";
import Login from "./users/Login";
import axios from "axios";
import NavbarN from "./layout/NavbarN";
import Homepage from "./pages/Homepage";
import Recipes from "./pages/Recipes";
import Profile from "./users/Profile";
import Test from "./Test";
import { createContext } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import AddRecipes from "./recipes/AddRecipes";
import EditRecipes from "./recipes/EditRecipes";
import Ratings from "./pages/Ratings";
import EditRating from "./ratings/EditRating";
export const AuthContext = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("loggedIn"))
  );
  console.log(loggedIn);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <div className="App">
        <Router>
          {loggedIn ? <Navbar /> : <NavbarN />}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/add-recipe" element={<AddRecipes />} />
            <Route path="/view-recipe/:id" element={<ViewRecipes />} />
            <Route path="/edit-recipe/:id" element={<EditRecipes />} />
            <Route path="/recipe-ratings/:id" element={<Ratings />} />
            <Route path="/edit-rating/:id" element={<EditRating />} />
            <Route path="/dashboard" element={<UserTable />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edituser/:id" element={<EditUser />} />
            <Route path="/viewuser/:id" element={<ViewUser />} />
            <Route path="/register" element={<AddUser />} />
          </Routes>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
