import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import MenuBox from "./MenuBox";
import { getProfile } from "../../api/ProfileApi";
import ImageHelper from "../../classes/ImageHelper";


class UserMenu extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            menuCollapsed: true,
            photo: "",
        }
        this.menuCollapser = this.menuCollapser.bind(this);
    }
    render(){
        return(
            <div className="user-panel">
                <div className='user-menu-button' onClick={this.menuCollapser}>
                    {this.state.photo == "" ? <FaUserCircle style={{ stroke: "url(#blue-gradient)", width: "60px", height: "60px" }} /> : <img className="user-photo-img" src={this.state.photo}/>}
                </div>
                {
                // this.state.menuCollapsed ?
                    // <FaCaretDown className="user-menu-arrow" onClick={this.menuCollapser}/>:
                    // <FaCaretUp className="user-menu-arrow" onClick={this.menuCollapser}/>
                }
                <MenuBox collapseFunc={this.menuCollapser} collapsed={this.state.menuCollapsed} />
            </div>
        )
    }
    menuCollapser() {
        this.setState({
            menuCollapsed: !this.state.menuCollapsed
        });
    }
    componentDidMount(){
        getProfile((data) => {
            if(data.photo.length > 0) 
            this.setState({photo: new ImageHelper(data.photo).getWithPrefix()})
        });
    }
}

export default UserMenu