import React from "react"
import { FaBars } from "react-icons/fa6";
import '../../App.css'

class MenuExtentionItem extends React.Component {
    render() {
        return(
            <a className="menu-item menu-extention-item" onClick={this.props.click}>
                <div className="menu-icon">
                    <FaBars />
                </div>
            </a>
        );
    }
}

export default MenuExtentionItem