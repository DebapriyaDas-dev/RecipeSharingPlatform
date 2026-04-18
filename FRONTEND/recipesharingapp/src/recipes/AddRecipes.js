import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faClock,
  faFileLines,
  faImage,
  faPlus,
  faUtensilSpoon,
  faUtensils,
  faWeightScale,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadPostImage } from "../service/PostService";
import defaultImage from "../recipe_images/default-image.jpg";
library.add(fab);

const AddRecipes = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [recipe, setRecipe] = useState({
    userId: localStorage.getItem("userId"),
    name: "",
    createdAt: "",
    recipeDescription: "",
    cookingTime: "",
    kiloCalories: "",
    ingredients: [{ name: "", quantity: "" }],
    fileName: "",
  });
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [submit, setSubmit] = useState(false);
  const [file, setFile] = useState({
    placeholder: defaultImage,
  });

  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDate(today);
    setRecipe((prevRecipe) => ({ ...prevRecipe, createdAt: formattedDate }));
  }, []);

  const handleChange = (e) => {
    setRecipe((recipe) => ({
      ...recipe,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (submit) {
      console.log(recipe);
      axios
        .post("http://localhost:8080/recipes/new-recipe", recipe)
        .then((response) => {
          //Handle success
          const id = response.data.recipeId;
          console.log(response.data);
          uploadPostImage(image, id)
            .then((data) => {
              toast.success("Image uploaded successfully!");
            })
            .catch((error) => {
              toast.error("Error in uploading image");
              console.log(error);
            });
          toast.success("Recipe posted successfully!");
          console.log(response.data);
          setTimeout(() => {
            navigate("/recipes");
          }, 2500);
        })
        .catch((error) => {
          // Handle error
          toast.error("Error in posting data!");
          console.error(error);
        });
    }
  }, [submit, recipe]);

  //Ingredients change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    // setRecipe({ ...recipe, ingredients: updatedIngredients });
    setRecipe((recipe) => {
      const updatedIngredients = [...recipe.ingredients];
      updatedIngredients[index][name] = value;
      console.log(updatedIngredients);
      return { ...recipe, ingredients: updatedIngredients };
    });
  };

  const handleTimeChange = (event) => {
    const { name, value } = event.target;
    setTime({ ...time, [name]: value });
  };

  const formatTime = (hours, minutes, seconds) => {
    const formattedHours = hours.toString().padStart(2, "0"); //1 -01
    const formattedMinutes = minutes.toString().padStart(2, "0"); //2 -02
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: "", quantity: "" }],
    });
  };

  const handleRemoveIngredient = (index) => {
    const ingredients = [...recipe.ingredients];
    ingredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients });
  };

  const handleFileChange = (e) => {
    const localFile = e.target.files[0];
    if (localFile.type == "image/png" || localFile.type == "image/jpeg") {
      //preview file
      const reader = new FileReader();
      reader.onload = (r) => {
        setFile({
          placeholder: r.target.result,
          file: localFile,
        });
      };
      reader.readAsDataURL(localFile);
      setImage(localFile);
      toast.success("Image uploaded!");
    } else {
      toast.error("INVALID FILE!");
      file.file = null;
    }
  };

  const handleSubmit = (e) => {
    const cookingTime = formatTime(time.hours, time.minutes, time.seconds);
    // setRecipe({ ...recipe, cookingTime });
    setRecipe((recipe) => {
      return { ...recipe, cookingTime };
    });
    console.log(recipe);
    setSubmit(true);
  };

  return (
    <div>
      {
        <Row className="justify-content-center mt-5">
          <Col xs={11} sm={10} md={8} lg={4} className="p-4 rounded bg-light">
            <h2 className="text-center border-bottom pb-3 text-primary">
              Create New Recipe
            </h2>
            <Form onSubmit={(e) => e.preventDefault()}>
              <InputGroup className="mb-4 mt-5">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Enter recipe name</Tooltip>}
                >
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faBurger} size="lg" />
                  </InputGroup.Text>
                </OverlayTrigger>
                <Form.Control
                  name="name"
                  type="text"
                  value={recipe.name || ""}
                  onChange={handleChange}
                  placeholder="Enter recipe name"
                  minLength={3}
                  required
                />
              </InputGroup>
              <InputGroup className="mb-4">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Enter description</Tooltip>}
                >
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faFileLines} size="lg" />
                  </InputGroup.Text>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="recipeDescription"
                  value={recipe.recipeDescription || ""}
                  onChange={handleChange}
                  placeholder="Enter short recipe description"
                  required
                />
              </InputGroup>
              <InputGroup className="mb-4">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Enter cooking time</Tooltip>}
                >
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faClock} size="lg" />
                  </InputGroup.Text>
                </OverlayTrigger>
                <Form.Label htmlFor="hours">Hours</Form.Label>
                <Form.Select
                  name="hours"
                  value={time.hours || "00"}
                  onChange={handleTimeChange}
                >
                  {[...Array(13)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Form.Select>
                <Form.Label htmlFor="minutes">Minutes</Form.Label>
                <Form.Select
                  name="minutes"
                  value={time.minutes || "00"}
                  onChange={handleTimeChange}
                  placeholder="Minutes"
                >
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Form.Select>
                <Form.Label htmlFor="seconds">Seconds</Form.Label>
                <Form.Select
                  name="seconds"
                  value={time.seconds || "00"}
                  onChange={handleTimeChange}
                  placeholder="Seconds"
                >
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
              <InputGroup className="mb-4">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Enter Kilocalories</Tooltip>}
                >
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faWeightScale} size="lg" />
                  </InputGroup.Text>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="kiloCalories"
                  value={recipe.kiloCalories || ""}
                  onChange={handleChange}
                  placeholder="Enter kilocalories"
                  required
                />
                <Form.Control name="kcal" type="number" placeholder="Kcal" />
              </InputGroup>
              <InputGroup className="mb-4">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Enter Ingredients</Tooltip>}
                >
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faUtensils} size="lg" />
                  </InputGroup.Text>
                </OverlayTrigger>
                <Form.Label>Enter Ingredients</Form.Label>
                {recipe.ingredients.map((ingredient, index) => (
                  <Row key={index}>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="name"
                        value={ingredient.name}
                        placeholder="Enter name"
                        onChange={(e) => handleInputChange(e, index)}
                        required
                        style={{ marginLeft: "-12px" }}
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="text"
                        name="quantity"
                        placeholder="quantity"
                        value={ingredient.quantity}
                        onChange={(e) => handleInputChange(e, index)}
                        required
                        style={{ marginLeft: "-30px" }}
                      />
                    </Col>
                    <Col md={1}>
                      {index === recipe.ingredients.length - 1 && (
                        <FontAwesomeIcon
                          icon={faPlus}
                          size="2xl"
                          variant="link"
                          onClick={handleAddIngredient}
                          style={{ marginLeft: "-50px", marginTop: "1px" }}
                        />
                      )}
                      {index !== recipe.ingredients.length - 1 && (
                        <FontAwesomeIcon
                          icon={faXmark}
                          size="2xl"
                          variant="link"
                          onClick={() => handleRemoveIngredient(index)}
                          style={{ marginLeft: "-50px", marginTop: "1px" }}
                        />
                      )}
                    </Col>
                  </Row>
                ))}
              </InputGroup>
              {/* <InputGroup className="mb-4">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Upload image</Tooltip>}
                >
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faImage} size="lg" />
                  </InputGroup.Text>
                </OverlayTrigger>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </InputGroup> */}
              <InputGroup className="mb-4">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Image uploaded</Tooltip>}
                >
                  <img src={file.placeholder} style={{width:"100%"}}/>
                </OverlayTrigger>
                <Container className="text-center">
                  <p className="mt-2 text-muted">Image Preview</p>
                </Container>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </InputGroup>
              <button
                className="btn btn-outline-primary btn-xl submit-button"
                variant="light"
                type="submit"
                onClick={handleSubmit}
              >
                Add Recipe
              </button>
              <Link
                className="btn btn-outline-danger btn-xl"
                to="/recipes"
                style={{ width: "100px" }}
              >
                Cancel
              </Link>
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

export default AddRecipes;

{
  /* <TimePicker
                id="cookingTime"
                name="cookingTime"
                value={recipe.cookingTime}
                onChange={handleTimeChange}
                format="HH:mm:ss"
                clearIcon={null}
                clockIcon={null}
                style={{ height: "40px" }}
              /> */
}
