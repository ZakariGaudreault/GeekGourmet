import { useState} from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

/**
 * Displays the form for updating a recipe
 * 
 * @param {*} props function for keeping track of the updated recipe
 * @returns Element that contains the update form
 */
function UpdateRecipeForm(props){
    const [title, setTitle] = useState(props.recipe.title);
    const [newTitle, setNewTitle] = useState(props.recipe.title);
    const [newType, setNewType] = useState(props.recipe.type);
    const [newIngredients, setNewIngredient] = useState(props.recipe.ingredients);
    const [newServings, setNewServings] = useState(props.recipe.servings);
    const [newInstructions, setNewInstructions] = useState(props.recipe.instructions);
    const navigate = useNavigate();
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "PUT",
            credentials : "include",
            body: JSON.stringify({
                newTitle:newTitle, 
                newIngredients:newIngredients, 
                newType:newType,
                newServings:newServings, 
                newInstructions:newInstructions}),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
        }

        const response = await fetch (process.env.REACT_APP_BACKEND + "/recipe/" + title, requestOptions)
        const result = await response.json();
        if(response.status === 400){
            alert(result.errorMessage);
        }
        else if (response.status === 500){
            alert(result.errorMessage);
        }
        else{
            navigate("/recipe", {state:{recipe: result, fromSearch: false}})
        }
    }

    return(
        <div className="center">
        <h1>Update a Recipe</h1>
        <h3>Provide username and title to update a recipe. You can update one or more information.</h3>
        <form onSubmit={handleSubmit} className="recipeForm">
    
        <label htmlFor="New Title" column sm="2">New Title</label>
        <input value={newTitle} type="text" placeholder="New Title..." onChange={(e) => setNewTitle(e.target.value)}></input>
        
        <p/>

        <label htmlFor="New Type" column sm="2">New Type</label>
        <input value={newType} type="text" placeholder="New Type..." onChange={(e) => setNewType(e.target.value)}></input>
        
        <p/>
    
        <label htmlFor="New Ingredients" column sm="2">New Ingredients</label>
        <textarea value={newIngredients} as="textarea" rows={3} type="text" placeholder="New Ingredients..." onChange={(e) => setNewIngredient(e.target.value)}></textarea>

        <p/>
    
        <label htmlFor="New Number of servings" column sm="2">New Number of Servings</label>
        <input value={newServings} type="text" placeholder="New Servings..." onChange={(e) => setNewServings(e.target.value)}></input>
        
        <p/>
    
        <label htmlFor="New Instructions" column sm="2">New Instructions</label>
        <textarea value={newInstructions} as="textarea" rows={3} type="text" placeholder="New Instructions..." onChange={(e) => setNewInstructions(e.target.value)}></textarea>
        
        <p/>

        {title && (newTitle || newIngredients || newServings || newInstructions) && <button type="submit">Update Recipe</button>}
        </form> 
        </div>   
    );
}

export {UpdateRecipeForm};