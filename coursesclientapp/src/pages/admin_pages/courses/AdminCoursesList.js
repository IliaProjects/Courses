import React, { useEffect, useRef, useState } from "react";
import '../css/AdminCourses.css'
import { PiBooksFill } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import { FaMagnifyingGlass } from "react-icons/fa6";
import AddCoursePopup from "../Popups/admin_courses/AddCoursePopup";
import { deleteCourse, getAllCourses, putCourse, searchCourses } from "../../../api/CoursesApi";
import AdminCoursesListItem from "./AdminCoursesListItem";
import Paginator from "../../../components_common/Paginator";
import { SortCoursesByEnum, SortTypeEnum } from "../../../classes/Enums";
import Sorter from "../../../things/Sorter";
import { BsPersonGear } from "react-icons/bs";
import CoursesAccessControlPopup from "../Popups/admin_courses/CoursesAccessControlPopup";

const AdminCoursesList = (props) => {
    const [adding, setAddingState] = useState(false)
    const [courses, setCourses] = useState(null)
    const [pager, setPager] = useState(null)
    const [page, setPage] = useState(1)

    const [searchState, setSearchState] = useState(false)

    const [controllingAccess, setControllingAccess] = useState(false)
    const [searchCoursesState, setSearchCourses] = useState(null)
    const [searchPager, setSearchPager] = useState(null)
    const [searchPage, setSearchPage] = useState(1)

    const [sortBy, setSortBy] = useState(SortCoursesByEnum.NameInc)

    useEffect(() => {
        Init()
    }, [page])

    useEffect(() => {
        if(searchState){
            SearchCourses()
        }
    },[searchPage])

    useEffect(() => {
        searchState ? SearchCourses() : Init()
    }, [sortBy])

    const Init = () => {
        setSearchState(false)
        getAllCourses(page, sortBy.Enum, (data) => {
            setCourses(data.courses)
            setPager(data.pager)
        })
    }
    const PutCourse = (data) => {
        Init()
    }
    const DeleteCourse = (key) => {
        deleteCourse(key, Init)
    }
    const searchInput = useRef()
    const SearchCourses = () => {
        let val = searchInput.current.value;
        searchCourses({
            "bNameContains": true,
            "name": val,
        }, searchPage, sortBy.Enum, (data) => {
            setSearchCourses(data.courses)
            setSearchPager(data.pager)
        })
    }
    return(
        <div className="admin-courses-container">
            <div className="admin-header course-header">
                <div className="heder-title">
                    <PiBooksFill/>
                    <h3>Курсы</h3>
                </div>
                <div className="heder-click-icons">
                    <FaPlus onClick={() =>{ setAddingState(true); setSearchState(false)}} className={adding && "active"} />
                    <BsPersonGear onClick={() => {setControllingAccess(true)}}/>
                </div>
                <div className={'searcher'}>
                    {searchState && <input autoFocus ref={searchInput} type="text" onChange={() => {setSearchPage(1); SearchCourses()}}/>}
                    <FaMagnifyingGlass className={`sorter-svg ${searchState && "active"}`} onClick={() => {console.log(pager); setSearchState(!searchState); setSearchCourses(null) }} />
                </div>
                <div className="header-sorting-container">
                    <Sorter sortType={SortTypeEnum.Courses} sortBy={sortBy} setSortBy={setSortBy}/>
                </div>
            </div>
            {adding && <AddCoursePopup onClose={ () => {
                setAddingState(false);
                Init();
            }}/>}

            {
            courses == null || courses.length < 1 ?
                <div className="admin-courses-empty"><span>Пока курсов нет...</span></div> 
                :
                <div className="admin-courses-scrollable">
                    {
                    searchState && searchCoursesState !== null ?
                        searchCoursesState == null || searchCoursesState.length < 1 ?
                            <div className="admin-courses-empty"><span>Результатов нет...</span></div> 
                        :
                            searchCoursesState.map(el => ( 
                                <AdminCoursesListItem key={el.id} course={el} onEdit={(data) => PutCourse(data)} onDelete = {DeleteCourse}/>
                            )) 
                    :
                        courses.map(el => ( 
                            <AdminCoursesListItem key={el.id} course={el} onEdit={(data) => PutCourse(data)} onDelete = {DeleteCourse}/>
                        ))
                    }
                </div>
            }
            {
                searchState && searchCoursesState !== null ?
                <Paginator pager={searchPager} setPageNr={setSearchPage}/> :
                <Paginator pager={pager} setPageNr={setPage}/>
            }
            {
                controllingAccess && <CoursesAccessControlPopup 
                onClose={
                    () => setControllingAccess(false)
                }/>
            }
        </div>
    );
}

export default AdminCoursesList