import { UpdatePasswordForm } from "./UpdatePasswordForm";

/**
 * Displays the update password form
 * 
 * @returns Element that represents the form for updating the password
 */
function UpdatePassword(){

    return(
        <div className="centerUpdate">

            <UpdatePasswordForm/>
        </div>
    )
}

export {UpdatePassword};