import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Formats search form
 * 
 * @param {*} props 
 * @returns Search form for Ninja API
 */
function SearchRecipeForm(props){
    const [query, setQuery] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Api-Key" : "9tMQWPbv5v9Bs46FPlhgOw==Fq96b3KRP2L1EGdG"
            },
        }

        const response = await fetch("https://api.api-ninjas.com/v1/recipe?query=" + query, requestOptions);
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
        <form onSubmit={handleSubmit}>

        <input type="text" placeholder="Search..." onChange={(e) => setQuery(e.target.value)}></input>

        {query  && <button type="submit">Get Recipes</button>}

        </form>
    );
}

export {SearchRecipeForm};