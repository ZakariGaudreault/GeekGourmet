import { useLocation } from "react-router-dom"
import { ListRecipeObjects } from "components/ListRecipeObjects"
import { useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * Displays information about selected recipe book
 * 
 * @returns Information about the selected recipe book
 */
function RecipeBook(){
    const {state} = useLocation();
    const [recipes, setRecipes] = useState([]);

    const callGetRecipes = async() => {
        let recipesData =[];

        const requestOptions = {
            method: "GET",
            credentials: "include", 
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }

        for(let count = 0; count < state.book.SavedRecipes.length; count++) {
            const response = await fetch (process.env.REACT_APP_BACKEND + "/recipe/user/id/" + state.book.SavedRecipes[count], requestOptions);
            const result = await response.json();
            if(result.title != null)
                recipesData.push(result);
        }

        setRecipes(recipesData);
    }
    
    return(
        <div className="center">
            {state.book && <h1>Recipes from {state.book.name}</h1>}
            <NavLink to="/book/addition" state={{book:state.book}}><button>Add Recipes</button></NavLink>
            <p></p>
            <button onClick={callGetRecipes}>Get Recipes</button>
            {recipes[0] && state.book && <ListRecipeObjects recipes={recipes} name={state.book.name} book={state.book}/>}
        </div>
    )
}

export {RecipeBook}