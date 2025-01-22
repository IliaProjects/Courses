import React, { useRef } from "react";
import css from "./Sorter.module.css"
import { SortCoursesByEnum, SortTypeEnum, SortUsersByEnum } from "../classes/Enums";
import { FaCaretDown } from "react-icons/fa6";

const Sorter = (props) => {
    const dropdown = useRef()

    if (props.sortType == SortTypeEnum.Courses)
        return(
        <div className={css.sorterWrapper}>
            <div className={css.sorter}>
                <div className={css.text}>
                    <span>{props.sortBy.Text}</span>
                    <FaCaretDown />
                </div>
                <div className={css.dropdown} ref={dropdown}>
                    <span onClick={() => props.setSortBy(SortCoursesByEnum.NameInc)}>{SortCoursesByEnum.NameInc.Text}</span>
                    <span onClick={() => props.setSortBy(SortCoursesByEnum.NameDec)}>{SortCoursesByEnum.NameDec.Text}</span>
                    <span onClick={() => props.setSortBy(SortCoursesByEnum.DateInc)}>{SortCoursesByEnum.DateInc.Text}</span>
                    <span onClick={() => props.setSortBy(SortCoursesByEnum.DateDec)}>{SortCoursesByEnum.DateDec.Text}</span>
                </div>
            </div>
        </div>)

    if (props.sortType == SortTypeEnum.Users)
        return(
        <div className={css.sorterWrapper}>
            <div className={css.sorter}>
                <div className={css.text}>
                    <span>{props.sortBy.Text}</span>
                    <FaCaretDown />
                </div>
                <div className={css.dropdown} ref={dropdown}>
                    <span onClick={() => props.setSortBy(SortUsersByEnum.NameInc)}>{SortUsersByEnum.NameInc.Text}</span>
                    <span onClick={() => props.setSortBy(SortUsersByEnum.NameDec)}>{SortUsersByEnum.NameDec.Text}</span>
                    <span onClick={() => props.setSortBy(SortUsersByEnum.RegDateInc)}>{SortUsersByEnum.RegDateInc.Text}</span>
                    <span onClick={() => props.setSortBy(SortUsersByEnum.RegDateDec)}>{SortUsersByEnum.RegDateDec.Text}</span>
                    <span onClick={() => props.setSortBy(SortUsersByEnum.LastSeenDateInc)}>{SortUsersByEnum.LastSeenDateInc.Text}</span>
                    <span onClick={() => props.setSortBy(SortUsersByEnum.LastSeenDateDec)}>{SortUsersByEnum.LastSeenDateDec.Text}</span>
                </div>
            </div>
        </div>)
}

export default Sorter