import { useLocation } from "react-router-dom"
import { UpdateBookRecipeRemoval } from "components/UpdateBookRecipeRemoval";

/**
 * displays form for removing the book recipe
 * 
 * @returns form for removing recipes from the book
 */
function RemoveRecipeFromBook(){
    const {state} = useLocation();

    return(
        <div>
        {state && state.recipe && state.book && <UpdateBookRecipeRemoval recipe={state.recipe} book={state.book}/>}
        </div>
    )
}

export {RemoveRecipeFromBook}