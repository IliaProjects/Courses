import { Route, Routes } from "react-router-dom";
import Login from "./public_pages/login_components/Login"
import css from "./UnauthorizedContent.module.css"
import Main from "./public_pages/Main";
import CoursesCatalog from "./user_pages/courses_catalog/CoursesCatalog"

const UnauthorizedContent = (props) => {
    const login = (e) => {
      window.location.href = "/..";
    }
    return(
        <div className={css.unauthorizedContent}>
            <Routes>
                <Route path="/" element={<Main authorized={false} />}/>
                <Route path="/login" element={<Login onLogin={login} />}/>
                <Route path="/catalog" element={<CoursesCatalog authorized={false} />}/>
            </Routes>
        </div>)
}

export default UnauthorizedContent