import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
  } from 'mdb-react-ui-kit';

  import { Link } from 'react-router-dom';
  import { useContext } from 'react';
  import { LoggedInContext } from './App';

/**
 * Displays a list of all recipes from query
 * 
 * @param {*} param An array of recipes 
 * @returns A list of recipes formatted in a card
 */
function ListRecipesFromSearch({recipes}){
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);

    return(
        <div>
            {recipes.map((recipe)=>(
            <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle>{recipe.title}</MDBCardTitle>
                        <MDBCardText>
                            {recipe.instructions}
                        </MDBCardText>
                        <Link  to="/recipe" state={ {recipe: recipe, fromSearch: true}}>
                            Read More
                        </Link>
                        <p></p>
                        {isLoggedIn ? <Link to="/recipe/creation" state={ {recipe: recipe, fromSearch: true}}>
                            Save
                        </Link> : null}
                </MDBCardBody>
            </MDBCard>
         ))}

        </div>
    );
}

export {ListRecipesFromSearch};