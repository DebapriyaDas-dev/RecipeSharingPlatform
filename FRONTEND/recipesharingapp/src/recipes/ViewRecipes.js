import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useParams } from "react-router-dom";


const ViewRecipePage = () => {
  const [recipe, setRecipe] = useState({
    ingredients: [],
  });
  const [user, setUser] = useState([]);

  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    fetchRecipe();
  }, []);

  let { id } = useParams();

  const fetchRecipe = async () => {
    console.log(id);
    try {
      const response = await axios.get(`http://localhost:8080/recipes/${id}`);
      setRecipe(response.data);
      {
        const parts = response.data.cookingTime.split(":");
        const hours = parts[0];
        const minutes = parts[1];
        const seconds = parts[2];
        setTime({
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        });
      }
      const userresponse = await axios.get(
        `http://localhost:8080/users/${response.data.userId}`
      );
      setUser(userresponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container className="justify-content-center align-items-center">
      <div
        className="mb-4"
        style={{
          marginTop:"15px",
          width: "400px",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>{recipe.name}</Tooltip>}
        >
          <img
            src={`http://localhost:8080/recipes/image/${recipe.fileName}`}
            alt={recipe.fileName}
            style={{
              objectFit: "cover",
              width: "200px",
              height: "200px",
              borderRadius: "60%",
            }}
          />
        </OverlayTrigger>
        <h1
          style={{
            marginTop: "50px",
            fontSize: "5rem",
            fontWeight: "bold",
            whiteSpace: "nowrap", //  // Add this to show ellipsis for overflowed text
          }}
        >
          {recipe.name}
        </h1>
      </div>
      <div className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title style={{fontSize:"1.5em" ,backgroundColor:"#FDD35D"}}>Recipe Name</Card.Title>
            <Card.Footer style={{backgroundColor:"#D7E1CC"}}>{recipe.name}</Card.Footer>
          </Card.Body>
        </Card>
      </div>
      <div className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title style={{fontSize:"1.5em" ,backgroundColor:"#FDD35D"}}>Created By</Card.Title>
            <Card.Footer style={{backgroundColor:"#D7E1CC"}}>{user.name}</Card.Footer>
          </Card.Body>
        </Card>
      </div>

      <div className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title style={{fontSize:"1.5em" ,backgroundColor:"#FDD35D"}}>Recipe Description</Card.Title>
            <Card.Footer style={{backgroundColor:"#D7E1CC"}}>{recipe.recipeDescription}</Card.Footer>
          </Card.Body>
        </Card>
      </div>

      <div className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title style={{fontSize:"1.5em" ,backgroundColor:"#FDD35D"}}>Cooking Time</Card.Title>
            <Card.Footer  style={{justifyContent:"center",display:"flex", backgroundColor:"#D7E1CC"}}>
            {time.hours !== "00" && <Card.Text>{time.hours} hours &nbsp;</Card.Text>}

            {time.minutes !== "00" && (
              <Card.Text>{time.minutes} minutes &nbsp;</Card.Text>
            )}

            {time.seconds !== "00" && (
              <Card.Text>{time.seconds} seconds</Card.Text>
            )}
            </Card.Footer>
          </Card.Body>
        </Card>
      </div>

      <div className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title style={{fontSize:"1.5em", backgroundColor:"#FDD35D"}}>Kilocalories</Card.Title>
            <Card.Footer style={{backgroundColor:"#D7E1CC"}}>{recipe.kiloCalories}</Card.Footer>
          </Card.Body>
        </Card>
      </div>

      <div className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title style={{fontSize:"1.5em" ,backgroundColor:"#FDD35D"}}>Created On</Card.Title>
            <Card.Footer style={{backgroundColor:"#D7E1CC"}}>{recipe.createdAt}</Card.Footer>
          </Card.Body>
        </Card>
      </div>

      <div className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title style={{fontSize:"1.5em" ,backgroundColor:"#FDD35D"}}>Ingredients</Card.Title>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ingredient) => (
                  <tr key={ingredient.id}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ViewRecipePage;
