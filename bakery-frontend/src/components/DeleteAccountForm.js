import { useState} from "react";
import { useNavigate } from "react-router-dom";
import './style.css';
import { useContext } from "react";
import { LoggedInContext } from "./App";

/**
 * Displays the form for deleting a user
 * 
 * @returns Element that contains the delete form
 */
function DeleteUserAccountForm(){
    const navigate = useNavigate();
    const [password, setUserPassword] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({
                password:password,
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
        }

        const response = await fetch (process.env.REACT_APP_BACKEND + "/account/", requestOptions)
        const result = await response.json();
        if(response.status === 400){
            alert(result.errorMessage);
        }
        else if (response.status === 500){
            alert(result.errorMessage);
        }
        else{
            alert("success");
            setIsLoggedIn(false);
            navigate("/");
        }
    }
  
  

    return(
    
        <form onSubmit={handleSubmit} className="recipeForm">
             <h1>Delete Account</h1>
        <label htmlFor="Name" column sm="2">Enter Your Password to delete account</label>
        <input type="password" placeholder="Current password..." onChange={(e) => setUserPassword(e.target.value)}></input> 
        {password && <button type="submit">DeleteAccount</button>}
        </form> 
       
      
    );
}

export {DeleteUserAccountForm};