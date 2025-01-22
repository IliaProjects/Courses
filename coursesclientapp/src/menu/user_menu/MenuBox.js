import React from "react";
import '../../App.css';
import MenuDivider from "./MenuDivider";
import LogoutItem from "./LogoutItem";
import MyProfileItem from "./MyProfileItem";
import { BrowserRouter } from "react-router-dom";

class MenuBox extends React.Component {
    render() {
        return (
            <div className= {this.props.collapsed ? "user-menu-box collapsed" : "user-menu-box"}>
                
                    <MyProfileItem collapseFunc={this.props.collapseFunc} />
                        <MenuDivider />
                    <LogoutItem />

            </div>
        )
    }
}

export default MenuBox