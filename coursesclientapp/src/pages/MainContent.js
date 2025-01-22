import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminCoursesList from "./admin_pages/courses/AdminCoursesList";
import AdminStatistics from "./admin_pages/statistics/AdminStatistics"
import AdminUsers from "./admin_pages/users/AdminUsers";
import MyCourses from "./user_pages/courses_catalog/CoursesCatalog";
import Profile from "./user_pages/profile/Profile";
import Loading from "./user_pages/Loading";
import AdminSections from "./admin_pages/courses/sections/AdminSections";
import AdminCourse from "./admin_pages/courses/AdminCourse";
import Main from "./public_pages/Main";
import Footer from "../Footer";
import css from "./MainContent.module.css"
import CoursesCatalog from "./user_pages/courses_catalog/CoursesCatalog";
import CourseProfile from "./user_pages/course_profile/CourseProfile";
import SectionProfile from "./user_pages/section_profile/SectionProfile";
import AdminLessonsList from "./admin_pages/courses/lessons/AdminLessonsList";
import AdminCreateLesson from "./admin_pages/courses/lessons/AdminCreateLesson";
import AdminOrders from "./admin_pages/orders/AdminOrders";

class MainContent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false
        }
    }
    
    render(){
        return(
            <div className={css.mainContent}>
                <Routes>
                    {/* <Route path="/" element={<Navigate to="/profile" />}/> */}
                    <Route path="/" element={<Main />}/>
                    <Route path="/admin/statistics" element={<AdminStatistics />}/>
                    <Route path="/admin/users" element={<AdminUsers />}/>
                    <Route path="/admin/courses" element={<AdminCoursesList />}/>
                    <Route path="/admin/courses/:courseId" element={<AdminCourse />}/>
                    <Route path="/admin/courses/lessons/:sectionId" element={<AdminLessonsList />}/>
                    <Route path="/admin/courses/lessons/create/:sectionId" element={<AdminCreateLesson />}/>
                    <Route path="/admin/orders" element={<AdminOrders />}/>
                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/catalog" element={<CoursesCatalog />}/>
                    <Route path="/catalog/:courseId" element={<CourseProfile />}/>
                    <Route path="/catalog/module/:sectionId" element={<SectionProfile />}/>
                </Routes>
                
                {/* <Footer /> */}
            </div>
        )
    }

}

export default MainContent