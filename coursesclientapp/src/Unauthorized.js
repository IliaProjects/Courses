import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Login from "./pages/public_pages/login_components/Login"
import UnauthorizedContent from "./pages/UnauthorizedContent";


const Unauthorized = (props) => {
    const login = (e) => {
      window.location.reload();
    }
    return (
        <div className='site-container'>
          <BrowserRouter>
            <Header authorized={false} />
            <UnauthorizedContent />
          </BrowserRouter>
        </div>
    )
}

export default Unauthorized