import { DeleteUserAccountForm } from "./DeleteAccountForm";

/**
 * Displays the form and card for deleting an account
 * 
 * @returns Element that represents the form for deleting an account
 */
function DeleteAccount(){

    return(
        <div className="centerUpdate">

            <DeleteUserAccountForm/>
        </div>
    )
}

export {DeleteAccount};