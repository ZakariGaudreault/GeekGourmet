import {Link, useLocation} from "react-router-dom";

/**
 * Shows an error message when something goes wrong in the user input
 * 
 * @returns Error message
 */
function UserError(){
    const {state} = useLocation();

    return (
        <div>
            <h1>There was an input error.</h1>
            <p>{state.errorMessage}</p>
            <Link to={state.link}>{state.linkLabel}</Link>
        </div>
    );
}

export {UserError};