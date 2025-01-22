
import { MdLibraryBooks } from "react-icons/md";
import headerCSS from './Header.module.css'
import { NavLink } from "react-router-dom";
import { CiLogin } from "react-icons/ci";

const Header = (props) => {
    return(
        <div className={headerCSS.header}>
          <NavLink className={(navData) => navData.isActive ? `${headerCSS.logo} ${headerCSS.active}` : `${headerCSS.logo}`} to="/">
            <img src={require("./logo.png")}/>
          </NavLink>
          <NavLink className={(navData) => navData.isActive ? `${headerCSS.menuItem} ${headerCSS.active}` : headerCSS.menuItem} to="/catalog">
            <MdLibraryBooks style={{"margin-top": "2px"}}/>
            <text>Курсы</text>
          </NavLink>
          {
            !props.authorized && 
              <NavLink className={headerCSS.loginContainer} to="/login">
                <CiLogin />
                <span>Вход</span>
              </NavLink>
          }
        </div>
      )
}

export default Header