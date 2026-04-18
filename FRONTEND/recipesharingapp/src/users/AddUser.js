import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, InputGroup, Alert } from "react-bootstrap";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { VscKey } from "react-icons/vsc";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AddUser.css";

const AddUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    password: "",
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const validatePassword = () => {
      const passwordRegex = /^(?=.*[0-9])(?=.*[@#$%^&+=])(?=\S+$).*$/;
      if (user.password.length === 0) {
        setPasswordError("");
      } else if (user.password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else if (!passwordRegex.test(user.password)) {
        setPasswordError(
          "Password must contain at least one digit and one special character"
        );
      } else {
        setPasswordError("");
      }
    };

    validatePassword();
  }, [user.password]);

  useEffect(() => {
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (user.email.length === 0) {
        setEmailError("");
      } else if (!emailRegex.test(user.email)) {
        setEmailError("Invalid email address");
      } else {
        setEmailError("");
      }
    };

    validateEmail();
  }, [user.email]);

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const result = await axios.get("http://localhost:8080/users");
  //       setUserExists(
  //         result.data.some((existingUser) => existingUser.email === user.email)
  //       );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   loadUser();
  // }, [user.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userExists) {
        alert(
          "User already exists with the provided email. Please Log in to the application."
        );
      } else {
        await axios.post("http://localhost:8080/users/register", user);
        alert("Registration successful. Please log in " + user.name);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Row className="justify-content-center mt-5">
        <Col xs={11} sm={10} md={8} lg={4} className="p-4 rounded bg-light">
          <h1 className="text-center border-bottom pb-3 text-primary">
            Sign Up
          </h1>
          <Form onSubmit={e=>e.preventDefault()}>
            <InputGroup className="mb-4 mt-5">
              <InputGroup.Text>
                <AiOutlineUser size="1.8rem" />
              </InputGroup.Text>
              <Form.Control
                name="name"
                type="text"
                value={user.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                minLength={3}
                required
              />
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroup.Text>
                <AiOutlineMail size="1.8rem" />
              </InputGroup.Text>
              <Form.Control
                name="email"
                type="email"
                value={user.email || ""}
                onChange={handleChange}
                placeholder="Enter your email-id"
                required
              />
            </InputGroup>
            {emailError && <div className="alert-style">{emailError}</div>}
            <InputGroup className="mb-4">
              <InputGroup.Text>
                <VscKey size="1.8rem" />
              </InputGroup.Text>
              <Form.Control
                name="password"
                className="form-control"
                type={showPassword ? "text" : "password"}
                value={user.password || ""}
                onChange={handleChange}
                placeholder="Enter your password"
                minLength={8}
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
            {passwordError && (
              <div className="alert-style">{passwordError}</div>
            )}
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-outline-primary btn-lg mt-2 submit-button"
              style={{ width: "100px" }}
            >
              Submit
            </button>
            <Link className="btn btn-outline-danger btn-lg mt-2" to="/" style={{ width: "100px" }}>
              Cancel
            </Link>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default AddUser;
