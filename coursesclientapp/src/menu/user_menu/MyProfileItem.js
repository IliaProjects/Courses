import React from "react";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const MyProfileItem = (props) => {
    return (<NavLink className="user-menu-item" to="/profile" onClick={props.collapseFunc}>
        <FaUser />
        <h4>Мой профиль</h4>
    </NavLink>)
}

export default MyProfileItem