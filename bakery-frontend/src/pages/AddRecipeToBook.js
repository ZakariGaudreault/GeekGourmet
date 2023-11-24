import { useLocation } from "react-router-dom"
import { UpdateBookRecipeAddition } from "components/UpdateBookRecipeAddition";

/**
 * Gets the update form for adding recipe to book
 * 
 * @returns Add Recipe to Book Page
 */
function AddRecipeToBook(){
    const {state} = useLocation();

    return(
        <div>
        {state && state.book && <UpdateBookRecipeAddition book={state.book}/>}
        </div>
    )
}

export {AddRecipeToBook}