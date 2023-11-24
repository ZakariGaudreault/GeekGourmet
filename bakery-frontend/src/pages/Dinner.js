import { GetAllDinnerRecipes } from "components/GetAllDinnerRecipes";

/**
 * Displays dinner recipes
 * 
 * @returns dinner recipes
 */
function Dinner(){

    return (
        <div id="wrapper">
            <GetAllDinnerRecipes/>
        </div>
        );
}

export {Dinner};