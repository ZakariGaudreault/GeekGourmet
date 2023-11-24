import { NavLink, useResolvedPath, useMatch } from "react-router-dom";
import Button from "@mui/material/Button";

/**
 * Formats the navigation buttons
 * 
 * @param {*} props The link and label of the navigation button
 * @returns A formatted navigation button
 */
function NavButton(props) {
    let resolved = useResolvedPath(props.to);
    let match = useMatch({ path: resolved.pathname, end: true});
  
    return (
    <NavLink to={props.to}>
        <Button variant={match ? "contained" : "outlined"}>{props.label}</Button>
    </NavLink>
    );
}

export {NavButton};