import "./wrapper.css";
import { Card } from "./Card";

/**
 * Displays a list of all recipes with username and title 
 * 
 * @param {*} param An array of recipes 
 * @returns A list of recipes formatted in a card
 */
function ListRecipes({recipes}){
let list = [];
for (let i = 0;i < recipes.length;i++){
    let type = recipes[i].type;
if(type != '')
list.push(recipes[i])
}


    return(
        <div>
        <div className="flex-container">
        {list.map((recipe)=>(
            <div className="child">
                <Card>
                    <div className="centerCard">
                        <div className="centerTitle">
                        <p>{recipe.title}</p>
                        </div>
                        <div className="cardText">
                        <p> type {recipe.type}</p>
                        <p>Number of serving: {recipe.servings}</p>
                        <p>by {recipe.userId}</p>
                        </div>
                    </div>
                </Card>
            </div>  
        ))}
        </div>
        </div>

    );
}

export {ListRecipes};