import { useContext } from 'react';
import { LoggedInContext } from './App';
import { Link } from 'react-router-dom';
import { GetUsersRecipeBooks } from './GetUsersRecipeBooks';

/**
 * Sets user dashboard
 * 
 * @returns Use dashboard
 */
function FavoriteLayout(){
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);

    return(
        <div>
            {isLoggedIn ? 
            <div>
                <GetUsersRecipeBooks/>
            </div> : 
            <div>
                You must be logged in to access this page
                <p></p>
                <Link to="/login">Log In</Link>    
            </div>}
        </div>
    )
}

export {FavoriteLayout}