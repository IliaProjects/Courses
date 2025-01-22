import { NavLink, useParams } from "react-router-dom"
import css from "./CourseProfile.module.css"
import Footer from "../../../Footer"
import { IoIosArrowRoundBack } from "react-icons/io"
import { useEffect, useState } from "react"
import ImageHelper from "../../../classes/ImageHelper"
import { getUser } from "../../../api/UsersApi"
import { getCourse } from "../../../api/CoursesApi"
import { FaCaretDown, FaCaretUp, FaUserCircle } from "react-icons/fa"
import { PiGearFineBold } from "react-icons/pi"
import { MdMonochromePhotos, MdMoreHoriz } from "react-icons/md"
import { getFormatedDate } from "../../../classes/DateHelper"
import Toastr from "../../../things/Toastr"
import { getCourseSections } from "../../../api/SectionsApi"

const CourseProfile = (props) => {
    let params = useParams()

    const[sectionTrigger, setSectionsTrigger] = useState(false)
    const[profTrigger, setProfTrigger] = useState(false)

    return (
    <div className="content-with-footer">
        <div className={css.coursePage}>
            <div className={css.header}>
                <NavLink className={css.backward} to={`/catalog`}>
                    <IoIosArrowRoundBack />
                </NavLink>
                <div className={css.title}>
                    <h3>Вернуться к каталогу</h3>
                </div>
            </div>
            <CourseProfileContainer collapseTrigger={profTrigger} onCollapsed={() => setSectionsTrigger(!sectionTrigger)} courseId={params.courseId} />
            <SectionsContainer collapseTrigger={sectionTrigger} onCollapsed={() => setProfTrigger(!profTrigger)} courseId={params.courseId} />
        </div>
        <Footer/>
    </div>
    )
}

const CourseProfileContainer = (props) => {
    const [course, setCourse] = useState(null)
    const [creator, setCreator] = useState(null)

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

    useEffect(() =>
       Init(),
    [])

    const Init = () => {
        getCourse(
            props.courseId, 
            (data) => {
                setCourse(data)
            }
        )
    } 

    useEffect(() =>
        {
            if(collapsing) 
                if(collapsed)
                    setCollapsed(false)
                else 
                    setTimeout(() => setCollapsed(true), 0)
        },
    [collapsing])

    useEffect(() =>{
        if(collapsed) {
            props.onCollapsed()
        }
        setCollapsing(false)},
    [collapsed])

    useEffect(() =>
        setCollapsed(false),
    [props.collapseTrigger])

    return (<div className={css.courseProfileContainer}>
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
                        <div className={css.title}>
                            <div className={css.name}>
                                {course.name}
                            </div>
                        </div>
                        <div className={css.description}>
                            <text>
                                {course.description}
                            </text>
                        </div>
                    </div>
                </div>
                <table className={css.extraInfo}>
                    <tbody>
                        <tr className={css.keys}>
                            <td>
                                Создатель
                            </td>
                            <td>
                                Дата
                            </td>
                            <td>
                                Уроков
                            </td>
                            <td>
                                Разделов
                            </td>
                            <td>
                                Просмотров
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
        </div>
    )
}

const SectionsContainer = (props) => {
    const [collapsed, setCollapsed] = useState(false)
    
    const [trigger, setTrigger] = useState(false)


    return(
        <div className={`${css.sectionsContainer} ${collapsed && css.collapsed}`}>
            <Toastr />
            <div className={css.title}>
                <div className={css.collapser} onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ?
                        <FaCaretDown /> :
                        <FaCaretUp />
                    }
                </div>
                <div className={css.headerTitle}>
                    <h3>Разделы курса</h3>
                </div>     
            </div>



            {!collapsed && <SectionsList courseId={props.courseId} initTrigger={trigger} collapsed={collapsed} sortBy={1} />}
        </div>
    )
}

const SectionsList = (props) => {
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

    return(
        sections != null &&
        <div className={css.sectionsList}>
            {sections.map
                (el => 
                    (
                        el.name != "default" &&
                        <SectionItem key={el.id} section={el} />
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

    //для класса изображения
    const [horisontal, setHorisontal] = useState(false)
    var img = new Image()
    img.onload = () => {
        img.width > img.height && setHorisontal(true)
    }
    img.src = new ImageHelper(props.section.image).getWithPrefix()

    return (
        <NavLink className={css.item} to={`/catalog/module/${props.section.id}`}>
            <div className={css.imageContainer}>
                {
                    props.section.image.length > 0 ?
                        <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(props.section.image).getWithPrefix()}/>:
                        <MdMonochromePhotos className={css.noPhoto} />
                }
            </div>
            <div className={css.textContainer}>
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
            </div>
        </NavLink>
    )
}

export default CourseProfile