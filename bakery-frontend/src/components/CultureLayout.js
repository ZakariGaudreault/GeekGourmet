import { Card } from "./Card";

/**
 * Contains culture layout
 * 
 * @returns Culture layout
 */
function CultureLayout(){

  
        const styleObj = {
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: "black",
        }
    
        return(
           
    
            <div className="TrendCulture">
            <div>
                <h1>Culture of the week: Canada</h1>
            <div className="flex-container">
        
            <div className="child">
                 
                 <div className="centerCard">
                                <div className="centerTitleCulture">
                               <h1>Poutine de Francois</h1>
                               <img  src="https://i.imgur.com/h36LiZ9_d.webp?maxwidth=1520&fidelity=grand" alt="Poutine" width="450" height="300"></img>
                              <h5>type: Dinner</h5>
                            <h5>Number of serving: 2</h5>
                            <h5>By: Francois Gagnon</h5>
                                </div>
                            </div>
        
                 
                 </div>  
             
                 <div className="child">
                 
                 <div className="centerCard">
                                <div className="centerTitleCulture">
                               <h1>Sweet beaver tail</h1>
                               <img  src="https://i.imgur.com/UYHrY45.jpg" alt="Beaver tail" width="450" height="300"></img>
                              <h5>type: Dessert</h5>
                            <h5>Number of serving: 1</h5>
                            <h5>By: Marc Labreche</h5>
                                </div>
                            </div>
        
                 
                 </div>  
                 <div className="child">
                 
                 <div className="centerCard">
                                <div className="centerTitleCulture">
                               <h1>Alex's Nanaimo squares</h1>
                               <img  src="https://i.imgur.com/dvfqJOW.jpg" alt="Nanaimo Bars" width="450" height="300"></img>
                              <h5>type: Dessert</h5>
                            <h5>Number of serving: 8</h5>
                            <h5>By: Alex Leclerc</h5>
                                </div>
                            </div>
        
                 
                 </div>  

                 <div className="child">
                 
                 <div className="centerCard">
                                <div className="centerTitleCulture">
                               <h1>Tourtière</h1>
                               <img  src="https://i.imgur.com/scjxvNi.jpg" alt="Girl in a jacket" width="450" height="300"></img>
                              <h5>type: Dinner</h5>
                            <h5>Number of serving: 4</h5>
                            <h5>By: Ginette Grenette</h5>
                                </div>
                            </div>
        
                 
                 </div>  
                   
                     
            </div>
            </div>
            </div>
          
    
            
        );
    }
    

export {CultureLayout};