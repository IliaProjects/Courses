import React, { useEffect, useRef, useState } from "react";
import css from "../Popup.module.css"
import Toastr from "../../../../things/Toastr";
import { BiSolidBookAdd } from "react-icons/bi";
import { GiCrossMark } from "react-icons/gi";
import { MdMonochromePhotos } from "react-icons/md";

const OrderPopup = (props) => {    
    const [name, setName] = useState(false)
    const [email, setEmail] = useState(false)
    const [phone, setPhone] = useState(false)
    const [message, setMessage] = useState(false)

    const [hiding, setHiding] = useState(false)
    const hide = () => {
        setHiding(true)
        setTimeout(() => {
            props.onClose()
        }, 450)
    }

    return(
        <div className={`${css.popupBackground} ${!hiding ? css.show : css.hide}`}>
            <Toastr />
            <div className={`${css.popup} ${css.orderPopup}`}>
                <div className={css.popupHeader}>
                    <div className={css.title}>
                        {/* <div className={css.titleIcon}>
                            <BiSolidBookAdd />
                        </div> */}
                        <h4>Оставьте ваши данные, и мы с вами свяжемся</h4>
                    </div>

                    <div className={css.buttons}>
                        <div className={`${css.button} ${css.cross}`} onClick={(e) => {hide()}}>              
                            <GiCrossMark className={css.crossMark}/>
                        </div>
                    </div>
                </div>
                <form className={css.orderForm}>
                    <textarea cols="30" rows="1" placeholder="* Эл. почта" onChange={(e) => setEmail(e.target.value)}/>
                    <textarea cols="30" rows="1" placeholder="* Ваше имя" onChange={(e) => setName(e.target.value)}/>
                    <textarea cols="30" rows="1" placeholder="  Тел. номер" onChange={(e) => setPhone(e.target.value) }/>
                    <textarea cols="30" placeholder="* Ваше сообщение" onChange={(e) =>{
                        e.target.style.height = 'auto'
                        e.target.style.height = e.target.scrollHeight + "px"
                        setMessage(e.target.value)
                    }}/>
                </form>
                <div className={css.orderButton}>
                    <span>Оставить заявку</span>
                </div>
            </div>
        </div>
    )
}

export default OrderPopup