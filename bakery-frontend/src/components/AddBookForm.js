import { useState } from "react"
import { useNavigate } from "react-router-dom";

/**
 * Displays form for adding a new recipe book
 * 
 * @returns Element that contains the add form
 */
function AddBookForm(){
    const [name, setName] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event)=> {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                name: name,
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            }

        const response = await fetch (process.env.REACT_APP_BACKEND + "/book", requestOptions)
        const result = await response.json();
        if(response.status === 400){
            alert(result.errMessage);
        }
        else if (response.status === 500){
            alert(result.errMessage);
        }
        else{
            navigate('/favorite')
        }
    }

    return(
        <div className="center">
            <h1>Add Book</h1>
            <form onSubmit={handleSubmit}>

            <label htmlFor="Name" column sm="2">Name</label>
            <input type="text" placeholder="Name..." onChange={(e) => setName(e.target.value)}></input>

            <p/>

            {name && <button type="submit">Add Book</button>}

            </form>
        </div>
    )
}

export {AddBookForm}