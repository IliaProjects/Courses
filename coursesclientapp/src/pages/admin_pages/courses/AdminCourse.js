import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import AdminSections from "./sections/AdminSections"
import css from "./AdminCourseProfile.module.css"
import { getCourse } from "../../../api/CoursesApi"
import ImageHelper from "../../../classes/ImageHelper"
import { MdMonochromePhotos } from "react-icons/md"
import AdminCourseProfile from "./AdminCourseProfile"
import { BsPersonGear } from "react-icons/bs";
import { PiGearFineBold } from "react-icons/pi";
import { PiBooksFill } from "react-icons/pi"
import { IoIosArrowRoundBack } from "react-icons/io"

const AdminCourse = (props) => {
    let params = useParams()
    const[sectionTrigger, setSectionsTrigger] = useState(false)
    const[profTrigger, setProfTrigger] = useState(false)
    
    return(
            <div className={css.courseContainerScrollable}>
                <div className={css.adminHeader}>
                    <NavLink className={css.backward} to={`/admin/courses`}>
                        <IoIosArrowRoundBack />
                    </NavLink>
                    <div className={css.title}>
                        <h3>Курсы</h3>
                    </div>
                </div>
                <AdminCourseProfile collapseTrigger={profTrigger} onCollapsed={() => setSectionsTrigger(!sectionTrigger)} courseId={params.courseId} />
                <AdminSections collapseTrigger={sectionTrigger} onCollapsed={() => setProfTrigger(!profTrigger)} courseId={params.courseId} />
            </div>
    )
}

export default AdminCourse