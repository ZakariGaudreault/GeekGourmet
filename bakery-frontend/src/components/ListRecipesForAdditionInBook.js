import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
  } from 'mdb-react-ui-kit';
import { NavLink } from 'react-router-dom';

/**
 * Displays list of recipes to add in the book
 * 
 * @param {*} param0 recipes, book
 * @returns list of recipes
 */
function ListRecipesForAdditionInBook({recipes, book}){

    return(
        <div>
            {recipes.map((recipe)=>(
            <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle>{recipe.title}</MDBCardTitle>
                    <button onClick={async () => await addToBook(recipe, book)}>Add</button>
                </MDBCardBody>
            </MDBCard>
         ))}

        </div>
    );

}

async function addToBook(recipe, book){
    const requestOptions = {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
            recipeId: recipe._id,
            name: book.name
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
    }

    const response = await fetch (process.env.REACT_APP_BACKEND + "/book/content/new", requestOptions)
    const result = await response.json();
    if(response.status === 400){
        alert(result.errMessage);
    }
    else if (response.status === 500){
        alert(result.errMessage);
    }
    else if (response.status === 200){
        alert("success");
    }

}

export {ListRecipesForAdditionInBook};