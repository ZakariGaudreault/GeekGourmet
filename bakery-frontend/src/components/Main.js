import { AllRecipes } from "./AllRecipes";
import { SingleRecipe } from "./SingleRecipe";
import { AddRecipe } from "./AddRecipe";
import { UpdateRecipe } from "../pages/UpdateRecipe";
import { DeleteRecipes} from "./DeleteRecipes";
import { useLocation, useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import Home from "../pages/Home"
import "./style.css";


/**
 * Main function which is basically the home page
 * @returns the component for the normal user to see such as single and add recipes
 */
function Main(){

    return (
        
    <div >
        <Home/>
        <SingleRecipe/>  
        <AddRecipe/>
    </div>
    );
    
}


export default Main;


