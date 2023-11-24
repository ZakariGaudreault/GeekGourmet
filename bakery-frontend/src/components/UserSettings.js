import { DeleteAccount } from "./DeleteAccount";
import { UpdatePassword } from "./UpdatePassword";

/**
 * Displays form for updating password and deleting an account
 * 
 * @returns user settings
 */
function UserSettings(){


   return <div className="center">
    <h1>User settings</h1>
    <UpdatePassword/>
    <DeleteAccount/>
   </div>

}

export {UserSettings}