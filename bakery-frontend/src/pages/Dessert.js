import { GetAllDessertRecipes } from "components/GetAllDessertRecipes";

/**
 * Displays dessert recipes
 * 
 * @returns dessert recipes
 */
function Dessert(){

    return (
        <div id="wrapper">
            <GetAllDessertRecipes/>
        </div>
        );
}

export {Dessert};