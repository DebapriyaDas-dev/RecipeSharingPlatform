import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faComment } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Ratings = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    const newRating = {
      userId: userId,
      recipeId: id,
      rating: rating,
      comment: comment,
    };

    try {
      await axios.post("http://localhost:8080/ratings/new-rating", newRating);
      toast.success("Rating submitted successfully!");
      setTimeout(() => {
        navigate("/recipes");
      }, 2500);
    } catch (error) {
      toast.error("Error submitting rating. Please try again.");
    }
  };

  const renderStarOptions = () => {
    const starOptions = [];

    for (let i = 1; i <= 10; i++) {
      starOptions.push(
        <option key={i} value={i}>
          {i} {i === 1 ? "star" : "stars"}
        </option>
      );
    }

    return starOptions;
  };

  return (
    <div>
      <Row className="justify-content-center mt-5">
        <Col xs={11} sm={10} md={8} lg={4} className="p-4 rounded bg-light">
          <h2 className="text-center border-bottom pb-3 text-primary">
            Add Rating & Comment
          </h2>
          <Form>
            <InputGroup className="mb-4 mt-5">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Select rating</Tooltip>}
              >
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faStar} size="lg" />
                </InputGroup.Text>
              </OverlayTrigger>
              <Form.Control
                as="select"
                value={rating}
                onChange={(e) => handleRatingChange(e.target.value)}
              >
                <option value={0}>Select rating</option>
                {renderStarOptions()}
              </Form.Control>
            </InputGroup>
            <InputGroup className="mb-4">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Add comment</Tooltip>}
              >
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faComment} size="lg" />
                </InputGroup.Text>
              </OverlayTrigger>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={handleCommentChange}
                placeholder="Enter your comment"
              />
            </InputGroup>
            <Button className="me-3" variant="primary" onClick={handleSubmit}>
              Submit Rating
            </Button>
            <Link className="btn btn-danger" to="/recipes">
              Cancel
            </Link>
          </Form>
        </Col>
      </Row>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Ratings;
