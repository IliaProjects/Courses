import { useEffect, useState } from "react"
import css from "./AdminCourseProfile.module.css"
import { getCourse, putCourse } from "../../../api/CoursesApi"
import ImageHelper from "../../../classes/ImageHelper"
import { MdMonochromePhotos } from "react-icons/md"
import { getFormatedDate } from "../../../classes/DateHelper"
import { getUser } from "../../../api/UsersApi"
import { FaCaretUp, FaUserCircle } from "react-icons/fa"
import { BsPersonGear } from "react-icons/bs"
import { PiGearFineBold } from "react-icons/pi"
import { FaCaretDown, FaPlus } from "react-icons/fa6"
import { GiCrossMark } from "react-icons/gi";
import { GiCheckMark } from "react-icons/gi";
import { putSection } from "../../../api/SectionsApi"
import { BiShow } from "react-icons/bi";
import CoursesAccessControlPopup from "../Popups/admin_courses/CoursesAccessControlPopup"
import Toastr, { errorToast, successToast } from "../../../things/Toastr"

const AdminCourseProfile = (props) => {
    const [course, setCourse] = useState(null)
    const [editingName, setEditingName] = useState(null)
    const [editingDescription, setEditingDescription] = useState(null)
    const [editingImage, setEditingImage] = useState(null)
    const [creator, setCreator] = useState(null)

    const [controllingAccess, setControllingAccess] = useState(false)
    const [editing, setEditingState] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [collapsing, setCollapsing] = useState(false)
    //для класса изображения
    const [horisontal, setHorisontal] = useState(false)

    useEffect(() => {
        if (course != null) { 
            var img = new Image()
            img.onload = () => {
                img.width > img.height && setHorisontal(true)
            }
            img.src = new ImageHelper(course.image).getWithPrefix()
            getUser(course.uploaderId, (data) => {
                setCreator(data)
            })
        }
    }, [course])
    
    // useEffect(() => {

    //     setCollapsing(true)
    // }, [controllingAccess])

    useEffect(() =>
       Init(),
    [])

    useEffect(() =>
        {
            if(collapsing) 
                if(collapsed)
                    setCollapsed(false)
                else 
                    setTimeout(() => setCollapsed(true), 0)
        },
    [collapsing])

    useEffect(() =>
        setCollapsed(false),
    [props.collapseTrigger])

    useEffect(() =>{
        if(editing) {
            setCollapsed(false)
            setEditingName(course.name);
            setEditingImage(course.image);
            setEditingDescription(course.description);
        }},
    [editing])

    useEffect(() =>{
        if(collapsed) {
            setEditingState(false)
            props.onCollapsed()
        }
        setCollapsing(false)},
    [collapsed])

    const Init = () => {
        getCourse(
            props.courseId, 
            (data) => {
                setCourse(data)
            }
        )
    }

    const checkName = () => {
        return editingName.length > 0
    }

    const showOnMain = () => {
        putCourse({
            courseId: course.id,
            bPublishOnMain: true
        }, () => {
            Init()
        })
    }

    return (<div className={css.courseProfileContainer}>
        <Toastr/>
        <div className={css.collapserContainer}>
            <div className={`${css.collapser} ${!collapsed && css.extended}`} onClick={() => setCollapsing(true)}>
                {collapsed ?
                    <FaCaretDown /> :
                    <FaCaretUp />
                }
            </div>
            {course != null && collapsed &&
            <text>
                {course.name}
            </text>}
            {collapsed &&
            <div className={css.editButtons}>
                <PiGearFineBold onClick={() => setEditingState(true)}/>
                <BsPersonGear onClick={() => {setControllingAccess(true)}}/>
                <BiShow className={course.publishOnMain && css.redButton} onClick={() => showOnMain()}/>
            </div>}
        </div>
        {course != null && !collapsed &&
            <div className={`${css.courseProfile} ${collapsing && css.exit}`}>
                <div className={css.mainInfo}>
                    <div className={css.imageContainer}>
                        {
                            course.image.length < 1 ? 
                                <MdMonochromePhotos className={css.courseNoPhoto} /> :
                                <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(course.image).getWithPrefix()}/>
                        }
                    </div>



                    <div className={css.text}>
                        <div className={css.header}>
                            <div className={css.name}>
                                {!editing ? course.name : <textarea rows={3} value={editingName} onChange={(e) => setEditingName(e.target.value)} />}
                            </div>
                            {
                                !editing ?
                                <div className={css.editButtons}>
                                    <PiGearFineBold onClick={() => setEditingState(true)} onChange={(e) => setEditingDescription(e.target.value)} />
                                    <BsPersonGear onClick={() => setControllingAccess(true)}/>
                                    <BiShow className={course.publishOnMain && css.redButton} onClick={() =>  showOnMain()}/>
                                </div>
                                :
                                <div className={css.editButtons}>
                                    <GiCheckMark onClick={() => {
                                        if(checkName())
                                            putCourse({
                                                'courseId' : course.id,
                                                
                                                'bImage': true,
                                                'image': editingImage,
                                                
                                                'bDescription': true,
                                                'description': editingDescription,
                                                
                                                'bName': true,
                                                'name': editingName,
                                            }, () => {setEditingState(false); successToast("Данные изменены"); Init()})
                                        else 
                                            errorToast("Введите название курса")
                                    }} onChange={(e) => setEditingDescription(e.target.value)} />
                                    <GiCrossMark onClick={() => setEditingState(false)} />
                                </div> 
                            }
                        </div>
                        <div className={css.description}>
                            <text>
                                {!editing ? course.description : <textarea value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} />}
                            </text>
                        </div>
                    </div>
                </div>
                <table className={css.extraInfo}>
                    <tbody>
                        <tr className={css.keys}>
                            <td>
                                Создатель курса
                            </td>
                            <td>
                                Дата создания
                            </td>
                            <td>
                                Всего уроков
                            </td>
                            <td>
                                Всего разделов
                            </td>
                            <td>
                                Всего просмотров
                            </td>
                        </tr>
                        <tr className={css.values}>
                            {creator != null ? 
                            
                                <td className={css.creator}>
                                    {creator.photo == null || creator.photo == "" ? <FaUserCircle className={css.nullPhoto} /> : <img className={css.photo} src={new ImageHelper(creator.photo).getWithPrefix()}/>}
                                    <div className={css.name}>
                                        <text>
                                            {
                                                creator.lastName !== null && creator.lastName !== "" ? creator.lastName: "-" 
                                            }
                                            {
                                                creator.name !== null && creator.name !== "" ? " " + creator.name : ""
                                            }
                                        </text>
                                    </div>
                                </td> : 
                                <td className={css.creator}>
                                    -
                                </td>
                            }
                            <td>
                                {
                                    getFormatedDate(course.created)
                                }
                            </td>
                            <td>
                                -
                            </td>
                            <td>
                                -
                            </td>
                            <td>
                                -
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>}
                {
                    controllingAccess && <CoursesAccessControlPopup onClose={
                        () => setControllingAccess(false)
                    }/>
                }
        </div>
    );
}

export default AdminCourseProfile