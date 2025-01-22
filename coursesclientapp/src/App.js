import React from 'react';
import './App.css';
import UserPanel from './menu/user_menu/UserPanel';
import SidePanel from './menu/admin_menu/SidePanel'
import MainContent from './pages/MainContent';
import { BrowserRouter } from 'react-router-dom';
import { isInAdminRole } from '../src/classes/RoleHelper';
import Cookies from 'js-cookie';
import Header from './Header';
import Footer from './Footer';


class App extends React.Component {
  render() {
    return(
        <div className='site-container'>
          <BrowserRouter>
            <Header authorized={true} />
            {
              isInAdminRole(Cookies.get('roleEnum')) &&
              <SidePanel collapsed={false}/>
            }
            <UserPanel />
            <MainContent />
          </BrowserRouter>
        </div>
    )    
  }
}

export default App;
