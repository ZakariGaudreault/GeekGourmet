import { useState} from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

/**
 * Formats the update password form
 * 
 * @returns update password form
 */
function UpdatePasswordForm(){
    const [password, setUserPassword] = useState(null);
    const [newPassword, setnewPassword] = useState(null);
    const navigate = useNavigate();
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
                password:password,
                newPassword:newPassword,
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
        }

        const response = await fetch (process.env.REACT_APP_BACKEND + "/account/editpassword", requestOptions)
        const result = await response.json();
        if(response.status === 400){
            alert(result.errorMessage);
        }
        else if (response.status === 500){
            alert(result.errorMessage);
        }
        else{
            alert("success");
        }
    }
  
  

    return(
    
        <form onSubmit={handleSubmit} className="recipeForm">
             <h1>Update password</h1>
        <label htmlFor="Current Password" column sm="2">Current Password</label>
        <input type="password" placeholder="Current password..." onChange={(e) => setUserPassword(e.target.value)}></input>    
        <p/>
        <label htmlFor="New Password" column sm="2">New Password</label>
        <input type="password" placeholder="New password..." onChange={(e) => setnewPassword(e.target.value)}></input>    
        <p/>
        {password  &&  newPassword &&<button type="submit">Update Password</button>}
        </form> 
       
      
    );
}

export {UpdatePasswordForm};