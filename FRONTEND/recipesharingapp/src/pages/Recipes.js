import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container, Row, Col, Card, Button, Form, OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faExpand, faPenToSquare, faRectangleXmark, faStar as solidStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "./Recipes.css";
const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("userId");

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleRecipeClick = (recipeId) => {
    setSelectedRecipe(recipeId);
  };

  const handleClosePopup = () => {
    setSelectedRecipe(null);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    axios
      .get("http://localhost:8080/recipes/all-recipes")
      .then((response) => {
        console.log(response.data);
        setRecipes(response.data);
        axios
          .get("http://localhost:8080/ratings/all-ratings")
          .then((ratingResponses) => {
            console.log(ratingResponses.data);
            setRatings(ratingResponses.data);
          })
          .catch((error) => {
            console.log(error);
          });
        axios
          .get("http://localhost:8080/users")
          .then((userResponses) => {
            console.log(userResponses.data);
            setUsers(userResponses.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteRecipe = (id) => {
    axios
      .delete(`http://localhost:8080/recipes/${id}`)
      .then((response) => {
        toast.success("Recipe Deleted successfully!");
        setRecipes(recipes.filter((recipe) => recipe.recipeId !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteRating = (id) => {
    axios
      .delete(`http://localhost:8080/ratings/${id}`)
      .then((response) => {
        toast.success("Rating Deleted successfully!");
        setRatings(ratings.filter((rating) => rating.ratingId !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const generateRatingStars = (ratingValue) => {
    const stars = [];
    const solidStarCount = Math.floor(ratingValue);
    const remainingStars = 10 - solidStarCount;

    for (let i = 1; i <= solidStarCount; i++) {
      stars.push(
        <FontAwesomeIcon icon={solidStar} key={i} style={{ color: "gold" }} />
      );
    }

    for (let i = 1; i <= remainingStars; i++) {
      stars.push(
        <FontAwesomeIcon
          icon={regularStar}
          key={i + solidStarCount}
          style={{ color: "gray" }}
        />
      );
    }

    return stars;
  };

  const searchRecipe = (e) => {
    e.preventDefault()
    let search = e.target.value;
    if (search.length > 0) {
      const da = recipes.filter((val) => val.name.toLowerCase().includes(search.toLowerCase()) || val.recipeDescription.toLowerCase().includes(search.toLowerCase()))
      setRecipes(da)
    } else {
      fetchRecipes()
    }
  }

  return (
    <div>
      {
        <Container>
          <Row>
            <Col md={12}>

              <Form className="mt-4">
                <Form.Group className="mb-3" controlId="formBasicEmail">

                  <Form.Control type="text" placeholder="Search..." onChange={searchRecipe} />

                </Form.Group>



              </Form>

              <Link to="/add-recipe" className="btn btn-primary mb-3">
                Post New Recipe
              </Link>
            </Col>
          </Row>
          <Row >
            {recipes.map((recipe, index) => {
              const recipeRatings = ratings.filter(
                (rating) => rating.recipeId === recipe.recipeId
              );
              const totalRatings = recipeRatings.length;
              const totalRatingValue = recipeRatings.reduce(
                (sum, rating) => sum + rating.rating,
                0
              );
              const averageRating =
                totalRatings > 0 ? totalRatingValue / totalRatings : 0;

              return (
                <Col md={4} key={index} className="mb-4">
                  <Card style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8080/recipes/image/${recipe.fileName}`}
                      alt="Image"
                      style={{
                        height: "450px",
                        width: "100%",
                      }}
                    />
                    <Card.Body>
                      <Card.Header style={{backgroundColor:"#FDD35D"}}>
                        <b>{recipe.name}</b>
                      </Card.Header>
                      {/* <Card.Img src={(`../public/recipe_images/${recipe.image}`)} alt="Recipe Image" /> */}
                      <Card.Text>{recipe.recipeDescription}</Card.Text>
                      <Card.Link>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip>View recipe</Tooltip>}
                        >
                          <Link
                            to={`/view-recipe/${recipe.recipeId}`}
                            alt="View Recipe"
                          >
                            <div className="edit-ratings-icon">
                              <FontAwesomeIcon icon={faExpand} size="xl" style={{ color: "#00992e", }} />
                            </div>
                          </Link>
                        </OverlayTrigger>

                        {recipe.userId === loggedInUserId && (
                          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                            {/* <Button
                              className="btn btn-danger mx-2 transparent-button"
                              onClick={() => deleteRecipe(recipe.recipeId)}
                            >
                              Delete Recipe
                            </Button>

                            <Link
                              className="btn btn-primary mx-2 transparent-button"
                              to={"/edit-recipe/" + recipe.recipeId}
                            >
                              Edit Recipe
                            </Link> */}
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Edit recipe</Tooltip>}
                            >
                              <Link
                                className="mx-2"
                                to={
                                  "/edit-recipe/" + recipe.recipeId
                                }
                              >
                                <div className="edit-ratings-icon">
                                  <FontAwesomeIcon icon={faPenToSquare} size="xl" />
                                </div>
                              </Link>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Delete recipe</Tooltip>}
                            >
                              <Link
                                className="mx-2"
                                onClick={() => deleteRecipe(recipe.recipeId)}
                              >
                                <div className="delete-ratings-icon">
                                  <FontAwesomeIcon icon={faDeleteLeft} size="xl" />
                                </div>
                              </Link>
                            </OverlayTrigger>
                          </div>
                        )}
                      </Card.Link>
                    </Card.Body>
                    <Card.Footer>
                      {averageRating !== 0 && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {generateRatingStars(averageRating)}
                        </div>
                      )}
                      {/*                       
                      <div>
                        {recipeRatings.map((rating, index) => (
                          <div key={index}>
                            <p>Rating: {generateRatingStars(rating.rating)}</p>
                            <p>Comment: {rating.comment}</p>
                          </div>
                        ))}
                      </div> */}

                      <Button
                        className="btn btn-primary transparent-button"
                        // to={"/recipe-ratings/" + recipe.recipeId}
                        style={{ marginTop: "10px" }}
                        onClick={() => handleRecipeClick(recipe.recipeId)}
                      >
                        Ratings
                      </Button>
                    </Card.Footer>
                  </Card>
                  {selectedRecipe === recipe.recipeId && (
                    <Card className="recipe-popup" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>

                      <Card.Body style={{ backgroundColor: "#f2f2f2" }}>
                        <Card.Header>
                          <div className="close-icon" onClick={handleClosePopup}>
                            <FontAwesomeIcon icon={faRectangleXmark} size="xl" />
                          </div>
                          <b>Recipe Ratings</b>
                        </Card.Header>
                        {ratings
                          .filter(
                            (rating) => rating.recipeId === recipe.recipeId
                          )
                          .map((rating, index) => (
                            <Card.Text
                              key={index}
                              style={{
                                backgroundColor: "#ffff",
                                margin: "10px 0",
                                textAlign: "left",
                              }}
                            >
                              {users
                                .filter((user) => user.id === rating.userId)
                                .map((user, index) => (
                                  <Card key={index}>
                                    <Card.Header
                                      style={{ textAlign: "center" }}
                                    >
                                      <p>
                                        {user.id === loggedInUserId && (
                                          <b>You commented</b>
                                        )}
                                        {user.id !== loggedInUserId && (
                                          <b>{user.name}</b>
                                        )}

                                      </p>
                                    </Card.Header>
                                    <Card.Text
                                      style={{
                                        backgroundColor: "#ffff",
                                        margin: "10px 0",
                                        textAlign: "center",
                                      }}
                                    >
                                      <p>
                                        <b> Rating: </b>
                                        {generateRatingStars(rating.rating)}
                                      </p>
                                      <p>
                                        <b>Comment:</b> {rating.comment}
                                      </p>

                                      {user.id === loggedInUserId && (
                                        <Card.Link style={{ display: "flex", justifyContent: "center" }}>
                                          <Link
                                            className="mx-2"
                                            to={
                                              "/edit-rating/" + rating.ratingId
                                            }
                                          >
                                            <div className="edit-ratings-icon">
                                              <FontAwesomeIcon icon={faPenToSquare} size="xl" />
                                            </div>
                                          </Link>
                                          <Link
                                            className="mx-2"
                                            onClick={() => deleteRating(rating.ratingId)}
                                          >
                                            <div className="delete-ratings-icon">
                                              <FontAwesomeIcon icon={faDeleteLeft} size="xl" />
                                            </div>
                                          </Link>
                                        </Card.Link>
                                      )}
                                    </Card.Text>
                                  </Card>
                                ))}
                            </Card.Text>
                          ))}
                      </Card.Body>
                      <Card.Link>
                        <Link
                          className="btn btn-primary mx-2"
                          to={"/recipe-ratings/" + recipe.recipeId}
                        >
                          Add Rating
                        </Link>
                      </Card.Link>
                    </Card>
                  )
                  }
                </Col>
              );
            })}
          </Row>
        </Container>
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
    </div >
  );
};

export default Recipes;

// const fetchImage = (image) => {
//   let imageFile = "";
//   axios
//     .get(`http://localhost:8080/recipes/image/${image}`, {
//       responseType: "blob",
//     })
//     .then((response) => {
//       if (response.status === 200) {
//         imageFile = response.config.url;
//         console.log(imageFile);
//         return imageFile;
//       } else {
//         console.error("Failed to fetch recipe image");
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

//http://localhost:8080/recipes/image/{recipe.image}
// const fetchImages = () => {
//   try {
//     const response = axios.get(
//       `http://localhost:8080/recipes/image/${image}`,
//       {
//         responseType: "blob",
//       }
//     );
//     if (response.status === 200) {
//       const imageURL = URL.createObjectURL(response.data);
//       setImage(imageURL);
//     } else {
//       console.error("Failed to fetch recipe image");
//     }
//   } catch (error) {
//     console.error("Error while fetching recipe image:", error);
//   }
// };
// const generateRatingStars = (rating) => {
//   const roundedRating = Math.round(rating);
//   const stars = [];

//   for (let i = 1; i <= 10; i++) {
//     const starClassName =
//       i <= roundedRating ? "fa-regular fa star" : "fa-solid fa-star";
//     stars.push(<span className={starClassName} key={i}></span>);
//   }

//   console.log(stars.length)
//   return stars;
// };
