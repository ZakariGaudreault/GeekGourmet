import { useLocation } from "react-router-dom";
import { DeleteRecipeForm } from "../components/DeleteRecipeForm";

/**
 * Displays the form for deleting a recipe
 * 
 * @returns Element that represents the form for deleting a recipe
 */
function DeleteRecipe(){
    const {state} = useLocation();

    return(
        <div>
            {state && state.recipe && <DeleteRecipeForm recipe={state.recipe} book={state.book}/>}
        </div>
    )
}

export {DeleteRecipe};