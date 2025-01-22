import React, { forwardRef, useEffect, useRef, useState } from "react";
import css from './AdminCoursesListItem.module.css'
import ImageHelper from "../../../classes/ImageHelper";
import { FaXmark } from "react-icons/fa6";
import DeleteCoursePopup from "../Popups/admin_courses/DeleteCoursePopup";
import EditCoursePopup from "../Popups/admin_courses/EditCoursePopup";
import { FaCaretDown } from "react-icons/fa";
import AdminSectionsList from "../AdminSectionsList";
import { MdMonochromePhotos } from "react-icons/md";
import { PiGearFineBold } from "react-icons/pi";
import { getFormatedDate } from "../../../classes/DateHelper";
import { NavLink } from "react-router-dom";
import Toastr, { successToast } from "../../../things/Toastr";

const AdminCoursesListItem = (props) => {
    const [courseId, setId] = useState(props.course.id)

    const [deleting, setDeletingState] = useState(false)
    const [editing, setEditingState] = useState(false)
    
    const [isCollapsed, setIsCollapsed] = useState(true)

    //для класса изображения
    const [horisontal, setHorisontal] = useState(false)

    var img = new Image()
    img.onload = () => {
        img.width > img.height && setHorisontal(true)
    }
    img.src = new ImageHelper(props.course.image).getWithPrefix()

    return( 
        <div className={css.item}>
		
        <Toastr />
            <NavLink className={css.courseClickable} to={`/admin/courses/${props.course.id}`}>
                <div className={css.corseImageContainer}>
                    {
                        props.course.image.length > 0 ?
                            <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(props.course.image).getWithPrefix()}/>:
                            <MdMonochromePhotos className={css.courseNoPhoto} />
                    }
                </div>
                
                <div className={css.textContainer}>
                    <div className={css.courseName}>
                        <h4 className={css.name}>{props.course.name}</h4>
                    </div>
                    <div className={css.description}>
                        <div>{props.course.description.length > 0 ? props.course.description : "-"}</div>
                    </div>
                </div>
                <div className={css.otherInfoContainer}>
                    <div className={css.created}>
                        <h6>{getFormatedDate(props.course.created)}</h6>
                    </div>
                    <div className={css.creator}>
                        
                    </div>
                </div>
                
            </NavLink>

            <div className={css.buttons}>
                <div className={css.deleteIcon} onClick={() => {console.log(deleting); setDeletingState(true);}}>
                    <FaXmark />
                </div>
                <div className={css.editIcon} onClick={() => setEditingState(true)}>
                    <PiGearFineBold />
                </div>
            </div>
            {
            
            deleting && <DeleteCoursePopup 
                onDelete={() => {
                    setDeletingState(false); 
                    successToast("Курс удалён")
                    props.onDelete(courseId)}
                } 
                onCancel={() => setDeletingState(false)}/>}
            {
            
            editing && <EditCoursePopup 
                course={props.course} 
                onSubmit={(data) => {
                    setEditingState(false); 
                    successToast("Данные изменены")
                    props.onEdit()}
                } 
                onCancel={() => setEditingState(false)}/>
            }
            
            {
                /* <div className={css.courseItemCollapser} onClick={onItemClick}>
                    {isCollapsed ? <FaCaretDown /> : <FaCaretUp style={{color: "var(--palette-4-5)"}} />}
                </div>
                
                {!isCollapsed && <AdminSectionsList courseId={courseId} />} */
            }
        </div>
    )
}

export default AdminCoursesListItem