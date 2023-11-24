import { useState } from "react"
import { ListRecipesForAdditionInBook } from "./ListRecipesForAdditionInBook";

/**
 * Formats the add recipe to book form
 * @param {*} param0 book
 * @returns Add recipe to book form
 */
function UpdateBookRecipeAddition({book}){
    const [recipes, setRecipes] = useState([]);

    const getAllRecipes = async()=>{
        const requestOptions = {
            method: "GET",
            credentials : "include",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }
    
        const response = await fetch (process.env.REACT_APP_BACKEND + "/recipe/user", requestOptions);
        const result = await response.json();
        setRecipes(result);
    }

    return(
        <div className="center">
            <h1>Add Recipe to Book {book.name}</h1>
            <button onClick={getAllRecipes}>View All recipes</button>
            {recipes[0] && <ListRecipesForAdditionInBook book={book} recipes={recipes}/>}
        </div>
    );
}

export {UpdateBookRecipeAddition}