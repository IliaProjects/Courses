import React, { useEffect, useState } from "react";
import { MdLibraryBooks, MdMonochromePhotos } from "react-icons/md";
import css from "./CoursesCatalog.module.css"
import Footer from "../../../Footer";
import { ShowCoursesCatalogByEnum, SortCoursesByEnum, SortCoursesCatalogByEnum } from "../../../classes/Enums";
import { searchCourses } from "../../../api/CoursesApi";
import ImageHelper from "../../../classes/ImageHelper";
import { getCourseSections, getCourseSectionsNoPage, unauthorizedGetCourseSectionsNoPage } from "../../../api/SectionsApi";
import { getRomanNumeral } from "../../../classes/NumbersHelper";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const CoursesCatalog = (props) => {
    const [courses, setCourses] = useState(null)

    const [openedSorter, setOpenedSorter] = useState(false)
    const [openedAccessFilter, setOpenedAccessFilter] = useState(false)

    const [showType, setShowType] = useState(ShowCoursesCatalogByEnum.All)    
    const [sortBy, setSortBy] = useState(SortCoursesCatalogByEnum.DateInc)

    const [page, setPage] = useState(1)
    const [pager, setPager] = useState(null)

    const [searching, setSearching] = useState(false)
    const [searchingRow, setSearchingRow] = useState("")

    const nextPage = () => {
        if(page === pager.currentPage && page < pager.totalPages) {
            setPage(page+1);
        }
    }

    useEffect(() => {
        setOpenedSorter(false)
        setPage(0)
    }, [sortBy]);

    useEffect(() => {
        setOpenedAccessFilter(false)
        setPage(0)
    }, [showType]);

    useEffect(() => {
        setSearchingRow("")
        setPage(0)
    }, [searching]);

    useEffect(() => {
        if(searching) {
            setPage(0)
        }
    }, [searchingRow]);

    useEffect(() => {
        if (page < 1)
        {
            setCourses(null)
            setPage(1)
        }
        else
            Init();
    }, [page])

    const Init = () => {
        searchCourses(
            {
                "bNameContains": searching && searchingRow.length > 0 && true,
                "name": searchingRow,
                "bUserId": showType == ShowCoursesCatalogByEnum.Accessed,
                "bUserIdUnaccessed": showType == ShowCoursesCatalogByEnum.Unaccessed,

            }, page, sortBy.Enum, (data) => {
                setCourses(courses == null ? data.courses : courses.concat(data.courses))
                setPager(data.pager)
            }
        )
    }

    return(
        <div className="content-with-footer">
            <div className={css.coursesPage}>
                <div className={css.coursesHeader}>
                    <div className={css.coursesTitleContainer}>
                        <div className={css.coursesTitle}>
                            <MdLibraryBooks />
                            <h1>Каталог</h1>
                        </div>
                        <div className={`${css.filter} ${searching && css.active}`} onClick={() => {setSearching(!searching) }}>
                            {searching && <input autoFocus type="text" value={searchingRow} onChange={(e) => setSearchingRow(e.target.value)}/>}
                            <FaMagnifyingGlass className={'sorter-svg'} />
                        </div>
                    </div>
                    <div className={`${css.accessFilter}`}>
                        <span>Показать:</span>
                        <div className={css.menuBar} onClick={() => setOpenedAccessFilter(!openedAccessFilter)}>
                            <span>
                                {showType.Text}
                            </span>
                            <div className={css.dropdown}>
                                {
                                    openedAccessFilter ? 
                                    <FaCaretUp />:
                                    <FaCaretDown />
                                }
                            </div>
                            {openedAccessFilter && 
                                <div className={css.menuWrapper}>
                                    <span onClick={() => setShowType(ShowCoursesCatalogByEnum.All)}>{ShowCoursesCatalogByEnum.All.Text}</span>
                                    <span onClick={() => setShowType(ShowCoursesCatalogByEnum.Accessed)}>{ShowCoursesCatalogByEnum.Accessed.Text}</span>
                                    <span onClick={() => setShowType(ShowCoursesCatalogByEnum.Unaccessed)}>{ShowCoursesCatalogByEnum.Unaccessed.Text}</span>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={`${css.sorter}`}>
                        <span>Сначала:</span>
                        <div className={css.menuBar} onClick={() => setOpenedSorter(!openedSorter)}>
                            <span>
                                {sortBy.Text}
                            </span>
                            <div className={css.dropdown}>
                                {
                                    openedSorter ?  
                                    <FaCaretUp />:
                                    <FaCaretDown />
                                }
                            </div>
                            {openedSorter && 
                                <div className={css.menuWrapper}>  
                                    <span onClick={() => setSortBy(SortCoursesCatalogByEnum.DateDec)}>{SortCoursesCatalogByEnum.DateDec.Text}</span>
                                    <span onClick={() => setSortBy(SortCoursesCatalogByEnum.DateInc)}>{SortCoursesCatalogByEnum.DateInc.Text}</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>


                <div className={!courses || courses.length < 1 ? css.coursesFlexboxEmpty : css.coursesFlexbox}>
                    { 
                        courses && courses.length > 0 ?
                            <div className={css.coursesList}>
                                {
                                    courses.map(el => (
                                        <Course key={el.id} course={el} authorized={props.authorized}/>
                                    ))
                                } 
                                {
                                    pager && page < pager.totalPages && courses && courses.length > 0 && 
                                    <div className={css.showMore}>
                                        <div className={css.button} onClick={nextPage}>
                                            <text>Показать ещё</text>
                                        </div>
                                    </div>
                                }
                            </div>
                                :
                            <span>Нет результатов...</span>
                    }
                </div>
            </div>
            <Footer/>
        </div>
    )
}

const Course = (props) => {
    const [sections, setSections] = useState(null)
    const [filteredSections, setFilteredSections] = useState(null)
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
    }, [props.sortBy]);

    useEffect(() => {
        if (sections != null) {
            setFilteredSections(sections.filter(item => item.name !== "default"))
        }
    }, [sections]);

    //для класса изображения
    const [horisontal, setHorisontal] = useState(false)

    var img = new Image()
    img.onload = () => {
        img.width > img.height && setHorisontal(true)
    }
    img.src = new ImageHelper(props.course.image).getWithPrefix()

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
        <div className={css.courseItem}>
            <div className={css.title}>
                <div className={css.courseName}>
                    <span>{props.course.name}</span>
                </div>
            </div>
            <div className={css.body}>
                <NavLink className={css.imageWrapper} to={`/catalog/${props.course.id}`}>
                    {
                        props.course.image.length > 0 ? 
                            <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(props.course.image).getWithPrefix()}/>
                            :
                            <MdMonochromePhotos className={css.courseNoPhoto} />
                    }
                </NavLink>
                <div className={css.buttons}>
                    {
                        filteredSections && filteredSections.length > 0 &&
                        <div className={css.sections}>
                        {
                            filteredSections.map(el => (
                                <NavLink className={css.button} to={`/catalog/module/${el.id}`}>
                                    <span>{
                                        "Модуль " + getRomanNumeral(el.order)
                                        }</span>
                                </NavLink>
                            ))
                        }
                        </div>
                    }
                    <div className={css.purchase}>
                        <div className={css.button}>
                            Приобрести
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursesCatalog