import React, { useContext, useState } from "react";
import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { VscKey } from "react-icons/vsc";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../App";
import "./Login.css";
const Login = () => {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleChange = (e) => {
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
    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        user
      );
      const data = response.data;
      console.log(data);
      if (data.loggedIn) {
        setLoginError(false);
        setUserIdentity(data.id, data.name, data.loggedIn);
        setLoggedIn(data.loggedIn);
        toast.success("Welcome " + data.name);
        setTimeout(() => {
          navigate("/home");
        }, 2500);
      }
    } catch (err) {
      setLoginError(true);
      console.log(err);
    }
  };

  return (
    <div>
      {
        <Row className="justify-content-center mt-5">
          <Col xs={11} sm={10} md={8} lg={4} className="p-4 rounded">
            <h1 className="text-center border-bottom pb-3 sign-in">
              Sign In
            </h1>
            <Form onSubmit={(e) => e.preventDefault()}>
              <InputGroup className="mb-4 mt-5">
                <InputGroup.Text>
                  <AiOutlineMail size="1.8rem" />
                </InputGroup.Text>
                <Form.Control
                  name="email"
                  type="email"
                  value={user.email || ""}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </InputGroup>

              <InputGroup className="mb-4">
                <InputGroup.Text>
                  <VscKey size="1.8rem" />
                </InputGroup.Text>
                <Form.Control
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={user.password || ""}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  minLength={6}
                  required
                />
                <button
                  variant="light"
                  onClick={handleTogglePassword}
                  className="border-0 bg-transparent"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </InputGroup>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-lg mb-2 btn-outline-secondary"
                style={{ width: "250px", borderColor:"#a17512", color:"#a17512" }}
              >
                Login
              </button>
              <p className="text-center mt-3">
                New to our Platform?{" "}
                <Link to="/register" style={{color:"#a17512"}}>
                  Register now
                </Link>
              </p>
              {loginError && (
                <p className="text-danger mt-3">Invalid email or password.</p>
              )}
            </Form>
          </Col>
        </Row>
      }
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
        theme="light"
      />
    </div>
  );
};

export default Login;
