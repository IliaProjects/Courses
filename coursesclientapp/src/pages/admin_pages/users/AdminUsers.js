import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import Logout from "../../../classes/Logout";
import Loading from "../../user_pages/Loading";
import { FaMagnifyingGlass } from "react-icons/fa6";
import AddUserPopup from "../Popups/admin_users/AddUserPopup";
import { FaPlus } from "react-icons/fa6";
import { FaUserCircle, FaUserEdit, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { RiOilLine, RiUserSearchFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { TbPhotoCircleMinus } from "react-icons/tb";
import css from "./AdminUsers.module.css"
import { deleteUser, getAllUsers, putUser, searchUsers } from "../../../api/UsersApi";
import ImageHelper from "../../../classes/ImageHelper";
import { FaSquarePhoneFlip } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BsPassport } from "react-icons/bs";
import DeleteUserPopup from "../Popups/admin_users/DeleteUserPopup";
import toast, { Toaster } from "react-hot-toast";
import Toastr, { errorToast, successToast } from "../../../things/Toastr";
import { getFormatedDate, getShortedDate, getShortedTime, onlineNever, onlineNow, wasOnlineString } from "../../../classes/DateHelper";
import { RiUserLine } from "react-icons/ri";
import { RiUserSettingsLine } from "react-icons/ri";
import { RiUserStarLine } from "react-icons/ri";
import { isAdmin, isDirector, isUser } from "../../../classes/RoleHelper";
import Paginator from "../../../components_common/Paginator";
import CheckBox from "../../../things/CheckBox";
import Sorter from "../../../things/Sorter";
import { SortCoursesByEnum, SortTypeEnum, SortUsersByEnum } from "../../../classes/Enums";
import RemoveUserPhotoPopup from "../Popups/admin_users/RemoveUserPhotoPopup";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import RoleIcon from "../../../things/RoleIcon";
import { IoIosRadio } from "react-icons/io";
import { BiSolidUserPlus } from "react-icons/bi";

const AdminUsers = (props) => {
    const [searching, setSearching] = useState(false)
    const [searchingRow, setSearchingRow] = useState("")
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)

    const [adminsFirst, setAdminsFirst] = useState(true)
    const [users, setUsers] = useState(null)
    const [pager, setPager] = useState(null)
    const [page, setPage] = useState(1)
    
    const [searchingUsers, setSearchingUsers] = useState(null)
    const [searchPager, setSearchPager] = useState(null)
    const [searchPage, setSearchPage] = useState(null)

    const [sortBy, setSortBy] = useState(SortUsersByEnum.NameInc)



    useEffect(() => {
        if(searching)
            setSearchPage(0)
        else
            setPage(0)
    }, [adminsFirst])

    useEffect(() => {
        if(searching)
            setSearchPage(0)
        else
            setPage(0)
    }, [sortBy])

    useEffect(() => {
        if(searching) {
            setSearchPage(0);
        }
    }, [searching])

    useEffect(() => {
        if(searchingRow != null) {
            setSearchPage(0)
        }
    }, [searchingRow])

    useEffect(() => {
        if(searchPage != null) 
            if(searchPage > 0) {
                if(searchingRow == "")
                    imitateSearching()
                else
                    startSearchUsers()
            }
            else {
                setSearchPage(1)
            }
    }, [searchPage])

    useEffect(() => {
        if(page > 0)
            Init()
        else 
            setPage(1)
        
    }, [page])

    useEffect(() => {
        if(users != null) {
            setSearchingUsers(users)
            if(pager != null) {
                setLoading(false)
            }
        }
    }, [users])

    useEffect(() => {
        if(pager != null) {
            setSearchPager(pager)
            if(pager != null) {
                setLoading(false)
            }
        }
    }, [pager])

    const Init = () => {
        setLoading(true)
        getAllUsers(adminsFirst, sortBy.Enum, page, 
            (data) => {
                console.log(data);
                setUsers(data.users);
                setPager(data.pager);
            }
        )
    }

    const imitateSearching = () => {
        getAllUsers(adminsFirst, sortBy.Enum, searchPage, 
            (data) => { 
                setSearchingUsers(data.users);
                setSearchPager(data.pager);
            }
        )
    }

    const startSearchUsers = () => {
        var model = {
            Email: searchingRow,
            bEmailContains: true,
            Name: searchingRow,
            bName: true,
            LastName: searchingRow,
            bLastName: true,
            PhoneNr: searchingRow,
            bPhoneNr: true,
        }
        searchUsers(model, false, adminsFirst, sortBy.Enum, searchPage,
            (data) => {
                setSearchingUsers(data.users)
                setSearchPager(data.pager)
            }
        )
    }

    return(
        <div className={css.adminUsersContainer}>
        <Toastr />
            <div className={css.adminHeader}>
                <div className={css.hederTitle}>
                    <FaUsers />
                    <h3>Пользователи</h3>
                </div>
                <div className={css.hederClickIcons}>
                    {
                        searching && 
                        <input autoFocus type="text" onChange={
                            (e) =>{
                                setSearchingRow(e.target.value)
                            }
                        }/>
                    }
                    <RiUserSearchFill onClick={() => setSearching(!searching)} className={searching && css.active}/>
                    <FaUserPlus onClick={() => setAdding(true)} className={adding && css.active} />
                </div>
                
                <div className={css.headerSortingContainer}>
                
                    <CheckBox className={css.adminsFirstCheckbox} value={adminsFirst} onCheck={(e) => setAdminsFirst(e)}/>
                    <Sorter sortType={SortTypeEnum.Users} sortBy={sortBy} setSortBy={(e) => { setSortBy(e)}} />

                </div>
            </div>

            {
                adding && 
                <AddUserPopup onCancel={
                    () => setAdding(false)
                    } 
                    onAdd={() => {
                        setAdding(false);
                        successToast("Пользователь добавлен");
                        Init()
                    }}
                />
            }
            {
                loading ?
                <div className={`${css.usersList}`}>
                    <Loading/>
                </div>
            :
                <div className={`${css.usersList} ${adminsFirst && css.usersListSeparated}`}>
                { 
                    !searching ? 
                        users.map(el => (
                            <User key={el.id} user={el} onInit={() => Init()} />
                        )) : 
                        searchingUsers.map(el => (
                            <User key={el.id} user={el} onInit={() => Init()} />
                        ))
                }
                </div>
            }
            { 
            searching && searchUsers !== null ?
                <Paginator pager={searchPager} setPageNr={setSearchPage}/> :
                <Paginator pager={pager} setPageNr={setPage}/> 
            }
        </div>
    )
}

const User = (props) => {
    const [editable, setEditableState] = useState(true)

    const [itsMe, setItsMeState] = useState(false)

    const [photoEditable, setPhotoEditableState] = useState(true)
    const [deletingPhoto, setDeletingPhotoState] = useState(false)
    const [deleting, setDeletingState] = useState(false)
    
    const [editing, setEditingState] = useState(false)
    const [editedFirstName, setEditedFirstName] = useState(null)
    const [editedLastName, setEditedLastName] = useState(null)
    const [editedPhoneNr, setEditedPhoneNr] = useState(null)

    useEffect(() => {
        if(props.user.id == Cookies.get('id'))
            setItsMeState(true);
        let myRole = Cookies.get('roleEnum')
        let userRole = props.user.roleEnum
        if (isDirector(userRole))
            setEditableState(false)
        if (isAdmin(myRole))
            if (isAdmin(userRole) || isDirector(userRole))
                setEditableState(false)

        if(props.user.photo == null || props.user.photo == "")
            setPhotoEditableState(false)
    }, [])

    useEffect(() => {
        if(!editing) {
            setEditedFirstName(props.user.name)
            setEditedLastName(props.user.lastName)
            setEditedPhoneNr(props.user.phoneNr)
        }        
    }, [editing])

    useEffect(() => {
        if(itsMe)
            setEditableState(false);            
    }, [itsMe])

    const getRoleClassName = () => {
        if(isUser(props.user.roleEnum))
            return(`${css.userCard}`) 
            else if (isAdmin(props.user.roleEnum)) 
                return(`${css.adminCard}`)
                else if (isDirector(props.user.roleEnum))
                    return(`${css.directorCard}`)
    }

    const isEmptyRow = (e) => {
        return (e == null || e == "")
    }

    const checkPhoneNr = (e) => {
        debugger
        return editedPhoneNr.length == 12;
    }

    const checkLastName = (e) => {
        return editedLastName.length > 2
    }


    return(<div className={`${css.userItem} ${getRoleClassName()}`}>
        <div className={css.userRoleContainer}>
            <RoleIcon roleEnum={props.user.roleEnum}/>
        </div>
        <div className={css.photo}>
            {
                props.user.photo == null || props.user.photo == "" 
                    ? <FaUserCircle className={css.nullUserPhoto} /> 
                    : <img className={css.userPhotoImg} src={new ImageHelper(props.user.photo).getWithPrefix()}/>}
        </div>
        <div className={css.profData}>
            <div className={css.iconsColumn}>
                <div className={css.rowSpan2}><BsPassport/></div>
                <div className={css.rowSpan1} onClick={() => {
                        navigator.clipboard.writeText(props.user.phoneNr)
                        successToast(`Cкопировано: ${props.user.phoneNr}`)
                    }}><FaSquarePhoneFlip/></div>
                <div className={css.rowSpan1} onClick={() => {
                        navigator.clipboard.writeText(props.user.email)
                        successToast(`Cкопировано: ${props.user.email}`)
                    }}><MdEmail/></div>
            </div>
            <div className={css.valuesColumn}>
                { !editing ?
                    <div className={css.lastName}>{isEmptyRow(props.user.lastName) ? "-" : props.user.lastName}</div> :
                    <input autoFocus placeholder="Имя" 
                            value={editedLastName} 
                            onChange=
                            
                            
                            {
                                
                                (e) => {
                                setEditedLastName(e.currentTarget.value)}
                            } 
                            
                            />                
                }
                { !editing ?
                    <div className={css.firstName}>{isEmptyRow(props.user.name) ? "-" : props.user.name}</div> :
                    <input placeholder="Фамилия" value={editedFirstName} onChange={(e) => {setEditedFirstName(e.currentTarget.value)}} />                
                }
                { !editing ?
                    <div className={css.phoneNr}>{isEmptyRow(props.user.phoneNr) ? "-" : props.user.phoneNr}</div> :
                    <input maxLength="12" placeholder="Тел. номер" value={"+373"+ editedPhoneNr.replace("+373", "")} onChange={(e) => {
                            e.target.value.length > 3 && 
                            setEditedPhoneNr(
                                "+373" + 
                                e.target.value
                                    .substring(4, e.target.value.length)
                                    .replace(/[^0-9]+/g, '')
                                )
                    
                    }} />                
                }
                
                <div className={css.email}>{props.user.email}</div>
            </div>
        </div>
        
        <div className={css.userData}>
            <div className={css.labes}>
                <div className={css.icon}> {/* style={{color: '#00ff00'}} */}
                    <IoIosRadio />
                    {/* В сети: */}
                </div>
                <div className={css.icon}>
                    <BiSolidUserPlus />
                    {/* Создан: */}
                </div>
            </div>
            <div className={css.valuesColumn}>
                <div className={css.lastOnline}>{
                    itsMe ? 
                        <text className={css.onlineNow}>Это Вы</text>:
                        onlineNever(props.user.lastRequest, props.user.regDate) ?
                            <text className={css.onlineNever}>Не был(-а)</text> :
                            onlineNow(props.user.lastRequest) ?
                                <text className={css.onlineNow}>Онлайн</text> :
                                wasOnlineString(props.user.lastRequest, props.user.regDate)
                }</div>
                <div className={css.created}>{getShortedDate(props.user.regDate) + " " + getShortedTime(props.user.regDate)}</div>
            </div>
        </div>

        { !editing ? 
        <div className={css.buttons}>
            <div className={`${css.edit} ${editable && css.active}`} onClick={() => editable && setEditingState(true)}>
                <FaEdit />
            </div>
            <div className={`${css.deletePhoto} ${editable && photoEditable && css.active}`} onClick={() => (editable && photoEditable) && setDeletingPhotoState(true)}>
                <TbPhotoCircleMinus />
            </div>
            <div className={`${css.delete} ${editable && css.active}`} onClick={() => editable && setDeletingState(true)}>
                <FaUserMinus />
            </div>
        </div> :
        <div className={css.buttons}>
            <div className={`${css.okMark} ${css.active}`} onClick={() => { 
                if(checkLastName())
                    if(checkPhoneNr())
                        putUser({
                        userId: props.user.id,
                        bPhoneNr: true,
                        phoneNr: editedPhoneNr,

                        bName: true,
                        name: editedFirstName,

                        bLastName: true,
                        lastName: editedLastName,
                        }, () => {
                            setEditingState(false);
                            successToast("Данные изменены");
                            props.onInit();
                        })
                    else
                        errorToast("Неверный формат телефона")
                else
                    errorToast("Имя содержит менее 3 смволов")
            }}>
                <GiCheckMark />
            </div>
            <div className={`${css.crossMark} ${css.active}`} onClick={() => setEditingState(false)}>
                <GiCrossMark />
            </div>
        </div>
        }
        {
            deleting &&
            <DeleteUserPopup onCancel = {() => setDeletingState(false)} onDelete = {() =>
                deleteUser(props.user.id,
                    () => {
                        setDeletingState(false);
                        successToast("Пользователь удалён");
                        props.onInit();
                    }
                )
            }/>
        }
        {
            deletingPhoto &&
            <RemoveUserPhotoPopup onCancel = {() => setDeletingPhotoState(false)} onDelete = {() =>
                putUser({
                    userId: props.user.id,
                    
                    bPhoto: true,
                    photo: ""
                }, () => {
                        setDeletingState(false);
                        successToast("Фото удалено");
                        props.onInit();
                    }
                )
            }/>
        }
    </div>)
}

export default AdminUsers