import { Card } from "./Card";

/**
 * Displays Home
 * 
 * @returns Home Layout
 */
function HomeLayout(){
  
    const styleObj = {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
    }

    return(
        <div className="centerTrend">
        <div className="MealOfTheWeek">
        <h1>Meal of the week</h1>
        <h2>La poutine à Monique spicy.</h2>
        <img  src="https://i.imgur.com/h36LiZ9_d.webp?maxwidth=1520&fidelity=grand" alt="La putine à Monique sspicy" width="375" height="300"></img>
        <div className="centerTrend">
            <h3 style={styleObj}>
        This week's meal is a mouth-watering poutine recipe that 
        will leave your taste buds begging for more. Made with the richest gravy,
         velvety cheese curds, and crispy potatoes, Monique's poutine is a delicious
          and hearty dish that is perfect for any occasion. Treat yourself to this divine creation and experience the magical flavors that have made it a beloved classic.
          This Recipe was made by Monique Gagnon and has the serving for 2 persons for a lovely Dinner.Bon appétit!
          
          </h3>
          
        </div>
        </div>  

        <div className="Trend">
        <div>
            <h1>Trending</h1>
        <div className="flex-container">
    
            <div className="child">
             
                    <div className="centerCard">
                        <div className="centerTitle">
                       <h5>Magic Smoothie</h5>
                       <img  src="https://i.imgur.com/yOnxSor.jpg" alt="SMagic Smoothie" width="150" height="100"></img>
                      <h5>type: Snack</h5>
                    <h5>Number of serving: 1</h5>
                    <h5>By: Paul Poirier</h5>
                        </div>
                    </div>
                    
            
            </div>  
            <div className="centerCard">
                        <div className="centerTitle">
                       <h5>Angel Crêpes</h5>
                       <img  src="https://i.imgur.com/dZkAZKZ.jpg" alt="Angel Crêpes" width="150" height="100"></img>
                      <h5>type: Breakfast</h5>
                    <h5>Number of serving: 2</h5>
                    <h5>By: Monique Gagnon</h5>
                        </div>
                    </div>
                    <div className="centerCard">
                        <div className="centerTitle">
                       <h5>Cheese sticks</h5>
                       <img  src="https://i.imgur.com/QUN4okm.jpg" alt="Mozarella stick" width="150" height="100"></img>
                      <h5>type: Dinner</h5>
                    <h5>Number of serving: 5</h5>
                    <h5>By: Andrew Smooth</h5>
                        </div>
                    </div>
                    <div className="centerCard">
                        <div className="centerTitle">
                       <h5>Buffalo Chicken Wings</h5>
                       <img  src="https://i.imgur.com/cvgFOrX.jpg" alt="Chicken Wings" width="150" height="100"></img>
                      <h5>type: Dinner</h5>
                    <h5>Number of serving: 2</h5>
                    <h5>By: Mathias Cardinaux</h5>
                        </div>
                    </div>
                    <div className="centerCard">
                        <div className="centerTitle">
                       <h5>Quick Crackers</h5>
                       <img  src="https://i.imgur.com/0dL0Qd7.jpg" alt="Crackers" width="150" height="100"></img>
                      <h5>type: Quick</h5>
                    <h5>Number of serving: 2</h5>
                    <h5>By: Karl Carl</h5>
                        </div>
                    </div>
                    <div className="centerCard">
                        <div className="centerTitle">
                       <h5>Greek Salad</h5>
                       <img  src="https://i.imgur.com/VxUFWBN.jpg" alt="Greek Salad" width="150" height="100"></img>
                      <h5>type: Dinner</h5>
                    <h5>Number of serving: 2</h5>
                    <h5>By: Mike Tyson</h5>
                        </div>
                    </div>
        </div>
        </div>
        </div>
        </div>  
        

        
    );
}

export {HomeLayout};