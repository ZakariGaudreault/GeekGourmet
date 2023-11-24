import { UpdateRecipe } from "pages/UpdateRecipe";
import { DeleteRecipe } from "pages/DeleteRecipe";
import { ErrorBoundary } from "components/ErrorBoundary";

/**
 * Displays admin page
 * @returns admin page
 */
function Admin(){

    return (
        <ErrorBoundary>
        <div id="wrapper">
            <UpdateRecipe/>
            <DeleteRecipe/>
        </div>
        </ErrorBoundary>

        );
}

export {Admin};