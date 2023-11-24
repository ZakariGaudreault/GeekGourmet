import { useEffect,useState } from "react";
import { ListRecipesFromSearch } from "./ListRecipesFromSearch";

/**
 * Displays dinner recipes from Ninja API
 * 
 * @returns A list of recipes
 */
function GetAllDinnerRecipes(){
    const[recipe, setRecipe] = useState([]);
    useEffect(()=> {
        GetAllDinnerRecipesControl(setRecipe)

    },[recipe])
    return(
        <div className="center">
            <h1>Dinner Recipes</h1>
            {recipe[0] && <ListRecipesFromSearch recipes={recipe}/>}
        </div>
    );
}
async function GetAllDinnerRecipesControl(setRecipe){
    const requestOptions = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "X-Api-Key" : "9tMQWPbv5v9Bs46FPlhgOw==Fq96b3KRP2L1EGdG"
        },
    }

    const response = await fetch("https://api.api-ninjas.com/v1/recipe?query=dinner", requestOptions);
    const result = await response.json();
    setRecipe(result);


}

export {GetAllDinnerRecipes};