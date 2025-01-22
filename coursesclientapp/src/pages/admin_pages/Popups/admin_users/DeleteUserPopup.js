import React, { useRef } from "react"
import "../../Admin.css"
import css from '../Popup.module.css'
import { GiCheckMark } from "react-icons/gi"
import { GiCrossMark } from "react-icons/gi"
import { FaUserMinus } from "react-icons/fa"

const DeleteUserPopup = (props) => {
    const inp = useRef()
    return(
        <div className={css.popupBackground}>
            <div className={css.popup}>
                <div className={css.popupHeader}>
                    <div className={css.title}>
                        <div className={css.titleIcon}>
                            <FaUserMinus />
                        </div>
                        <h4>Удалить пользователя?</h4>
                    </div>
                    <div className={css.buttons}>
                        <div className={`${css.button} ${css.deleteOk}`} onClick={() => {inp.current.value.toUpperCase() == "Удалить".toUpperCase() && props.onDelete()}} >        
                            <GiCheckMark className={css.deleteOkMark}/>
                        </div>
                        <div className={`${css.button} ${css.cross}`} onClick={() => props.onCancel()}>          
                            <GiCrossMark className={css.deleteCrossMark}/>
                        </div>
                    </div>
                </div>
                
                <div className={css.deleteUserConfirmation}>
                    <span>Наберите <p>Удалить</p> в поле ввода</span>
                    <input autoFocus ref={inp}/>
                </div>
            </div>
        </div>
        
        // <div className="popup-background">
        //     <div className="popup">
        //         <div className="popup-title">
        //             <FaUserMinus />
        //             <h4>Удалить пользователя?</h4>
        //         </div>
                
        //         <div className="written-delete-confirmation">
        //             <span>Напишите <p>Удалить</p> в поле ввода, затем нажмите галочку</span>
        //             <input autoFocus ref={inp}/>
        //         </div>
        //         <div className="buttons">
        //             <GiCheckMark className="ok-mark" onClick={() => {inp.current.value.toUpperCase() == "Удалить".toUpperCase() && props.onDelete()}} />
        //             <GiCrossMark className="cancel-mark" onClick={() => props.onCancel()}/>
        //         </div>
        //     </div>
        // </div>
    )
}

export default DeleteUserPopup