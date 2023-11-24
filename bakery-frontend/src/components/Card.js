import "./Card.css";
import "./wrapper.css"

/**
 * Formats the children of a card according to the css
 * 
 * @param {*} param children of the contents of the card 
 * @returns A formatted card element
 */
function Card({ children}){
    return(
        <div >
            {children}
        </div>
    );
}

export {Card};