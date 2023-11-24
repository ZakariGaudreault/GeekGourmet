import { useNavigate } from "react-router-dom";


/**
 * Home button of the page
 * @returns a button to go back home
 */
function HomeButton(){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/home");
    };

    return <button onClick={handleClick}>Home</button>
}

export default HomeButton;