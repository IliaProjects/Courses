import React from "react"
import '../../App.css'
import { GoGraph } from "react-icons/go";
import { NavLink } from "react-router-dom";

class StatisticsItem extends React.Component {
    render() {
        return(
            <NavLink className="menu-item" to="/admin/statistics">
                <div className="menu-icon">
                    <GoGraph />
                </div>
                {this.props.extended &&
                    <div className="admin-menu-text">
                        <h4>Статистика</h4>
                    </div>
                }
            </NavLink>
        );
    }
}

export default StatisticsItem