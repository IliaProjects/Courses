import React, { useRef } from "react";
import css from "./RoleIcon.module.css"
import { SortCoursesByEnum, SortTypeEnum, SortUsersByEnum } from "../classes/Enums";
import { FaCaretDown } from "react-icons/fa6";
import { RiUserLine, RiUserSettingsLine, RiUserStarLine } from "react-icons/ri";
import { isAdmin, isDirector, isUser } from "../classes/RoleHelper";

const RoleIcon = (props) => {

        return(
            <div className={css.roleContainer}>
                {
                isUser(props.roleEnum) ?
                    <RiUserLine className={css.user} /> :
                    isAdmin(props.roleEnum) ?
                        <RiUserSettingsLine className={css.admin} /> :
                        isDirector(props.roleEnum) &&
                            <RiUserStarLine className={css.director}/>
                }
                { 
                isUser(props.roleEnum) ?
                    <text>Пользователь</text> :
                    isAdmin(props.roleEnum) ?
                    <text>Админ</text> :
                        isDirector(props.roleEnum) &&
                        <text>Директор</text>
                }
            </div>)
}

export default RoleIcon