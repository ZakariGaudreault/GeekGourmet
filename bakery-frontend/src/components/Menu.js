import NavButton from "./NavButton";
import panes from "./TwoPanes";

/**
 * The navbar of the website
 * @returns all the navbutton needed to navigate through the website
 */

function Menu() {
    return(
        //sets the elements at the top of the page
          <div className="d-flex justify-content-center flex-column">
          
        <NavButton label="Add Recipe" variant="primary"></NavButton>
        < p/>
        <NavButton label="Get a single recipe" variant="primary" ></NavButton>
        <p />
        <NavButton label="Show all recipes" variant="primary" ></NavButton>
        <p />
        <NavButton label="Update a recipe" variant="primary" ></NavButton>
      </div>
    );
  

}

export default Menu;