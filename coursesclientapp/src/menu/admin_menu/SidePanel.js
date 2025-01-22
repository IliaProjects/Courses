import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../../App.css'
import { AiFillLeftCircle } from "react-icons/ai"
import { AiFillRightCircle } from "react-icons/ai"
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import MenuBar from "./MenuBar";

//const root = ReactDOM.createRoot(document.getElementById('openCollapseBar'));

class SidePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: props.collapsed,
            barExtdended: false
        }
        this.collapse_uncollapse = this.collapse_uncollapse.bind(this);
        this.collapse = this.collapse.bind(this);
        this.uncollapse = this.uncollapse.bind(this);
        this.extendBar = this.extendBar.bind(this);

    }
    collapse_uncollapse(){
        if(this.state.collapsed) {
            this.uncollapse()
        } else {
            this.collapse()
        }
    }
    collapse() {
        this.setState({ collapsed: true});
        this.setState({ barExtdended: false});
    }
    uncollapse() {
        this.setState({ collapsed: false});
        this.setState({ barExtdended: false});
    }
    extendBar(){ 
        this.setState({ barExtdended: !this.state.barExtdended});
    }
    render() {
        return(
            <div id="sidePanel" className={this.state.collapsed ? "side-panel collapsed" : "side-panel"}>
                <MenuBar extended={this.state.barExtdended} onExtendClick={this.extendBar}/>  
                <div id="openCollapseBar" className="collapse-button-container" onClick={this.collapse_uncollapse} >
                    {
                        (this.state.collapsed) ?
                        <FaAngleRight className="collapse-button" />  :
                        <FaAngleLeft className="collapse-button" />
                    }                         
                </div> 
            </div>
        );
    }
}

export default SidePanel