import { useEffect, useRef, useState } from 'react';
import css from '../Popup.module.css'
import { FaXmark } from "react-icons/fa6";
import { searchUsers, searchUsersUsersOnly } from '../../../../api/UsersApi';
import { getUserEnum } from '../../../../classes/RoleHelper';
import { SortCoursesByEnum, SortTypeEnum, SortUsersByEnum } from '../../../../classes/Enums';
import ImageHelper from '../../../../classes/ImageHelper';
import { MdCancel, MdMonochromePhotos, MdMoreHoriz } from 'react-icons/md';
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlinePhoneEnabled } from "react-icons/md";
import { FaMinus, FaUserCircle } from 'react-icons/fa';
import { getFormatedDate } from '../../../../classes/DateHelper';
import { FiUserPlus } from "react-icons/fi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import Sorter from '../../../../things/Sorter';
import { FaAngleRight } from "react-icons/fa";
import { PiBooksFill } from "react-icons/pi";
import { searchCourses } from '../../../../api/CoursesApi';
import { FaAngleDown } from "react-icons/fa";
import { closeAccess, getCourseSections, openAccess } from '../../../../api/SectionsApi';
import '../Checkbox.css';
import Toastr, { successToast } from "../../../../things/Toastr";
import { GiCrossMark } from 'react-icons/gi';
import { BsPersonGear } from 'react-icons/bs';
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { RxReset } from "react-icons/rx";

const CoursesAccessControlPopup = (props) => {
    const [accessToUserState, setAccessToUserState] = useState(true)
    const [hiding, setHiding] = useState(false)
    const [userChecked, setUserChecked]= useState(null)
    
    const submit = () => {
        setHiding(true)
        setTimeout(() => {
            props.onClose()
        }, 450)
    }
    const cancel = () => {
        setHiding(true)
        setTimeout(() => {
            props.onClose()
        }, 450)
    }

    return(
    <div className={`${css.popupBackground} ${!hiding ? css.show : css.hide}`}>
        
        <Toastr />
        <div className={`${css.popup} ${css.access}`}>
            <div className={css.popupHeader}>
                <div className={css.title}>
                    <div className={css.titleIcon}>
                        <BsPersonGear/>
                    </div>
                    <h4>Управление доступом</h4>
                </div>
                <div className={css.buttons}>     
                    <div className={`${css.button} ${css.cross}`} onClick={() => cancel()}>              
                        <FaXmark className={css.crossMark}/>
                    </div>
                </div>                    
            </div>

            {accessToUserState ?
            <div className={css.accessControlContainer}>
                <AccessToUserLeft onUserChecked={setUserChecked} userChecked={userChecked} />
                <div className={css.arrow}>
                    <FaAngleRight />
                </div>
                {/* <AccessToUserLeft /> */}
                
                {
                    userChecked ?                
                    <AccessToUserRight userId={userChecked} /> :
                    <div className={css.rightTableLeftUnchecked}>
                        <text>Выберите пользователя...</text>
                    </div>
                }
            </div>
            :
            <div className={css.accessControlContainer}>
                <AccessToCourseLeft />
                <div className={css.arrow}>
                    <FaAngleRight />
                </div>
                <AccessToCourseRight />
            </div>
            }
        </div>
    </div>)
}


const AccessToUserLeft = (props) => {
    const [usersList, setUsersList] = useState(null)
    
    const [sortBy, setSortBy] = useState(SortUsersByEnum.NameInc)

    const [page, setPage] = useState(1)
    const [pager, setPager] = useState(null)

    const [searching, setSearching] = useState(false)
    const [searchingRow, setSearchingRow] = useState("")
    
    useEffect(() => {
        setPage(0)
    }, [sortBy]);
    
    useEffect(() => {
        if(usersList)
        console.log(usersList)
    }, [usersList]);

    useEffect(() => {
        if (page < 1)
        {
            setUsersList(null)
            setPage(1)
        }
        else
            Init();
    }, [page])

    useEffect(() => {
        setSearchingRow("")
        setPage(0)
    }, [searching]);

    useEffect(() => {
        if(searching) {
            setPage(0)
        }
    }, [searchingRow]);

    const Init = () => {
        searchUsersUsersOnly({
            "roleEnum": getUserEnum(),
            "bRoleEnum": true,

            Email: searchingRow,
            Name: searchingRow,
            LastName: searchingRow,
            PhoneNr: searchingRow,

            bEmailContains: searching && searchingRow.length > 0,
            bName: searching && searchingRow.length > 0,
            bLastName: searching && searchingRow.length > 0,
            bPhoneNr: searching && searchingRow.length > 0,
            
        },  !(searching && searchingRow.length > 0), false, sortBy.Enum, page, (data) => {
            setUsersList(usersList == null ? data.users : usersList.concat(data.users))
            setPager(data.pager)
        })
    }

    const nextPage = () => {
        if(page === pager.currentPage && page < pager.totalPages) {
            setPage(page+1);
        }
    }

    return (
    <div className={css.table}>
        <div className={css.tableHeader}>
            <div className={css.icon}>
                <FaUsers/>
            </div>
            
            <div className={css.search} style={{'margin-left': 'auto'}}>
                {
                searching && 
                    <input autoFocus type="text" onChange={
                        (e) =>{
                            setSearchingRow(e.target.value)
                        }
                    }/>
                }
                <FaMagnifyingGlass onClick={() => {console.log(pager); setSearching(!searching); }} className={searching && "active"} />
            </div>
            <Sorter sortType={SortTypeEnum.Users} sortBy={sortBy} setSortBy={(e) => { setSortBy(e)}} />
                    
        </div>
        {
            <div className={css.usersScrollable}>
                {
                usersList && usersList.length > 0 ?       
                    usersList.map(el => (
                        <div className={`${css.userItemContainer} ${el.id == props.userChecked && css.checked}`} onClick={() => props.onUserChecked(el.id)}>
                            <AccessControlUserItem key={el.id} user={el} />
                        </div>
                    )):
                    <span className={css.nousers}>
                    Пользователей нет
                    </span>
                }
                { 
                usersList && usersList.length > 0 &&
                pager && page < pager.totalPages &&
                <div className={css.showMore} onClick={nextPage}>
                    <text>Показать ещё</text>
                </div>
                }
            </div>
        }
    </div>
    )
}

const AccessToUserRight = (props) => {
    const [coursesList, setCoursesList] = useState(null)
    
    const [sortBy, setSortBy] = useState(SortCoursesByEnum.NameInc)

    const [page, setPage] = useState(1)
    const [pager, setPager] = useState(null)

    const [searching, setSearching] = useState(false)
    const [searchingRow, setSearchingRow] = useState("")

    const [checkedSections, setCheckedSections] = useState(null)
    const [checkedCourses, setCheckedCourses] = useState(null)
    const [checkedAmount, setCheckedAmount] = useState(0)

    const [openingAccess, setOpeningAccess] = useState(true)
    
    useEffect(() => {
        setPage(0)
    }, [props.userId])

    useEffect(() => {
        setPage(0)
    }, [sortBy]);

    useEffect(() => { 
        setPage(0)
    }, [openingAccess])

    useEffect(() => {
        setCheckedAmount(countSections())
    }, [checkedSections]);

    useEffect(() => {
        setCheckedAmount(countSections())
    }, [checkedCourses]);

    useEffect(() => {
        if (page < 1)
        {
            setCoursesList(null)
            setPage(1)
        }
        else
            Init();
    }, [page])

    const nextPage = () => {
        if(page === pager.currentPage && page < pager.totalPages) {
            setPage(page+1);
        }
    }

    useEffect(() => {
        setSearchingRow("")
        setPage(0)
    }, [searching]);

    useEffect(() => {
        if(searching) {
            setPage(0)
        }
    }, [searchingRow]);

    const Init = () => {
        searchCourses(
            {
                "bNameContains": searching && true,
                "name": searchingRow,
                "userId" : props.userId,
                "bUserIdPartialUnaccessed" : openingAccess,
                "bUserId" : !openingAccess, 
            }, page, sortBy.Enum, (data) => {
                setCoursesList(coursesList == null ? data.courses : coursesList.concat(data.courses))
                setPager(data.pager)
                setCheckedCourses(null)
                setCheckedSections(null)
            }
        )
    }
    const OpenAccess = () => {
        openAccess(
            {
                "userId": props.userId,
                "courseIds": getChosenCourseIds(),
                "sectionIds": getChosenSectionIds(),
            }, () => {
                successToast(`Доступ открыт`)
                setPage(0)
            }
        )
    }
    const CloseAccess = () => {
        closeAccess(
            {
                "userId": props.userId,
                "courseIds": getChosenCourseIds(),
                "sectionIds": getChosenSectionIds(),
            }, () => {
                successToast(`Доступ закрыт`)
                setPage(0)
            }
        )
    }

    const getChosenCourseIds = () => {
        let array = []
        for(var corId in checkedCourses) {
            if(checkedCourses[corId]["checked"]) {
                array.push(corId)
            }
        }

        return(array)
    }

    const getChosenSectionIds = () => {
        let array = []

        for(var corId in checkedSections) {
            for(var secId in checkedSections[corId]) {
                if(checkedSections[corId][secId]) {
                    if(!(checkedCourses && checkedCourses[corId] && checkedCourses[corId]['checked']))
                        array.push(secId);
                }
            }
        }

        return(array)
    }

    const onSectionChecked = (courseId, sectionId, checked) => {
        let s = {}
        for (var corId in checkedSections) {
            s[corId] = {}
            for(var secId in checkedSections[corId])
                s[corId][secId] = checkedSections[corId][secId]

        };

        if(s[courseId] === undefined) {
            s[courseId] = {}
        }

        s[courseId][sectionId] = checked
        setCheckedSections(s)
    } 

    const onCourseChecked = (courseId, checked, sectionsAmount) => {
        let s = {};
        for (var key in checkedCourses) {
            s[key] = checkedCourses[key];
        }
        s[courseId] = {
            checked: checked,
            sectionsAmount: sectionsAmount,
        }
        setCheckedCourses(s)
    }

    const countSections = () => {
        let x = 0;
        for(var corId in checkedCourses) {
            if(checkedCourses[corId]["checked"]) {
                x += checkedCourses[corId]["sectionsAmount"]
            }
        }

        for(var corId in checkedSections) {
            for(var secId in checkedSections[corId]) {
                if(checkedSections[corId][secId]) {
                    if(!(checkedCourses && checkedCourses[corId] && checkedCourses[corId]['checked']))
                        x++;
                }
            }
        }

        return(x)
    }

    const resetChecking = () => {
        for(var corId in checkedCourses) {
            setCheckedCourses(null)
            // checkedCourses[corId]["checked"] = false;
        }        

        for(var corId in checkedSections) {
            for(var secId in checkedSections[corId]) {
                setCheckedSections(null)
                // checkedSections[corId][secId] = false
            }
        }
    }
    
    return (
        <div className={`${css.table} ${css.rightTable}`}>
            <div className={css.tableHeader}>
                <div className={css.icon}>
                    <PiBooksFill />
                </div>
                <div className={css.locks}>
                    <div className={`${css.btnWrapper} ${openingAccess && css.active}`} onClick={() => setOpeningAccess(true)}>
                        <FaLock />
                    </div>
                    <div className={`${css.btnWrapper} ${!openingAccess && css.active}`} onClick={() => setOpeningAccess(false)}>
                        <FaUnlock />
                    </div>
                </div>
                <div className={css.checkedCounter}>
                    {!searching && <text>Выбрано:&nbsp;</text>}
                    <span>
                    {
                        checkedAmount
                    }
                    </span>
                    <div className={css.minusWrapper} onClick={resetChecking}>
                        {
                            checkedAmount > 0 &&
                            <FaMinus  />
                        }
                    </div>
                </div>

                <div className={css.submitButtonContainer}>
                    {openingAccess ?
                    <div className={`${css.button} ${checkedAmount > 0 && css.active}`} onClick={OpenAccess}>
                        ОТКРЫТЬ
                    </div> :
                    <div className={`${css.button} ${css.close} ${checkedAmount > 0 && css.active}`} onClick={CloseAccess}>
                        ЗАКРЫТЬ
                    </div>
                    }
                </div>            
                <div className={css.search}>
                    {
                    searching && 
                        <input className={css.rightTableInput} autoFocus type="text" onChange={
                            (e) =>{
                                setSearchingRow(e.target.value)
                            }
                        }/>
                    }
                    <FaMagnifyingGlass onClick={() => {console.log(pager); setSearching(!searching); }} className={searching && "active"} />
                    </div>
                <Sorter sortType={SortTypeEnum.Courses} sortBy={sortBy} setSortBy={(e) => { setSortBy(e)}} />
            </div>
            {
                <div className={css.coursesScrollable}>
                    {
                    coursesList && coursesList.length > 0 &&   
                        coursesList.map(el => (
                            // <div className={`${css.coursesItemContainer}`}>
                                <AccessControlCoursesItem 
                                    key={el.id} 
                                    course={el} 
                                    courseChecked={checkedCourses != null && checkedCourses[el.id] != null && checkedCourses[el.id]['checked']} 
                                    checkedSections={checkedSections != null && checkedSections[el.id]} 
                                    onCourseChecked={onCourseChecked} 
                                    onSectionChecked={onSectionChecked}
                                    openingAccess={openingAccess}
                                    userId={props.userId}
                                />
                            // </div>
                        )) 
                    }
                    {
                    pager && page < pager.totalPages && coursesList && coursesList.length > 0 && 
                    <div className={css.showMore} onClick={nextPage}>
                        <text>Показать ещё</text>
                    </div>
                    }
                </div>
            }
        </div>
    )
}

const AccessToCourseLeft = (props) => { 

}

const AccessToCourseRight = (props) => { 
    
}

const AccessControlUserItem = (props) => {
    return(
    <div className={css.userItem}>
        <div className={css.photoContainer}>
            {
                props.user.photo != null && props.user.photo != "" ?
                    <img src={new ImageHelper(props.user.photo).getWithPrefix()} />
                    :
                    <FaUserCircle className={css.userNoPhoto}/>
            }
        </div>
        <div className={css.infoWrapper}>
            <div className={`${css.rowWrapper} ${css.fullName}`}>
                <div className={`${css.item}`}>
                    <text>
                        {props.user.lastName != null && props.user.lastName.length > 0 ? props.user.lastName + " " : "- "}
                        {props.user.name != null && props.user.name.length > 0 ? props.user.name : ""}
                    </text>
                </div>
            </div>
            <div className={`${css.rowWrapper} ${css.emailPhone}`}>
                <div className={css.item}>
                    <div className={css.icon}>
                        <MdAlternateEmail/>
                    </div>
                    <div className={css.text}>
                        <text>{props.user.email}</text>
                    </div>
                </div>
                <div className={css.item}>
                    <div className={css.icon}>
                        <FiUserPlus />
                    </div>
                    <div className={css.text}>
                        <text>{getFormatedDate(props.user.regDate)}</text>
                    </div>
                </div>
            </div>
            <div className={`${css.rowWrapper} ${css.regOnline}`}>
                <div className={css.item}>
                    <div className={css.icon}>
                        <MdOutlinePhoneEnabled />
                    </div>
                    <div className={css.text}>
                        <text>{props.user.phoneNr != null && props.user.phoneNr.length > 0 ? props.user.phoneNr : "-"}</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

const AccessControlCoursesItem = (props) => {
    const [horisontal, setHorisontal] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [expanding, setExpanding] = useState(false)

    const [sections, setSections] = useState(null)

    const [sortBy, setSortBy] = useState(SortCoursesByEnum.NameInc)

    const [pager, setPager] = useState(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        if(expanded)
        {
            setPage(0)
        }
    }, [expanded])

    useEffect(() => {
        if(expanding)
        {
            setExpanded(true)
        } else {
            setTimeout(() => {if(expanding != expanded) setExpanded(false)}, 1200)
        }
    }, [expanding])

    useEffect(() => {
        setPage(0)
    }, [sortBy]);

    useEffect(() => {
        if (page < 1)
        {
            setSections(null)
            setPage(1)
        }
        else
            Init();
    }, [page])

    const nextPage = () => {
        if(page === pager.currentPage && page < pager.totalPages) {
            setPage(page+1);
        }
    }

    const Init = () => {
        if(expanded)
        {
            getCourseSections (
                {
                    'bCourseId': true, 
                    'courseId': props.course.id,
                    'userId': props.userId,
                    'bUserIdUnaccessed': props.openingAccess,
                    'bUserId': !props.openingAccess,
                }, sortBy, page, (data) => {
                    setPager(data.pager)
                    setSections(sections == null ? data.sections : sections.concat(data.sections))
                }
            )
        }
    }

    if(props.course.image) {
        var img = new Image()
        img.onload = () => {
            img.width > img.height && setHorisontal(true)
        }
        img.src = new ImageHelper(props.course.image).getWithPrefix()
    }

    return(
        <div className={`${css.itemWrapper} ${expanded && expanding ? css.expanded : expanded && !expanding ? css.collapsed : ''}`}>
            <div className={`${css.courseItem}`}>
                <div className={css.imageContainer}>
                    {
                        props.course.image != null && props.course.image.length > 0 ?
                            <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(props.course.image).getWithPrefix()} />
                            :
                            <MdMonochromePhotos className={css.courseNoPhoto}/>
                    }
                </div>
                <div className={css.infoWrapper}>
                    <div className={css.rowWrapper}>
                        <div className={`${css.name}`}>
                            <text>
                                {props.course.name != null && props.course.name.length > 0 ? props.course.name : "-"}
                            </text>
                        </div>
                        <div className={css.date}>
                            {getFormatedDate(props.course.created)}
                        </div>
                    </div>
                    <div className={`${css.collapser} ${expanding == expanded && css.active}`} onClick={() => {if(expanding == expanded) {setExpanding(!expanding)}}}>
                        <FaAngleDown />
                    </div>
                </div>
            </div>
            { 
            expanded &&
            <div className={`${css.courseSectionsContainer}`}>
                <div className={css.header}>
                    <text>Разделы курса</text>
                    <div className={css.selectAll}>
                        <text>
                            Все разделы
                        </text>
                        <div className={css.checkBoxContainer}>
                            <div class="checkbox-wrapper-1">
                                <input id={`${props.course.id}_courseItem`} 
                                    class="substituted" type="checkbox" 
                                    checked={props.courseChecked} 
                                    onChange={(e) =>{props.onCourseChecked(props.course.id, e.target.checked, pager.totalItems)}} 
                                    aria-hidden="true" 
                                />
                                <label for={`${props.course.id}_courseItem`}></label>
                            </div>
                        </div>          
                    </div>
                </div>
                <div className={css.listScrollable}>
                    {sections &&
                        sections.map(el => { return(
                            <AccessControlCourseSectionItem 
                                courseChecked={props.courseChecked}
                                sectionChecked={props.checkedSections != null && props.checkedSections[el.id] != null && props.checkedSections[el.id]}
                                onSectionChecked={props.onSectionChecked} 
                                section={el} 
                                key={el.id} 
                            />
                        )})
                    }
                    { 
                    pager &&
                        page < pager.totalPages &&
                        <div className={css.showMore} onClick={nextPage}>
                            <text>Показать ещё</text>
                        </div>
                    }
                </div>
            </div>
            }
        </div>
    )
}

const AccessControlCourseSectionItem = (props) => {
    const [horisontal, setHorisontal] = useState(false)
    if(props.section.image) {
        var img = new Image()
        img.onload = () => {
            img.width > img.height && setHorisontal(true)
        }
        img.src = new ImageHelper(props.section.image).getWithPrefix()
    }

    return  <div className={css.item}>
                <div className={css.imageContainer}>
                    {
                        props.section.image != null && props.section.image.length > 0 ?
                        <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(props.section.image).getWithPrefix()} />
                        :
                        <MdMonochromePhotos className={css.sectionNoPhoto}/>
                    }
                </div>
                <div className={css.name}>
                    <text>{props.section.name == "default" ? "Общий раздел курса" : props.section.name}</text>
                </div>
                <div className={css.checkBoxContainer}>
                    {
                    props.courseChecked ? 
                    <div class={"checkbox-wrapper-2"}>
                        <input id={`${props.section.id}_sectionItem`} class="substituted" type="checkbox" checked={true} aria-hidden="true" />
                        <label for={`${props.section.id}_sectionItem`}></label>
                    </div>
                    : 
                    <div class={"checkbox-wrapper-1"}>
                        <input id={`${props.section.id}_sectionItem`} class="substituted" type="checkbox" checked={props.sectionChecked} onChange={(e) => { props.onSectionChecked(props.section.courseId, props.section.id, e.target.checked)}} aria-hidden="true" />
                        <label for={`${props.section.id}_sectionItem`}></label>
                    </div>
                     
                    }
                </div>
            </div>
}

export default CoursesAccessControlPopup