import React, { useEffect } from "react"
import { BsEnvelopeExclamationFill } from "react-icons/bs";
import '../../App.css'
import { NavLink } from "react-router-dom";

class OrdersItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            extended: this.props.extended
        }
    }
    render() {
        return(
            <NavLink className="menu-item" to="/admin/orders">
                <div className="menu-icon">
                    <BsEnvelopeExclamationFill />
                </div>
                {
                    this.props.extended && 
                        <div className="admin-menu-text">
                            <h4>Заявки</h4>
                        </div>
                }
            </NavLink>
        );
    }
}

export default OrdersItem