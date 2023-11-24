import { useState} from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

/**
 * Displays the form for getting a recipe
 * 
 * @param {*} props function for keeping track of the recipe found
 * @returns Element that contains the get form
 */
function GetSingleRecipeForm(props){
    const [userId, setUserId] = useState(null);
    const [title, setTitle] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
        }

        const response = await fetch (process.env.REACT_APP_BACKEND + "/recipe/" + userId + "/" + title, requestOptions)
        const result = await response.json();
        if(response.status === 400){
            navigate("/usererror", {state: {errorMessage: result.errorMessage, link: "/", linkLabel:"Home"}});
        }
        else if (response.status === 500){
            navigate("/systemerror", {state: {errorMessage: result.errorMessage, link: "/", linkLabel:"Home"}});
        }
        else{
            props.setAdded(result);
        }
    }

    return(
        <>
        <h1>Get Single Recipe</h1>
        <h3>Provide the username and title to get a recipe.</h3>
        <form onSubmit={handleSubmit} className="recipeForm">

        <label htmlFor="Username" column sm="2">Username</label>
        <input type="text" placeholder="Username..." onChange={(e) => setUserId(e.target.value)}></input>

        <p/>

        <label htmlFor="Title" column sm="2">Title</label>
        <input type="text" placeholder="Title..." onChange={(e) => setTitle(e.target.value)}></input>

        <p/>
        
        {userId && title  && <button type="submit">Get Recipe</button>}
        </form> 
        </>   
    );
}

export {GetSingleRecipeForm};