import { NavLink, useParams } from "react-router-dom"
import css from "./AdminLessons.module.css"
import { useEffect, useState } from "react"
import { deleteLesson, getSectionLessons } from "../../../../api/LessonsApi"
import { searchCourses } from "../../../../api/CoursesApi"
import { getCourseSection, putSection } from "../../../../api/SectionsApi"
import ImageHelper from "../../../../classes/ImageHelper"
import { IoIosArrowRoundBack } from "react-icons/io"
import { FaMinus, FaPlus } from "react-icons/fa6"
import { MdMonochromePhotos } from "react-icons/md"
import { FaEdit } from "react-icons/fa";
import { GiCrossMark } from "react-icons/gi";
import { GiCheckMark } from "react-icons/gi";
import Toastr, { errorToast, successToast } from "../../../../things/Toastr"

const AdminLessonsList = (props) => {
    const [course, setCourse] = useState(null)
    const [section, setSection] = useState(null)

    const [editing, setEditing] = useState(false)
    const [editingName, setEditingName] = useState(null)
    const [editingDescription, setEditingDescription] = useState(null)
    const [editingImage, setEditingImage] = useState(null)

    useEffect(() =>{
        if(editing) {
            setEditingName(section.name);
            setEditingImage(section.image);
            setEditingDescription(section.description);
        }},
    [editing])

    useEffect(()=>{
        Init()
    }, [])

    const Init = () => {
        searchCourses({
            bCourseSectionId: true,
            CourseSectionId: params.sectionId
        }, 1 , 1, (data) => {
            setCourse(data.courses[0])
        })
        getCourseSection(params.sectionId, (data) => {
            setSection(data)
        })
    }

    const checkName = () => {
        return editingName.length > 0
    }

    const params = useParams()
    return(
        <div className={css.adminSectionPage}>
            <Toastr/>
            <div className={css.sectionProfileContainer}>
                { 
                    course && 
                    <div className={css.title}>
                        <NavLink className={css.backward} to={`/admin/courses/${course.id}`}>
                            <IoIosArrowRoundBack />
                        </NavLink>
                        <div className={css.name}>
                            <span>{course.name}</span>
                        </div>
                        {editing ? 
                        <div className={css.buttons}>
                            <div className={`${css.button} ${css.ok}`} onClick={() => {
                                if(checkName()) 
                                    putSection({
                                        'courseSectionId' : section.id,
                                
                                        'bImage': true,
                                        'image': editingImage,
                                        
                                        'bDescription': true,
                                        'description': editingDescription,
                                        
                                        'bName': true,
                                        'name': editingName,
                                    }, () => {
                                        setEditing(false); 
                                        successToast("Данные изменены"); 
                                        Init()
                                    })
                                else 
                                    errorToast("Введите название курса")
                            }}>
                                <GiCheckMark />
                            </div>
                            <div className={`${css.button} ${css.cancel}`} onClick={() => setEditing(false)}>
                                <GiCrossMark />
                            </div>
                        </div> : 
                        <div className={css.buttons}>
                            <div className={`${css.button} ${css.edit}`} onClick={() => setEditing(true)}>
                                <FaEdit />
                            </div>
                        </div>
                        }
                    </div>
                }
                {
                    section &&
                    <div className={css.sectionProfile}>
                        <div className={css.name}>
                            {!editing ? 
                                <span>{section.name}</span> :
                                <textarea rows={3} value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                            }
                        </div>
                        <div className={css.descriptionContainer}>
                            <div className={css.imageContainer}>
                                {section.image && section.image.length > 0 ?
                                <img src={new ImageHelper(section.image).getWithPrefix()} />
                                :
                                <MdMonochromePhotos className={css.sectionNoPhoto} />                                
                                }
                            </div>
                            <div className={css.description}>
                            {!editing ? 
                                <text>
                                    {section.description}
                                </text> :
                                <textarea value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} />
                            }
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className={css.lessons}>
                <div className={css.lessonsListHeader}>
                    <NavLink className={css.newLessonButton} to={`/admin/courses/lessons/create/${params.sectionId}`}>
                        <FaPlus/>
                    </NavLink>
                    <h4>Уроки раздела</h4>
                </div>
                <LessonsList sectionId={params.sectionId} />
            </div>
        </div>
    )
}

const LessonsList = (props) => {
    const [lessons, setLessons] = useState(null)

    useEffect(()=>{
        Init()
    }, [])

    const Init = () => {
        getSectionLessons(props.sectionId, (data) => {
            setLessons(data)
        })
    }

    return(
        <div className={css.lessonsList}>
            {
                lessons && lessons.length > 0 ?
                lessons.map((el, index) => (
                    <LessonItem lesson={el} onDelete={Init}/>
                )) : 
                <div className={css.noLessons}>
                    <span>Уроков нет...</span>
                </div>
            }
        </div>
    )
}

const LessonItem = (props) => {
    return(
        <div className={css.lessonItem}>
            <div className={css.minusButton}>
                <FaMinus onClick={() => {
                    deleteLesson(props.lesson.id, props.onDelete)
                }}/>
            </div>
            <div className={css.lessonName}>
                {props.lesson.name}            
            </div>         
        </div>
    )
}

export default AdminLessonsList