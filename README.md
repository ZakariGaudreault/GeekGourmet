## What is Geek Gourmet?

A collaborative classroom project for Web Programming II, a team effort involving three individuals, provided me with an invaluable opportunity to significantly augment my proficiency in a range of technologies, including React, MongoDB, JavaScript, HTML, and CSS. Through the development of a comprehensive website, the project encapsulated key functionalities such as user authentication, the implementation of customizable user settings, and the establishment of an intuitively navigable interface tailored to meet the needs of the average user. This hands-on experience not only broadened my technical skill set but also deepened my understanding of creating dynamic and user-friendly web applications.

- To run the website, download the project which includes the backend and frontend.
- Open the two folders in Visual Studio.
- Run 'npm i' in both projects to install the modules.
- Add an .env file in the backend with the content below.
- Run both projects

.env file details -> 
MONGODB_PWD="ktTLP9Xk04MiCbuh"
URL_PRE="mongodb+srv://geekgourmet:"
URL_POST="@cluster0.gdchlfc.mongodb.net/?retryWrites=true&w=majority"

Website URL : http://localhost:3000/

In the home page, users can look at the trending recipes or watch the cooking tip videos

In the nav bar, there is a menu called "Recipes". Users can choose from the categories and read more about the recipes. If the user is logged in, then they can save the recipe. The website will direct them to a form. They must include the number of servings since it is not given.

Culture page showcases recipes from a specific country.

About us has an explanation about our website and contact has our contact information.

Users can also search up recipes if they head over the search icon. Once again, if user is logged in, they can save the recipe.

The user icon directs to the log in/register page. Once registered, the user then log ins.

The heart icon directs to the favorite page or the user dashboard. Users can add new recipes, create a new recipe book and retrieve their books. Getting the book lists all of them. Users can update the name or delete the book. They can also open the book which gives them access to the saved recipes. Recipes can be edited, deleted or removed from the book. Users can also add recipes in the book via the button 'Add Recipes'.
