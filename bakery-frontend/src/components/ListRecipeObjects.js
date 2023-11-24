import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn
  } from 'mdb-react-ui-kit';

  import { Link } from 'react-router-dom';

  /**
   * Displays list of recipes with option
   * 
   * @param {*} param0 recipe, name of the book and book
   * @returns list of recipes
   */
function ListRecipeObjects({recipes, name, book}){
    return(
        <div>
            <h1>{name}</h1>
            {recipes.map((recipe)=>(
            <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle>{recipe.title}</MDBCardTitle>
                        <MDBCardText>
                            {recipe.instructions}
                        </MDBCardText>
                        <Link to="/recipe" state={ {recipe: recipe, fromSearch: false, fromBook: true, book: book}}>Read More</Link>
                        <p></p>
                        <Link to="/recipe/edit" state={{recipe: recipe}}>Edit Recipe</Link>
                        <p></p>
                        <Link to="/recipe/removal" state={{recipe: recipe, book: book}}>Delete Recipe</Link>
                        <p></p>
                        <Link to="/recipe/book/removal" state={{recipe: recipe, book: book}}>Delete Recipe From Book</Link>

                </MDBCardBody>
            </MDBCard>
         ))}

        </div>
    );
}

export {ListRecipeObjects}