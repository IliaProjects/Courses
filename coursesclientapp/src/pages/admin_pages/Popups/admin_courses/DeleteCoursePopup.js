import React, { useState } from "react"
import css from "../Popup.module.css"
import { GiCheckMark } from "react-icons/gi"
import { GiCrossMark } from "react-icons/gi"
import { MdDeleteSweep } from "react-icons/md";

const DeleteCoursePopup = (props) => {
    const [hiding, setHiding] = useState(false)
    const submit = () => {
        setHiding(true)
        setTimeout(() => {
            props.onDelete()
        }, 450)
    }
    const cancel = () => {
        setHiding(true)
        setTimeout(() => {
            props.onCancel()
        }, 450)
    }
    return(<div className={`${css.popupBackground} ${!hiding ? css.show : css.hide}`}>
        <div className={css.popup}>
            <div className={css.popupHeader}>
                <div className={css.title}>
                    <div className={css.titleIcon}>
                        <MdDeleteSweep />
                    </div>
                    <h4>Удалить курс?</h4>
                </div>
                <div className={css.buttons}>
                    <div className={`${css.button} ${css.deleteOk}`} onClick={submit}>                
                        <GiCheckMark className={`${css.deleteOkMark}`}/>
                        </div>
                    <div className={`${css.button} ${css.cross}`} onClick={cancel}>              
                        <GiCrossMark className={`${css.deleteCrossMark}`}/>
                    </div>
                </div>
            </div>
            <div className={css.deleteWarning}>Все разделы курса и уроки будут также удалены</div>
        </div>
    </div>)
}

export default DeleteCoursePopup