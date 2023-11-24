import { useLocation } from "react-router-dom";
import { UpdateRecipeForm } from "components/UpdateRecipeForm";

/**
 * Displays the form for updating a recipe
 * 
 * @returns Element that represents the form for updating a recipe
 */
function UpdateRecipe(){
    const {state} = useLocation();

    return(
        <div>
            {state && state.recipe && <UpdateRecipeForm recipe={state.recipe}/>}
        </div>
    )
}

export {UpdateRecipe};