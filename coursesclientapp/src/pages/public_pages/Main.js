import { useEffect, useRef, useState } from "react"
import css from "./Main.module.css"
import Footer from "../../Footer"
import { searchCourses } from "../../api/CoursesApi"
import { SortCoursesByEnum } from "../../classes/Enums"
import ImageHelper from "../../classes/ImageHelper"
import { getCourseSectionsNoPage, unauthorizedGetCourseSectionsNoPage } from "../../api/SectionsApi"
import { NavLink } from "react-router-dom"
import { getRomanNumeral } from "../../classes/NumbersHelper"
import OrderPopup from "../admin_pages/Popups/order/OrderPopup"

const Main = (props) => {
    const [courses, setCourses] = useState(null)

    useEffect(() => {
        Init()
    }, [])

    const Init = () => {
        searchCourses({
            bPublishOnMain: true,
            PublishOnMain: true
        }, 1, SortCoursesByEnum.DateDec, (data) => {
            setCourses(data.courses)
        })
    }

    return(
        <div className="content-with-footer">
            <div className={css.container}>
                <div className={css.block}>
                    <Twister/>
                </div>
                { courses && 
                courses.map(el => (
                    <div className={css.block}>
                        <CourseBlock course={el} authorized={props.authorized} />
                    </div>))
                }
            </div>
            <Footer />
        </div>
    )
}


const Twister = (props) => {
    const[twistedImage, setTwistedImage] = useState(null)
    const[twistedImageNr, setTwistedImageNr] = useState(0)
    const[instanceId, setInstanceId] = useState(Math.floor(Math.random() * 1000000).toString())
    const[horisontal, setHorisontal] = useState(false)
    const[twistingImages, setTwistingImages] = useState([
        require("./imgscroller1.jpg"), 
        require("./imgscroller2.jpg"), 
        require("./imgscroller3.jpg")
    ])
    
    useEffect(() => {
        if(twistingImages)
            twistingImages.map(el => {
                document.getElementById(el + instanceId).style.opacity=0;
            })
            document.getElementById(twistingImages[twistedImageNr]+ instanceId).style.opacity = 1;
        setTimeout(() => {
            setTwistedImageNr(twistedImageNr + 1 > twistingImages.length - 1 ? 0 : twistedImageNr + 1)
        }, 5000)
    }, [twistedImageNr])
    return(
        <div className={css.imageTwister}>
            {
                twistingImages.map(el => {
                    let getClass = (e) => {
                        const width = e.target.width;
                        const height = e.target.height;
                        let b = width < (height*16/9)
                        if(b)
                            return(css.imgVertical)
                        else
                            return(css.imgHorisontal)
                    }
                    return(
                    <img 
                    id={el + instanceId}
                    onLoad={(e) => {
                        e.target.className = getClass(e)
                    }} src={el}/>)
                })
            }
        </div>
    )
}

const CourseBlock = (props) => {
    const [sections, setSections] = useState(null)
    const [filteredSections, setFilteredSections] = useState(null)

    const [order, setOrder] = useState(false)
    
    useEffect(() => {
        Init()
    }, [])

    useEffect(() => {
        if (sections != null) {
            setFilteredSections(sections.filter(item => item.name !== "default"))
        }
    }, [sections]);

    const Init = () => {
        if(props.authorized !== false) {
            getCourseSectionsNoPage(
                {
                    'bCourseId': true, 
                    'courseId': props.course.id
                }, SortCoursesByEnum.DateDec, (data) => {
                    setSections(data)
                }
            )
        }
        else{
            unauthorizedGetCourseSectionsNoPage(
                props.course.id, 
                SortCoursesByEnum.DateDec, 
                (data) => setSections(data)
            )
        }
    }
    return(
        <div className={css.courseDisplayWrapper}>
            <div className={css.courseDisplay}>
                <div className={css.title}>
                    <span>
                    {
                        props.course.name
                    }
                    </span>
                </div>
                <div className={css.body}>
                    <div className={css.buttonsBlock}>
                        {
                            filteredSections && filteredSections.length > 0 &&
                            <div className={css.sections}>
                            {
                                filteredSections.map(el => (
                                    <NavLink className={`${css.sectionButton} ${css.button}`} to={`/catalog/module/${el.id}`}>
                                        <text>{
                                            "Модуль " + getRomanNumeral(el.order)
                                            }</text>
                                    </NavLink>
                                ))
                            }
                            </div>
                        }
                        <div className={css.orderCourse}>
                            <div className={`${css.orderCourseButton} ${css.button}`} onClick={() => setOrder(true)}>
                                <text>Приобрести</text>
                            </div>
                        </div>
                     </div>
                     <div className={css.poster}>
                         <img src={new ImageHelper(props.course.image).getWithPrefix()}></img>
                     </div>
                </div>
            </div>
            {
                order &&
                <OrderPopup courseId={props.course.id} onClose={() => setOrder(false)}/>
            }
        </div>
    )
    
    
    
    // const [poster, setPoster] = useState(require("./NageenaCropped.png")) 
    // return(
    //     <div className={css.courseDisplayWrapper}>
    //         <div className={css.courseDisplay}>
    //             <div className={css.title}>
    //                 <text>Йога Школа<br/> Академия Духовной Жизни</text>
    //             </div>
    //             <div className={css.body}>
    //                 <div className={css.buttonsBlock}>
    //                     <div className={css.sections}>
    //                         <div className={`${css.sectionButton} ${css.button}`}>
    //                             <text>Модуль I</text>
    //                         </div>
    //                         <div className={`${css.sectionButton} ${css.button}`}>
    //                             <text>Модуль II</text>
    //                         </div>
    //                         <div className={`${css.sectionButton} ${css.button}`}>
    //                             <text>Модуль III</text>
    //                         </div>
    //                         <div className={`${css.sectionButton} ${css.button}`}>
    //                             <text>Модуль IV</text>
    //                         </div>
    //                     </div>
    //                     <div className={css.orderCourse}>
                            
    //                         <div className={`${css.orderCourseButton} ${css.button}`}>
    //                             <text>Приобрести курс</text>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div className={css.poster}>
    //                     <img src={poster}></img>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
}


export default Main