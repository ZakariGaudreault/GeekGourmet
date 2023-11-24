// import { GetAllRecipes } from "components/FavoriteLayout";
import {FavoriteLayout} from "components/FavoriteLayout"

/**
 * Displays user dashboard information
 * 
 * @returns user dashboard
 */
function Favorite(){

    return (
        <div id="wrapper">
            <FavoriteLayout/>
        </div>
        );
}

export {Favorite};