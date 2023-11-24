import { useState, useEffect } from "react"
import { ListRecipeBooks } from "./ListRecipeBooks";
import { Link, NavLink } from "react-router-dom";

/**
 * Displays options for viewing the recipe book and adding new items
 * 
 * @returns Elements to add new recipe or book  as well as getting all the books
 */
function GetUsersRecipeBooks(){
    const [books, setBooks] = useState([]);

    const callGetBooks = async() => {
        const requestOptions = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }
    
        const response = await fetch (process.env.REACT_APP_BACKEND + "/book/user", requestOptions);
        const result = await response.json();
        setBooks(result);
    }

    return(
        <div className="center">
            <h1>Recipe Books</h1>
            <NavLink to="/recipe/creation"><button>Add New Recipe</button></NavLink>
            <p></p>
            <NavLink to="/book/creation"><button>Add New Book</button></NavLink>
            <p></p>
            <button onClick={callGetBooks}>Get Recipe Books</button>
            {books[0] && <ListRecipeBooks books={books}/>}
        </div>
    );    

}


export {GetUsersRecipeBooks}