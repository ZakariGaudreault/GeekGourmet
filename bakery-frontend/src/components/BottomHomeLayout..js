import { Card } from "./Card";

/**
 * Contains styling og bottom home layout
 * 
 * @returns Bottom Home Layout
 */
function BottomHomeLayout(){

  
        const styleObj = {
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: "black",
        }
    
        return(
           
    
            <div className="TrendVideo">
            <div>
                <h1>Tips & Tricks Of The Week</h1>
            <div className="flex-container">
        
                <div className="child">
                 
                        <div className="centerCardVideo">
                            <div className="centerTitle">
                            <iframe width="350" height="305" src="https://www.youtube.com/embed/BHcyuzXRqLs">
                            </iframe>

                            </div>
                        </div>           
                </div>  
             
                <div className="child">
                 
                 <div className="centerCardVideo">
                     <div className="centerTitle">
                     <iframe width="350" height="305" src="https://www.youtube.com/embed/qQq33CEzTic">
                     </iframe>

                     </div>
                 </div>         
         </div> 
         <div className="child">
                 
                 <div className="centerCardVideo">
                     <div className="centerTitle">
                     <iframe width="350" height="305" src="https://www.youtube.com/embed/ylh9GnBYhfc">
                     </iframe>

                     </div>
                 </div>

         
         </div> 
                   
                     
            </div>
            </div>
            </div>
          
    
            
        );
    }
    

export {BottomHomeLayout};