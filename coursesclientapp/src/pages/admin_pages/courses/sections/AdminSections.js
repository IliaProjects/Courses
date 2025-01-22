import React, { useEffect, useState } from "react"
import { NavLink, Route, Routes, useParams } from "react-router-dom"
import AdminSectionsList from "./AdminSectionsList"
import { getCourseSections } from "../../../../api/SectionsApi"
import css from "./AdminSections.module.css"
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa6"
import { PiBooksFill } from "react-icons/pi"
import AddSectionPopup from "../../Popups/admin_sections/AddSectionPopup"
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { SortCoursesByEnum } from "../../../../classes/Enums"
import Toastr, { successToast } from "../../../../things/Toastr"

const AdminSections = (props) => {
    const [collapsed, setCollapsed] = useState(false)

    const [adding, setAddingState] = useState(false)
    const [trigger, setTrigger] = useState(false);

    const [sortBy, setSortBy] = useState(SortCoursesByEnum.NameInc)

    useEffect(() => {
        if(collapsed) {
            props.onCollapsed()
        }
    }, [collapsed])

    useEffect(() =>
        setCollapsed(false),
    [props.collapseTrigger])

    return(
        <div className={`${css.adminSectionsContainer} ${collapsed && css.collapsed}`}>
            <Toastr />
            <div className={css.header}>
                <div className={css.collapser} onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ?
                        <FaCaretDown /> :
                        <FaCaretUp />
                    }
                </div>
                <div className={css.headerTitle}>
                    <h3>Разделы курса</h3>
                </div>
                <div className={css.clickIcons}>
                    { !collapsed && <FaPlus onClick={() =>{ setAddingState(true)}} className={adding && "active"} /> }
                </div>
                    { !collapsed && 
                    <div className={css.sorter}>
                        <div className={css.text}>
                            <span>{sortBy.Text}</span>
                            <FaCaretDown />
                        </div>
                        <div className={css.dropdown}>
                            <span onClick={() => setSortBy(SortCoursesByEnum.NameInc)}>{SortCoursesByEnum.NameInc.Text}</span>
                            <span onClick={() => setSortBy(SortCoursesByEnum.NameDec)}>{SortCoursesByEnum.NameDec.Text}</span>
                            <span onClick={() => setSortBy(SortCoursesByEnum.DateInc)}>{SortCoursesByEnum.DateInc.Text}</span>
                            <span onClick={() => setSortBy(SortCoursesByEnum.DateDec)}>{SortCoursesByEnum.DateDec.Text}</span>
                        </div>
                    </div>
                    }                
            </div>
            {adding && <AddSectionPopup courseId={props.courseId}
                onClose={() => {
                    setAddingState(false); 
                }} 
                onAdd={() => {
                    setAddingState(false);
                    successToast("Раздел добавлен"); 
                    setTrigger(!trigger)
                }}
            />}
                {!collapsed && <AdminSectionsList courseId={props.courseId} initTrigger={trigger} collapsed={collapsed} sortBy={sortBy} />}
        </div>
    )
}

export default AdminSections