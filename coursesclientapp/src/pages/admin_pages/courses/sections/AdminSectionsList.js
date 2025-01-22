import React, { useEffect, useRef, useState } from "react"
import css from "./AdminSections.module.css"
import ImageHelper from "../../../../classes/ImageHelper"
import { MdMonochromePhotos } from "react-icons/md"
import { FaXmark } from "react-icons/fa6"
import { PiGearFineBold } from "react-icons/pi"
import { changeOrder, deleteSection, getCourseSections } from "../../../../api/SectionsApi"
import { MdMoreHoriz } from "react-icons/md";
import DeleteSectionPopup from "../../Popups/admin_sections/DeleteSectionPopup"
import EditSectionPopup from "../../Popups/admin_sections/EditSectionPopup"
import Toastr, { successToast } from "../../../../things/Toastr"
import { PiArrowFatLineDownFill } from "react-icons/pi";
import { PiArrowFatLineUpFill } from "react-icons/pi";
import { NavLink } from "react-router-dom"

const AdminSectionsList = (props) => {
    const [sections, setSections] = useState(null)
    const [pager, setPager] = useState(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (page < 1)
        {
            setSections(null)
            setPage(1)
        }
        else
            Init();
    }, [page])

    useEffect(() => {
        setPage(0)
    }, [props.initTrigger]);

    useEffect(() => {
        setPage(0)
    }, [props.sortBy]);

    const Init = () => {
            getCourseSections(
                {
                    'bCourseId': true, 
                    'courseId': props.courseId
                }, props.sortBy, page, (data) => {
                    setPager(data.pager)
                    setSections(sections == null ? data.sections : sections.concat(data.sections))
                }
        )
    }

    const nextPage = () => {
        if(page === pager.currentPage && page < pager.totalPages) {
            setPage(page+1);
        }
    }

    return(sections != null &&
        <div className={css.adminSectionsList}>
            {sections.map 
                (el => 
                    (
                        el.name == "default" &&
                        <DefaultSectionItem key={el.id} section={el}/>
                    )
                )
            }
            {sections.map
                (el => 
                    (
                        el.name != "default" &&
                        <SectionItem key={el.id} section={el} onInit={() => setPage(0)}/>
                    )                   
                )
            }
            { 
            page < pager.totalPages &&
            <div className={css.showMore} onClick={nextPage}>
                <MdMoreHoriz />
            </div>
            }
        </div>
    )
}


const SectionItem = (props) => {
    const [deleting, setDeletingState] = useState(false)
    const [editing, setEditingState] = useState(false)

    //для класса изображения
    const [horisontal, setHorisontal] = useState(false)
    useEffect(() => {
        console.log(deleting)
    },[deleting])
    var img = new Image()
    img.onload = () => {
        img.width > img.height && setHorisontal(true)
    }
    img.src = new ImageHelper(props.section.image).getWithPrefix()

    const reorder = (id, position) => {
        changeOrder({
            sectionId: id,
            position: position
        }, props.onInit)
    }

    return (
        <div className={css.item}>
            <div className={css.sectionChangeOrderButtons}>
                <div className={css.buttonWrapper} onClick={() => reorder(props.section.id, -1)}>
                    <PiArrowFatLineUpFill />
                </div>
                <div className={css.buttonWrapper} onClick={() => reorder(props.section.id, 1)}>
                    <PiArrowFatLineDownFill />
                </div>
            </div>
            <div className={css.imageContainer}>
                {
                    props.section.image.length > 0 ?
                        <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(props.section.image).getWithPrefix()}/>:
                        <MdMonochromePhotos className={css.noPhoto} />
                }
            </div>
            <NavLink className={css.textContainer} to={`/admin/courses/lessons/${props.section.id}`}>
                <div className={css.name}>
                    <text>
                        {props.section.name}
                    </text>
                </div>
                <div className={css.description}>
                    <text>
                        {props.section.description}
                    </text>
                </div>
            </NavLink>
            <div className={css.sectionEditButtons}>
                <div className={css.delete} onClick={() => {setDeletingState(true)}}>
                    <FaXmark />
                </div>
                <div className={css.edit} onClick={() => {setEditingState(true)}}>
                    <PiGearFineBold />
                </div>
            </div>
            {deleting && <DeleteSectionPopup 
                onDelete={() => deleteSection(props.section.id, () => {setDeletingState(false);
                    successToast("Раздел удалён"); 
                    props.onInit()})} 
                onCancel={() => setDeletingState(false)} />}
            {editing &&
                <EditSectionPopup section={props.section} onCancel={() => setEditingState(false)} 
                onSubmit={() => {
                    successToast("Раздел изменён")
                    props.onInit()}}/>
            }
            
        </div>
    )
}

const DefaultSectionItem = (props) => {

    //для класса изображения
    const [horisontal, setHorisontal] = useState(false)

    var img = new Image()
    img.onload = () => {
        img.width > img.height && setHorisontal(true)
    }
    img.src = new ImageHelper(props.section.image).getWithPrefix()

    return (
        <div className={`${css.defaultItem} ${css.item}`}>
            <Toastr/>
            <div className={css.imageContainer}>
                {
                    props.section.image.length > 0 ?
                        <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(props.section.image).getWithPrefix()}/>:
                        <MdMonochromePhotos className={css.noPhoto} />
                }
            </div>
            <NavLink className={css.textContainer} to={`/admin/courses/lessons/${props.section.id}`}>
                <div className={css.name}>
                    <text>
                        ОБЩИЙ РАЗДЕЛ КУРСА
                    </text>
                </div>
                <div className={css.description}>
                    <text>
                        Раздел, невидимый для пользователя. Уроки, добавленные в этот раздел, видны как уроки без раздела
                    </text>
                </div>
            </NavLink>
        </div>
    )
}

export default AdminSectionsList