## What is Geek Gourmet?

A classroom project for web programming II involving three people allowed us to enhance our knowledge about React, MongoDB,
JavaScript, HTML, and CSS by creating a website with features like user authentication, customizable user 
settings, and an easy navigation for the average user.


## How to use?

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
