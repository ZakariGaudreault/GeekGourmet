import { GetAllSnackRecipes } from "components/GetAllSnackRecipes";

/**
 * Displays snack recipes
 * 
 * @returns snack recipes
 */
function Snack(){

    return (
        <div id="wrapper">
            <GetAllSnackRecipes/>
        </div>
        );
}

export {Snack};