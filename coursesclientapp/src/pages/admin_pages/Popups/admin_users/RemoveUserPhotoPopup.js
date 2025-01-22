import { GiCheckMark, GiCrossMark } from "react-icons/gi"
import css from "../Popup.module.css"
import { useState } from "react"

const RemoveUserPhotoPopup = (props) => {
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
                    <h4>Удалить аватар пользователя?</h4>
                </div>
                <div className={css.buttonsBottom}>
                    <GiCheckMark className={`${css.okMark} ${css.deleteOkMark}`} onClick={() => submit()}/>
                    <GiCrossMark className={`${css.crossMark}`} onClick={() => cancel()}/>
                </div>
            </div>
        </div>)
}

export default RemoveUserPhotoPopup