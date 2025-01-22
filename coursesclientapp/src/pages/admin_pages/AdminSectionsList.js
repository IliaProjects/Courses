import React, { useEffect, useState } from "react";
import css from './AdminSectionsList.module.css'
import { getCourseSections } from "../../api/SectionsApi";
import {AdminSectionItem} from "./AdminSectionItem";
import { InsertSectionItem} from "./AdminSectionItem";
import { FaPlus } from "react-icons/fa6";

const AdminSectionsList = (props) => {
    const [sections, setSections] = useState(null);
    const [adding, setAddingState] = useState(false)
    
    const Init = () => {
        getCourseSections(props.courseId, (data) => setSections(data))
    }

    useEffect(() => {
        Init()    
    }, []);

    useEffect(() => {
        if(!adding)
            Init()
    }, [adding]);
    
    return(
        <div className={css.list}>
            <div className={css.listHeader}>
                <div className={css.title}>
                    <h4>Разделы</h4>
                </div>
                <div className={css.tools}>
                    <FaPlus className={css.adder} onClick={() => setAddingState(true)}/>
                </div>
            </div>
            <div className={css.listBody}>
                {adding && <InsertSectionItem courseId={props.courseId} onAdded={() => setAddingState(false)}/>}
                {
                    sections != null &&
                    sections.map(el => (
                        <AdminSectionItem key={el.id} section={el} onInit={Init} type="show" />
                    ))
                }
            </div>
        </div>
    )
}

export default AdminSectionsList