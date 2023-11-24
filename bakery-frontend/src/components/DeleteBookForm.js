import { useState } from "react"
import { useNavigate } from "react-router-dom";

/**
 * Displays delete book form
 * 
 * @param {*} props book
 * @returns Element that contains the delete form
 */
function DeleteBookForm(props){
    const [name, setName] = useState(props.book.name);
    const navigate = useNavigate();

    const handleSubmit = async (event)=> {
        event.preventDefault();

        const requestOptions = {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({
                name: name,
 
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },}

        const response = await fetch (process.env.REACT_APP_BACKEND + "/book", requestOptions)
        const result = await response.json();
        if(response.status === 400){
            alert(result.errMessage);
        }
        else if (response.status === 500){
            alert(result.errMessage);
        }
        else if (response.status === 200){
            alert("Successfully deleted")
            navigate("/favorite")
        }
    }

    return(
        <div className="center">
            <h1>Delete Book</h1>
            <form onSubmit={handleSubmit}>

            <label htmlFor="Name" column sm="2">Name</label>
            <input value={name} type="text" placeholder="Name..." onChange={(e) => setName(e.target.value)}></input>

            <p/>

            {name && <button type="submit">Delete Book</button>}

            </form>
        </div>
    )
}

export {DeleteBookForm}