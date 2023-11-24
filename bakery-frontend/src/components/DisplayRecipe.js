import { Card } from "./Card";

/**
 * Displays the formatted recipe card
 * 
 * @param {*} props recipe object
 * @returns A formatted recipe card with its information
 */
function DisplayRecipe(props){

    return(
        <div>
            <h3>{props.recipe.title}</h3>

            <p>Ingredients: {props.recipe.ingredients}</p>
            
            <p>Servings: {props.recipe.servings}</p>
            
            <p>Instructions: {props.recipe.instructions}</p>
        </div>
    )

}

export {DisplayRecipe};