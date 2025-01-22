import { NavLink, useParams } from "react-router-dom"
import css from "./SectionProfile.module.css"
import { useEffect, useState } from "react"
import { IoIosArrowRoundBack } from "react-icons/io"
import { searchCourses } from "../../../api/CoursesApi"
import { getCourseSection } from "../../../api/SectionsApi"
import { getSectionLessons } from "../../../api/LessonsApi"
import { MdMonochromePhotos } from "react-icons/md"
import ImageHelper from "../../../classes/ImageHelper"
import Footer from "../../../Footer"

const SectionProfile = (props) => {
    const params = useParams()

    const [course, setCourse] = useState(null)
    const [section, setSection] = useState(null)

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
    
    return (
    <div className="content-with-footer">
        <div className={css.sectionPage}>
            <div className={css.sectionProfileContainer}>
                { 
                course && 
                    <div className={css.title}>
                        <NavLink className={css.backward} to={`/catalog/${course.id}`}>
                            <IoIosArrowRoundBack />
                        </NavLink>
                        <div className={css.name}>
                            <span>{course.name}</span>
                        </div>
                    </div>
                }
                {
                    section &&
                    <div className={css.sectionProfile}>
                        <div className={css.name}>
                            <span>{section.name}</span>
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
                                <text>
                                    {section.description}
                                </text>
                            </div>
                        </div>
                        
                    </div>
                }
            </div>
            <div className={css.lessons}>
                <div className={css.lessonsListHeader}>
                    <h4>Уроки раздела</h4>
                </div>
                <LessonsList sectionId={params.sectionId} />
            </div>
        </div>
        <Footer/>
    </div>)
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
            <div className={css.lessonName}>
                {props.lesson.name}
            </div>         
        </div>
    )
}


export default SectionProfile