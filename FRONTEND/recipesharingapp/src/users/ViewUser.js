import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ViewUser() {
    const [user, setUser] = useState([]);
    const [recipe, setRecipe] = useState([]);
    const [rating, setRating] = useState([]);

    useEffect(() => {
        loadUser();
    }, []);

    let { id } = useParams();

    const loadUser = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/users/${id}`);
            setUser(result.data);
            setRecipe(result.data.recipes);
            setRating(result.data.ratings);
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">User Details</h2>

                    <div className="card">
                        <div className="card-header">
                            Details of: <b>{user.name}</b>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <b>User ID: </b>
                                    {user.id}
                                </li>
                                <li className="list-group-item">
                                    <b>User Name: </b>
                                    {user.name}
                                </li>
                                <li className="list-group-item">
                                    <b>Email ID: </b>
                                    {user.email}
                                </li>
                                <li className="list-group-item">
                                    <b>Recipes : </b><div className="py-4">
                                        <table className="table border shadow">
                                            <thead>
                                                <tr>
                                                    <th scope="col">RECIPE NAME</th>
                                                    <th scope="col">CREATED ON</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {console.log(user)}
                                                {recipe.map((item) => (
                                                    <tr>
                                                        <td>{item.name}</td>
                                                        <td>{item.createdAt}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <b>Ratings : </b><div className="py-4">
                                        <table className="table border shadow">
                                            <thead>
                                                <tr>
                                                    <th scope="col">RATED ON</th>
                                                    <th scope="col">RATING</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rating.map((item) => (
                                                    <tr>
                                                        <td>{item.recipe ? item.recipe.name : "Recipe removed"}</td>
                                                        <td>{item.rating}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </div>
                    <Link className="btn btn-primary my-2" to={"/home"}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}