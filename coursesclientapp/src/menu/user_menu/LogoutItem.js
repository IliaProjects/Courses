import React from "react";
import { ImExit } from "react-icons/im";
import Logout from "../../classes/Logout";

const LogoutItem = (props) => {
    return (<div className={'user-menu-item item-logout'} onClick={Logout}>
        <ImExit />
        <h4>Выход</h4>
    </div>)
}

export default LogoutItem