import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function UserTable() {

    const [recipes, setUSers] = useState([]);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        const result = await axios.get("http://localhost:8080/recipes/all-recipes");
        setUSers(result.data);
    };

    return (
        <div className="container">
            <h1>RECIPE DATA</h1>
            <div className="py-4">
                <table className="table border shadow">
                    <thead>
                        <tr>
                            <th scope="col">RECIPE ID</th>
                            <th scope="col">RECIPE NAME</th>
                            <th scope="col">CREATED ON</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipes.map((item) => (
                            <tr>
                                <th>{item.recipeId}</th>
                                <td>{item.name}</td>
                                <td>{item.createdAt}</td>
                            </tr>
                        ))};
                    </tbody>
                </table>
            </div>
        </div>


    );
}