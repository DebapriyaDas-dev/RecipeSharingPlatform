import axios from "axios";
import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import {
    AiOutlineUser,
    AiOutlineMail,
    AiOutlineEye,
    AiOutlineEyeInvisible,
} from "react-icons/ai";
import { VscKey } from "react-icons/vsc";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
    let navigate = useNavigate();

    let { id } = useParams();

    const [user, setUser] = useState({
        name: "",
        password: "",
        email: "",
    });

    // const { name, email, password } = user;

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    
    const loadUser = async () => {
        const result = await axios.get(`http://localhost:8080/users/${id}`);
        setUser(result.data);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.put(`http://localhost:8080/users/update-user/${id}`, user);
            setUser(result.data);
        } catch (err) {
            console.log(err);
        }
        navigate("/home");
    };


    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="container">
            <Row className="justify-content-center mt-5">
                <Col xs={11} sm={10} md={8} lg={4} className="p-4 rounded bg-light">
                    <h1 className="text-center border-bottom pb-3 text-primary">
                        Edit User :
                    </h1>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-4 mt-5">
                            <InputGroup.Text>
                                <AiOutlineUser size="1.8rem" />
                            </InputGroup.Text>
                            <Form.Control
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your name"
                                minLength={3}
                                name="name"
                                value={user.name || ''}
                                required
                                onChange={(e) => onInputChange(e)}
                            />
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <AiOutlineMail size="1.8rem" />
                            </InputGroup.Text>
                            <Form.Control
                                type={"email"}
                                className="form-control"
                                placeholder="Enter your email id"
                                name="email"
                                value={user.email || ''}
                                required
                                onChange={(e) => onInputChange(e)}
                            />
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <VscKey size="1.8rem" />
                            </InputGroup.Text>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Enter your password"
                                name="password"
                                minLength={6}
                                required
                                value={user.password || ''}
                                onChange={(e) => onInputChange(e)}
                            />
                            <Button
                                variant="light"
                                onClick={handleTogglePassword}
                                className="border-0 bg-transparent"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </Button>
                        </InputGroup>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/home">
                            Cancel
                        </Link>
                    </Form>
                </Col>
        </Row >
    </div >
  );
}