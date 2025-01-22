import React from "react"
import '../../App.css'
import CoursesItem from './CoursesItem' 
import StatisticsItem from './StatisticsItem' 
import UsersItem from './UsersItem' 
import MenuExtentionItem from "./MenuExtentionItem"
import OrdersItem from "./OrdersItem"

class MenuBar extends React.Component {
    render() {
        return(
            <div id="menuBar" className={this.props.extended ? "menu-bar menu-bar-extended" : "menu-bar menu-bar-shorted"}>
                    <MenuExtentionItem click={this.props.onExtendClick}/>
                    <UsersItem extended={(this.props.extended)} />
                    <CoursesItem extended={(this.props.extended)} />
                    <OrdersItem extended={(this.props.extended)} />
                    <StatisticsItem extended={(this.props.extended)} />
            </div>
        );
    }
}

export default MenuBar