import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInContext } from "./App";
import { useContext } from "react";
import { Link } from "react-router-dom";

/**
 * Displays Log in Form
 * 
 * @returns Log In form
 */
function LoginForm(){
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        try{
           
                event.preventDefault();
        
                const requestOptions = {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        username: username,
                        password: password
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    },
                    
                };
        
                const response = await fetch (process.env.REACT_APP_BACKEND + "/session/login", requestOptions)
        
                if(response.status === 200 || response.status === 204) {
                    setIsLoggedIn(true);
                    navigate('/favorite');
                }
                else{
                    alert("Failed Login: credentials are incorrect");
                    setIsLoggedIn(false);
                }    
            }
        catch(e) {
            alert("Error: " + e.message);
        }
        }
    
        return(
            <div className="center">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}></input>
                
                <p></p>

                <label htmlFor="type">Password</label>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
        
                <p></p>

                {username && password && <button type="submit">Submit</button>}

                <p></p>

                <Link to="/register">No account?</Link>
            </form>
            </div>

        );

}

export {LoginForm}