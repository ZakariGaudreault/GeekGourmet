import { useLocation } from "react-router-dom"
import { DeleteBookForm } from "components/DeleteBookForm"

/**
 * Displays delete form
 * 
 * @returns delete book page
 */
function DeleteBook(){
    const {state} = useLocation();

    return(
        <div>
            {state && state.book && <DeleteBookForm book={state.book}/>}
        </div>
    );
}

export {DeleteBook}