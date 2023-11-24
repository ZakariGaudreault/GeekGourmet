import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn
  } from 'mdb-react-ui-kit';

import { Link } from 'react-router-dom';

/**
 * Displays list of books with options
 * 
 * @param {*} param0 books
 * @returns list of books
 */
function ListRecipeBooks({books}){

    return(
        <div>
            {books.map((book)=> (
                <MDBCard>
                    <MDBCardBody>
                        <MDBCardTitle>
                            {book.name}
                        </MDBCardTitle>
                        <p></p>
                        <Link to="/book" state={{book:book}}>Open Book</Link>
                        <p></p>
                        <Link to="/book/name" state={{book:book}}>Update Book Name</Link>
                        <p></p>
                        <Link to="/book/removal" state={{book:book}}>Delete Book</Link>
                    </MDBCardBody>

                </MDBCard>
            ))}
        </div>
    );

}

export {ListRecipeBooks}