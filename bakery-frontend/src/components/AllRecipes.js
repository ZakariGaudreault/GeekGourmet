import { useState } from "react";
import { ListRecipes } from "./ListRecipes";

/**
 * Gets all the recipes from the database
 * @returns a list of all the recipes object from the database
 */

function AllRecipes(){

    const[Recipe, setRecipe] = useState([]);


    const callGetAllRecipe = async () =>{
        const response = await fetch(process.env.REACT_APP_BACKEND + "/recipe/",{method: "GET"});
        const result = await response.json();
        setRecipe(result);
        return JSON.stringify(result);
    };


    return (
    <>
        <button  onClick={callGetAllRecipe}>Get All Recipes</button>
        <ListRecipes Recipe={Recipe}/>
    </>
    );
}
export{AllRecipes};