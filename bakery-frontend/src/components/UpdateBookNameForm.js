import { useState } from "react"
import { useNavigate } from "react-router-dom";

/**
 * Formats the update book name form
 * 
 * @param {*} props book
 * @returns Form for updating book name
 */
function UpdateBookNameForm(props){
    const [name, setName] = useState(props.book.name);
    const [newName, setNewName] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event)=> {
        event.preventDefault();

        const requestOptions = {
            method: "PUT",
            credentials : "include",
            body: JSON.stringify({
                name: name,
                newName: newName,

        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },}

        const response = await fetch (process.env.REACT_APP_BACKEND + "/book/name", requestOptions)
        const result = await response.json();
        if(response.status === 400){
            alert(result.errMessage);
        }
        else if (response.status === 500){
            alert(result.errMessage);
        }
        else if (response.status === 200){
            navigate("/favorite");
        }
        else{
            alert(result.errMessage);
        }
    }

    return(
        <div className="center">
            <h1>Change Book Name</h1>
            <form onSubmit={handleSubmit}>

            <label htmlFor="Current Name" column sm="2">Current Name</label>
            <input value={name} type="text" placeholder="Current Name..." onChange={(e) => setName(e.target.value)}></input>

            <p/>

            <label htmlFor="New Name" column sm="2">New Name</label>
            <input type="text" placeholder="New Name..." onChange={(e) => setNewName(e.target.value)}></input>

            <p/>

            {name && newName && <button type="submit">Change Name</button>}

            </form>
        </div>
    )
}

export {UpdateBookNameForm}