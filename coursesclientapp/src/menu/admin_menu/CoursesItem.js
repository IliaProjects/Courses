import React from "react"
import { PiBooksFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import css from '../../App.css'

class CoursesItem extends React.Component {
    render() {
        return(
            <NavLink className="menu-item" to="/admin/courses">
                <div className="menu-icon">
                    <PiBooksFill />
                </div>
                {
                    this.props.extended &&
                        <div className="admin-menu-text">
                            <h4>Курсы</h4>
                        </div>
                }
            </NavLink>
        );
    }
}

export default CoursesItem