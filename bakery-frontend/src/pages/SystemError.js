import {Link, useLocation} from "react-router-dom";

/**
 * Shows an error message when something goes wrong in the system
 * 
 * @param {*} param error message 
 * @returns Error message
 */
function SystemError({errorMessage}){
    const {state} = useLocation();

    return (
        <div>
            <h1>There was a system error.</h1>
            <p>{state.errorMessage}</p>
            <Link to="/">Home</Link>
        </div>
    );
}

export {SystemError};