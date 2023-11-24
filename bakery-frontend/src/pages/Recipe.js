import { DisplayRecipe } from "components/DisplayRecipe";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { LoggedInContext } from "components/App";

/**
 * Displays one recipe
 * 
 * @returns one recipe
 */
function Recipe(){
    const {state} = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);

    return(
        <div className="center">
            {state && state.recipe && <DisplayRecipe recipe={state.recipe}/>}
            {state.fromSearch && isLoggedIn ? <Link to="/recipe/creation" state={ {recipe: state.recipe}}> Save </Link> : null}
            {state.fromBook && isLoggedIn ? <div>                        <p></p>
                        <Link to="/recipe/edit" state={{recipe: state.recipe}}>Edit Recipe</Link>
                        <p></p>
                        <Link to="/recipe/removal" state={{recipe: state.recipe, book: state.book}}>Delete Recipe</Link>
            </div> : null} 
        </div>
    );
}

export {Recipe};