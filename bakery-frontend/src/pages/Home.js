import { useSearchParams } from "react-router-dom";
import { HomeLayout } from "components/HomeLayout";
import { BottomHomeLayout } from "components/BottomHomeLayout.";
import { ErrorBoundary } from "components/ErrorBoundary";


/**
 * Welcomes the users. Displays the form for adding and getting a recipe. 
 * Shows an error page if there are any errors.
 * 
 * @returns Elements for adding and getting a recipe
 */
function Home(){
    const [searchParams] = useSearchParams();

    return (
    <ErrorBoundary>
        <h2>Welcome to Geek Gourmet</h2>  
        <HomeLayout/>
        <BottomHomeLayout/>
    </ErrorBoundary>
    );
    
}


export {Home};