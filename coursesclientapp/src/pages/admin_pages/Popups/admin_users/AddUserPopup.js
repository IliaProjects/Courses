import React, { useRef, useState } from "react";
import "../../Admin.css"
import { IoIosPersonAdd } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import ApiUrl from "../../../../api/ApiUrl";
import css from "../Popup.module.css"
import { GiCheckMark } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";
import '../Checkbox.css';
import Toastr, { errorToast } from "../../../../things/Toastr";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaMobileRetro } from "react-icons/fa6";
import { isInDirectorRole } from "../../../../classes/RoleHelper";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";

const baseUrl = ApiUrl + "Users/Post"

const AddUserPopup = (props) => {

    const [emailName, setEmailName] = useState(null)
    const [emailDomain, setEmailDomain] = useState(null)

    const [password, setPassword] = useState(null)
    const [name, setName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [phoneNr, setPhoneNr] = useState(null)
    const [admin, setAdmin] = useState(false)

    const submitBtn = useRef()

    const submit = () => {
        var then = true;
        if (checkEmail() && 
            checkName() &&
            checkPassword() &&
            checkPhoneNr()){

            axios.post(baseUrl,
                {
                    "email": emailName + "@" + emailDomain,
                    "password": password,
                    "name": lastName,
                    "firstName": name,
                    "phoneNr": phoneNr,
                    "roleEnum": admin ? 1 : 0
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('token'),
                    }
                }
            )
            .catch((e) =>
            {   
                console.log(e);
                errorToast("Ошибка. Вероятно, эл. адрес уже существует")
                then = false;
            })
            .then((e) =>
            {   
                if(then) {
                    props.onAdd();
                }
            })
        }
        else {
            errorToast("Заполните необходимые поля")
        }
    }

    const checkEmail = () => {
        return(
            emailName && 
            emailName.length > 0 && 
            emailDomain && 
            emailDomain.includes(".") &&
            emailDomain.length > 2 &&
            emailDomain.split(".")[0].length > 0 &&
            emailDomain.split(".")[1].length > 0
        )
    }

    const checkPassword = () => {
        return(password && password.length > 5)
    }

    const checkPhoneNr = () => {
        return(phoneNr && phoneNr.length > 11)
    }

    const checkName = () => {
        return(lastName && lastName.length > 2)
    }
    
    const [hiding, setHiding] = useState(false)
    const hide = () => {
        setHiding(true)
        setTimeout(() => {
            props.onCancel()
        }, 450)
    }
    return (
        <div className={`${css.popupBackground} ${!hiding ? css.show : css.hide}`}>
            <Toastr/>
            <div className={`${css.popup} ${css.addUser}`}>
                <div className={css.popupHeader}>
                    <div className={css.title}>
                        <div className={css.titleIcon}>
                            <IoIosPersonAdd />
                        </div>
                        <h4>Добавить пользователя</h4>
                    </div>

                    <div className={css.buttons}>
                        <div className={`${css.button} ${css.ok}`} onClick={() => {console.log(submitBtn); submitBtn.current.click()}}>                
                            <GiCheckMark className={css.okMark}/>
                        </div>
                        <div className={`${css.button} ${css.cross}`} onClick={(e) => {hide()}}>              
                            <GiCrossMark className={css.crossMark}/>
                        </div>
                        
                        <input style={{display: 'none'}} ref={submitBtn} type="submit"  form="form" onClick={(e) => {
                            e.preventDefault();
                            submit();
                        }}/>

                    </div>



                </div>
                <form id="form">
                    <div className={css.inputContainer}>
                        <div className={css.emailInputWrapper}>
                            <div className={`${css.inputWrapper}`}>
                                <div className={css.iconWrapper}>
                                    <IoIosMail/>
                                </div>
                                <input type="text" placeholder="example" onChange={(e) =>  setEmailName(e.target.value)}/>
                                <span>@</span>
                                <input type="text" placeholder="example.com"  onChange={(e) =>  setEmailDomain(e.target.value)}/>
                            </div>
                        </div>
                        <div className={`${css.indicator} ${checkEmail() && css.ok}`}>
                            {!checkEmail() ?
                                <ImCross/> :
                                <FaCheck />
                            }
                        </div>
                    </div>
                    <div className={css.inputContainer}>
                        <div className={css.inputWrapper}>
                            <div className={css.iconWrapper}>
                                <RiLockPasswordLine/>
                            </div>
                            <input maxlength="24" type="password" placeholder="*" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className={`${css.indicator} ${checkPassword() && css.ok}`}>
                            {!checkPassword() ?
                                <ImCross/> :
                                <FaCheck />
                            }
                        </div>
                    </div>
                    <div className={css.inputContainer}>
                        <div className={css.inputWrapper}>
                            <div className={css.iconWrapper}>
                                <FaMobileRetro/>
                            </div>
                            <input 
                                pattern="[0-9]*" 
                                maxlength="12" 
                                type="tel" 
                                placeholder="*" 
                                value={phoneNr ? "+373" + phoneNr.replace("+373", "") : "+373"} 
                                onChange={
                                    (e) => {
                                        
                                        setPhoneNr(
                                            "+373" + 
                                            e.target.value
                                            .substring(4, e.target.value.length)
                                            .replace(/[^0-9]/g, ''))
                                    }
                                }
                            />
                        </div>
                        <div className={`${css.indicator} ${checkPhoneNr() && css.ok}`}>
                            {!checkPhoneNr() ?
                                <ImCross/> :
                                <FaCheck />
                            }
                        </div>
                    </div>
                    <div className={css.inputContainer}>
                        <div className={css.inputWrapper}>
                            <div className={css.iconWrapper}>
                                <span>И</span>
                            </div>
                            <input maxlength="16" type="text" placeholder="*" onChange={(e) => setLastName(e.target.value)}/>
                        </div>
                        <div className={`${css.indicator} ${checkName() && css.ok}`}>
                            {!checkName() ?
                                <ImCross/> :
                                <FaCheck />
                            }
                        </div>
                    </div>
                    <div className={css.inputContainer}>
                        <div className={css.inputWrapper}>
                            <div className={css.iconWrapper}>
                                <span>Ф</span>
                            </div>
                            <input maxlength="16" type="text" placeholder="" onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className={css.indicator}>
                            {/* <ImCross/> */}
                        </div>
                    </div>
                    {
                    isInDirectorRole(Cookies.get('roleEnum')) &&
                    <div className={css.checkBoxWrapper}> 
                        <div className="checkbox-wrapper-1">
                            <input checked={admin} onChange={e => setAdmin(e.target.checked)} id="example-1" class="substituted" type="checkbox" aria-hidden="true" />
                            <label for="example-1"><span>Администратор сайта</span></label>
                        </div>
                    </div>
                    }
                </form>
            </div>
        </div>
    );

}

export default AddUserPopup