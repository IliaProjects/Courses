import React, { useState } from "react"
import css from "../Popup.module.css"
import { IoIosPersonAdd } from "react-icons/io"
import { GiCheckMark } from "react-icons/gi"
import { GiCrossMark } from "react-icons/gi"
import axios from "axios"
import Cookies from "js-cookie"

const DeletePhotoPopup = (props) => {

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
    return(
        <div className={`${css.popupBackground} ${!hiding ? css.show : css.hide}`}>
            <div className={css.popup}>
                <div className={css.title}>
                    <h4>Удалить фотографию?</h4>
                </div>
                <div className={css.buttonsBottom}>
                    <GiCheckMark className={css.deleteOkMark} onClick={() => submit()}/>
                    <GiCrossMark className={css.deleteCrossMark} onClick={() => cancel()}/>
                </div>
            </div>
        </div>)
}

export default DeletePhotoPopup