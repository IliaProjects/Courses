import React, { useEffect } from "react"
import { FaUsers } from "react-icons/fa";
import '../../App.css'
import { NavLink } from "react-router-dom";

class UsersItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            extended: this.props.extended
        }
    }
    render() {
        return(
            <NavLink className="menu-item" to="/admin/users">
                <div className="menu-icon">
                    <FaUsers />
                </div>
                {
                    this.props.extended && 
                            <div className="admin-menu-text">
                                <h4>Пользователи</h4>
                            </div>
                }
            </NavLink>
        );
    }
}

export default UsersItem