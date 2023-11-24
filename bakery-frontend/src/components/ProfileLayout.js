import { LoginForm } from './LoginForm';
import { UserSettings } from './UserSettings';
import { useContext } from 'react';
import { LoggedInContext } from './App';

/**
 * Displays the user settings or the login form
 * 
 * @returns User settings if logged in. Log in form if not
 */
function ProfileLayout(){
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);

    return(
        <div>
            {isLoggedIn ? <UserSettings/> : <LoginForm/>}
        </div>
    );

}

export {ProfileLayout};