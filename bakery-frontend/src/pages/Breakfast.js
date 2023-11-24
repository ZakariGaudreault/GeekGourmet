import { GetAllBreakfastRecipes } from "components/GetAllBreakfastRecipes";


/**
 * Displays breakfast recipes
 * 
 * @returns Breakfast recipes
 */
function Breakfast(){

    return (
        <div id="wrapper">
            <GetAllBreakfastRecipes/>
        </div>
        );
}

export {Breakfast};