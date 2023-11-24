import { useLocation } from "react-router-dom"
import { UpdateBookNameForm } from "components/UpdateBookNameForm";

/**
 * displays update book name form
 * 
 * @returns update book name form
 */
function UpdateBookName(){
    const {state} = useLocation();

    return(
        <div>
            {state && state.book && <UpdateBookNameForm book={state.book}/>}
        </div>
    );
}

export {UpdateBookName}