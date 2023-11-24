import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

/**
 * Displays register form
 * 
 * @returns Register Form
 */
function RegisterForm(){
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [password, setPassword] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        try{
           
                event.preventDefault();
        
                const requestOptions = {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        username: username,
                        displayName: displayName,
                        email: email,
                        password: password
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    },
                    
                };
        
                const response = await fetch (process.env.REACT_APP_BACKEND + "/account", requestOptions);
                const result = await response.json();
        
                if(response.status === 200 || response.status === 204) {
                    navigate('/login');
                }
                else{
                    alert("Failed register : " + result.errorMessage);
                }    
            }
        catch(e) {
            alert("Error: " + e.message);
        }
        }
    
        return(
            <div className="center">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
                
                <p></p>

                <label htmlFor="username">Username</label>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}></input>
                
                <p></p>

                <label htmlFor="displayName">Display Name</label>
                <input type="text" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)}></input>
                
                <p></p>

                <label htmlFor="type">Password</label>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
        
                <p></p>

                {email && displayName && username && password && <button type="submit">Submit</button>}

                <p></p>

                <Link to="/login">Have an account?</Link>
            </form>
            </div>

        );

}

export {RegisterForm}