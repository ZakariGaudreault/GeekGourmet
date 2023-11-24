import { useState } from "react"
import { useNavigate } from "react-router-dom"

/**
 * Formats the remove recipe from book form
 * @param {*} param0 book
 * @returns Remove recipe from book form
 */
function UpdateBookRecipeRemoval(props){
    const [title, setTitle] = useState(props.recipe.title);
    const navigate = useNavigate();

    const handleSubmit = async (event)=> {
        event.preventDefault();

        const requestOptions = {
            method: "PUT",
            credentials : "include",
            body: JSON.stringify({
                recipeId: props.recipe._id,
                name: props.book.name
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
        }

        const response = await fetch (process.env.REACT_APP_BACKEND + "/book/content/removal", requestOptions)
        const result = await response.json();
        if(response.status === 400){
            alert(result.errMessage);
        }
        else if (response.status === 500){
            alert(result.errMessage);
        }
        else{
            navigate("/favorite")        
        }
    }

    return(
        <div className="center">
            <h1>Remove Recipe</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Title" column sm="2">Title</label>
                <input value={title} type="text" placeholder="Title..." onChange={(e) => setTitle(e.target.value)}></input>
                <p></p>
                {title && <button type="submit">Remove Recipe</button>}
            </form>
        </div>
    )

}

export {UpdateBookRecipeRemoval}