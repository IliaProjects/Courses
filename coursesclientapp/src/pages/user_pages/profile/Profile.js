import React, { useEffect, useRef, useState } from "react";
import css from "./Profile.module.css"
import { CgOverflow, CgProfile } from "react-icons/cg";
import ProfileTable from "../ProfileTableOLD";
import { getProfile, putProfile } from "../../../api/ProfileApi";
import ImageHelper from "../../../classes/ImageHelper";
import { FaUpload, FaUserCircle } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";
import { TbPointFilled } from "react-icons/tb";
import { FaPencilAlt } from "react-icons/fa";
import DeletePhotoPopup from "../../admin_pages/Popups/profile/DeletePhotoPopup";
import { getFormatedDate } from "../../../classes/DateHelper";
import { RiUserLine } from "react-icons/ri";
import RoleIcon from "../../../things/RoleIcon";
import ProfileCourseItem from "./ProfileCourseItem";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import { BiSolidUserDetail } from "react-icons/bi";
import { MdContactMail, MdLibraryBooks, MdOutlineAlternateEmail } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import Toastr, { errorToast, successToast } from "../../../things/Toastr";
import { FaUserPlus } from "react-icons/fa6";
import Footer from "../../../Footer";

const Profile = (props) => {

    const [photo, setPhoto] = useState(null)
    const [email, setEmail] = useState(null)
    const [name, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [phoneNr, setPhoneNr] = useState(null)
    const [regDate, setRegDate] = useState(null)
    const [roleEnum, setRoleEnum] = useState(null)
    const [courses, setCourses] = useState(null);
    
    const [editedPhoto, setEditedPhoto] = useState(null);
    const [photoEditing, setPhotoEditingState] = useState(false)
    const [photoDeleting, setPhotoDeletingState] = useState(false)

    const [editedName, setEditedName] = useState(null)
    const [editedLastName, setEditedLastName] = useState(null)
    const [editedPhone, setEditedPhone] = useState(null)

    const [nameEditing, setNameEditing] = useState(false)
    const [lastNameEditing, setLastNameEditing] = useState(false)
    const [phoneEditing, setPhoneEditing] = useState(false)

    const lastNameInput = useRef()
    const nameInput = useRef()
    const phoneInput = useRef()

    useEffect(() => {
        setEditedName(name)
        setEditedLastName(lastName)
        setEditedPhone(phoneNr)
    }, [name, lastName, phoneNr])

    useEffect(() => {
        // if (nameEditing) {
            setEditedName(name)
        // }
    }, [nameEditing])

    useEffect(() => {
        // if (lastNameEditing) {
            setEditedLastName(lastName)
        // }
    }, [lastNameEditing])

    useEffect(() => {
        // if (phoneEditing) {
            setEditedPhone(phoneNr)
        // }        
    }, [phoneEditing])

    const inputFile = useRef(null) 

    const Init = () => {
        getProfile((data) => {
            setPhoto(data.photo)
            setFirstName(data.name)
            setLastName(data.lastName)
            setPhoneNr(data.phoneNr)
            setEmail(data.email)
            setRegDate(data.regDate)
            setRoleEnum(data.roleEnum)
            setCourses(data.courses)
            setEditedName(name)
            setEditedLastName(lastName)
            setEditedPhone(phoneNr)
        })
    }

    useEffect(() => {
        Init();
    }, [])

    
    useEffect(() => {
        if(!photoEditing)
            inputFile.current.value = null;
    }, [photoEditing])

    const checkPhoneNr = (str) => {
        return(
            str[0] == "+" &&
            str.length == 12
        )
    }

    const checkLastName = (str) => {
        return(str.length > 2)
    }

    return (
            <div className="content-with-footer">
                <div className={css.profilePage}>
                    <Toastr />
                    <div className={css.profileCover}>
                        <div className={css.profilePhotoContainer}>
                            {!photoEditing ? 
                                <div className={`${css.buttonContainer} ${css.uploadBtn} ${css.leftBtn}`} onClick={() => inputFile.current.click()}>
                                    <FaUpload />
                                </div> :
                                <div className={`${css.buttonContainer} ${css.okBtn} ${css.leftBtn}`} onClick={() => {
                                        
                                    putProfile({
                                        "bPhoto": true,
                                        "Photo": editedPhoto,
                                    }, () => {
                                        window.location.reload()
                                    })

                                }}>
                                    <GiCheckMark />
                                </div>
                            }
                            {
                                !photoEditing ?
                                    !photo ?
                                        <FaUserCircle className={css.noPhoto}/> : 
                                        <img className={css.profilePhoto} src={new ImageHelper(photo).getWithPrefix()}/>
                                    :
                                    !editedPhoto ?
                                        <FaUserCircle className={css.noPhoto}/> : 
                                        <img className={css.profilePhoto} src={new ImageHelper(editedPhoto).getWithPrefix()}/>
                            }
                            {!photoEditing ? 
                                <div className={`${css.buttonContainer} ${photo ? css.minusBtn : css.minusBtnInactive} ${css.rightBtn}`} onClick={() => setPhotoDeletingState(true)}>
                                    <FaMinus />
                                </div>:
                                <div className={`${css.buttonContainer} ${css.crossBtn} ${css.rightBtn}`} onClick={() => setPhotoEditingState(false)}>
                                    <GiCrossMark/>   
                                </div> 
                            }
                        </div>
                    </div>

                    <input type='file' accept="image/png, image/jpeg"  id='file' ref={inputFile} onChange={(e) => {
                        if (e.target.value.length > 0){
                            let reader = new FileReader();
                            reader.onload = () => {
                                var originalImg = new Image();
                                originalImg.src = e.target.result;
                                
                                var x = new ImageHelper(reader.result).getResizedWithoutPrefix(720, 720, (data) => {
                                    
                                    setEditedPhoto(data)
                                    setPhotoEditingState(true)
                                });
                            };
                            reader.onerror = function (error) {
                                console.log('Error: ', error);
                            };
                            reader.readAsDataURL(e.target.files[0]);
                        }
                    }} style={{display: 'none'}}/>
                    {photoDeleting && <DeletePhotoPopup onDelete={() => {
                        putProfile({
                            "bPhoto": true,
                            "Photo": null,
                        }, () => {
                            window.location.reload()
                        })
                    }} onCancel={() => {
                        setPhotoDeletingState(false)
                    }}/>}
                    <div className={css.infoEmailBlock}>
                        <div className={css.emailBlock}>
                            <div className={css.email}>
                                <div className={css.emailIconContainer} onClick={() => {
                                    navigator.clipboard.writeText(email)
                                    successToast(`Адрес скопирован`)
                                }}>
                                    <IoIosMail />
                                </div>
                                <text>
                                    {email && email}
                                </text>
                            </div>
                            <div className={css.role}>
                                <RoleIcon roleEnum={roleEnum} />
                            </div>
                        </div>
                    </div>
                        <div className={css.infoBlock} >
                            <div className={css.tableHeader}>
                                <div className={css.title}>
                                    <div className={css.titleImg}>
                                        <BiSolidUserDetail />
                                    </div>
                                    <text>Профиль</text>
                                </div>
                            </div>
                            <div className={css.infoBody}>
                                <div className={css.profileInfoContainer}>
                                    <span className={css.lotion}/>
                                    <div className={css.infoContainer}>
                                        {   lastNameEditing ? 
                                            <div className={`${css.infoItem} ${css.editing}`}>
                                                <div className={css.okBtn} onClick={() => {
                                                    putProfile({
                                                        bLastName: true,
                                                        lastName: lastNameInput.current.value
                                                    }, (e) => {
                                                        if(checkLastName(lastNameInput.current.value)){
                                                        setLastName(lastNameInput.current.value)
                                                        setLastNameEditing(false)
                                                        successToast("Данные успешно изменены")
                                                        } else {
                                                            errorToast("Имя содержит менее 3 символов")
                                                        }
                                                    })
                                                }}>
                                                    <GiCheckMark />
                                                </div>
                                                <input  
                                                    type="text" 
                                                    placeholder="Имя" 
                                                    autoFocus={true}
                                                    ref={lastNameInput} 
                                                    value={editedLastName} 
                                                    onFocus={(e) => e.target.select()} 
                                                    onChange={(e) => setEditedLastName(e.target.value)}
                                                />
                                                <div className={css.cancelBtn} onClick={() => setLastNameEditing(false)}>
                                                    <GiCrossMark />
                                                </div>
                                            </div>
                                        :
                                            <div className={css.infoItem}>
                                                <div className={css.key}>
                                                    И
                                                </div>
                                                <div className={css.value}>
                                                    <span>
                                                        {lastName ? lastName : "-"}
                                                    </span>
                                                </div>
                                                <div className={css.edit} onClick={() => setLastNameEditing(true)}>
                                                    <FaPencilAlt />
                                                </div>
                                            </div>
                                        }
                                        {   nameEditing ? 
                                            <div className={`${css.infoItem} ${css.editing}`}>
                                                <div className={css.okBtn} onClick={() => {
                                                    putProfile({
                                                        bName: true,
                                                        name: nameInput.current.value
                                                    }, (e) => {
                                                        setFirstName(nameInput.current.value)
                                                        setNameEditing(false)
                                                        successToast("Данные успешно изменены")
                                                    })
                                                }}>
                                                    <GiCheckMark />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="Фамилия" 
                                                    autoFocus={true}
                                                    ref={nameInput} 
                                                    value={editedName} 
                                                    onFocus={(e) => e.target.select()} 
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                />
                                                <div className={css.cancelBtn} onClick={() => setNameEditing(false)}>
                                                    <GiCrossMark />
                                                </div>
                                            </div>
                                        :
                                            <div className={css.infoItem}>
                                                
                                                <div className={css.key}>
                                                    Ф
                                                </div>
                                                <div className={css.value}>
                                                    <span>
                                                        {name ? name : "-"}
                                                    </span>
                                                </div>
                                                <div className={css.edit} onClick={() => setNameEditing(true)}>
                                                    <FaPencilAlt />
                                                </div>
                                            </div>
                                        }
                                        {   phoneEditing ? 
                                            <div className={`${css.infoItem} ${css.editing}`}>
                                                <div className={css.okBtn} onClick={() => {
                                                    
                                                        if(checkPhoneNr(phoneInput.current.value))
                                                            putProfile({
                                                                bPhoneNr: true,
                                                                phoneNr: phoneInput.current.value
                                                            }, (e) => {
                                                                setPhoneNr(phoneInput.current.value)
                                                                setPhoneEditing(false)
                                                                successToast("Данные успешно изменены")
                                                            })
                                                        else
                                                            errorToast("Формат телефона неверный")
                                                    }}>
                                                    <GiCheckMark />
                                                </div>
                                                <input 
                                                    type="tel"
                                                    placeholder="Номер" 
                                                    autoFocus={true}
                                                    maxlength="12"
                                                    ref={phoneInput} 
                                                    value={'+373' + editedPhone.replace("+373", "")} 
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => e.target.value.length > 3 && setEditedPhone(e.target.value.substring(4, e.target.value.length).replace(/[^0-9]+/g, ''))}
                                                />
                                                <div className={css.cancelBtn} onClick={() => setPhoneEditing(false)}>
                                                    <GiCrossMark />
                                                </div>
                                            </div>
                                        
                                        :
                                            <div className={css.infoItem}>
                                                <div className={css.key}>
                                                    <FaPhone />
                                                </div>
                                                <div className={css.value}>
                                                    <span>
                                                        {phoneNr ? phoneNr : "-"}
                                                    </span>
                                                </div>
                                                <div className={css.edit} onClick={() => setPhoneEditing(true)}>
                                                    <FaPencilAlt />
                                                </div>
                                            </div>
                                        }
                                        <div className={css.infoItem}>
                                            <div className={css.key}>
                                                <FaUserPlus />
                                            </div>
                                            <div className={css.value}>
                                                {getFormatedDate(regDate)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className={css.coursesBlock}>
                        <CoursesScrollView courses={courses} />
                    </div>
                </div>
                <Footer />
            </div>);
}

const CoursesScrollView = (props) => {
    const [rightButtonWidth, setRightButtonWidth] = useState(0)
    const [leftButtonWidth, setLeftButtonWidth] = useState(0)
    const [scrollViewWidth, setScrollViewWidth] = useState(0)
    const [viewWidth, setViewWidth] = useState(0)
    const [itemWidth, setItemWidth] = useState(0)

    const [totalMargin, setTotalMargin] = useState(0)
    const [elementIndex, setElementIndex] = useState(0)

    const [start, setStart] = useState(false)
    const [end, setEnd] = useState(false)

    const scrollView = useRef()
    const scrollViewContainer = useRef()
    
    const leftButtonRef = useRef()
    const rightButtonRef = useRef()

    useEffect(() => {
        const leftButtonObserver = new ResizeObserver(entries => {
            setLeftButtonWidth(entries[0].contentRect.width)
        })
        leftButtonObserver.observe(leftButtonRef.current)

        const rightButtonObserver = new ResizeObserver(entries => {
            setRightButtonWidth(entries[0].contentRect.width)
        })
        rightButtonObserver.observe(rightButtonRef.current)

        const containerObserver = new ResizeObserver(entries => {
            setScrollViewWidth(entries[0].contentRect.width)
        })
        containerObserver.observe(scrollViewContainer.current)

        const observer = new ResizeObserver(entries => {
            setViewWidth(entries[0].contentRect.width)
        })
        observer.observe(scrollView.current)

        return () => {
            leftButtonRef.current && leftButtonObserver.unobserve(leftButtonRef.current)
            rightButtonRef.current && rightButtonObserver.unobserve(rightButtonRef.current)
            scrollViewContainer.current && containerObserver.unobserve(scrollViewContainer.current)
            scrollView.current && observer.unobserve(scrollView.current)
        }
    }, [])

    useEffect(() => {
        countTotalMargin()
    }, [leftButtonWidth])

    useEffect(() => {
        countTotalMargin()
    }, [scrollViewWidth])

    useEffect(() => {
        countTotalMargin()
    }, [viewWidth])

    useEffect(() => {
        countTotalMargin()
    }, [itemWidth])

    useEffect(() => {
        if(!end)
            countTotalMargin()
        else
            setTotalMargin(rightButtonWidth)
    }, [end])

    useEffect(() => {
        console.log(itemWidth)

        countTotalMargin()
        if(elementIndex > 0) {
            if(start)
                setStart(false)
        }
        else 
            if(!start)
                setStart(true)
    }, [elementIndex])

    const countTotalMargin = () => {
        if(viewWidth > scrollViewWidth)
            if(elementIndex == 0 || scrollViewWidth - viewWidth - leftButtonWidth + itemWidth * (elementIndex - 1) < 0) {
                let result = scrollViewWidth - viewWidth - leftButtonWidth + itemWidth * elementIndex
                if (result < 0) {
                    if(end) {
                        setEnd(false)
                    } else {
                        setTotalMargin(result)
                    }
                }
                else {
                    if(!end) {
                        setEnd(true)
                    }                
                }
            } else {
                if(elementIndex < 0)
                    setElementIndex(0)
                else 
                    setElementIndex(elementIndex-1)
            }
        else
            if(props.courses && props.courses.length > 0)
                setTotalMargin(scrollViewWidth - viewWidth - leftButtonWidth)
            else
                setTotalMargin(scrollViewWidth/2 - viewWidth/2)
    }

    useEffect(() => {
        scrollView.current.style.right = `${totalMargin}px`
    }, [totalMargin])

    return( <div className={css.coursesContainer}>
                <div className={css.tableHeader}>
                        <div className={css.title}>
                            <div className={css.titleImg}>
                            <MdLibraryBooks/>
                        </div> 
                        <text>Мои курсы</text>
                    </div>
                </div>

                <div className={css.coursesScroll}>


                    <div className={`${css.scrollButtonLeft} ${!start && viewWidth > scrollViewWidth && css.active}`} onClick={() => {
                        if(!start && viewWidth > scrollViewWidth) {
                            setElementIndex(elementIndex - 1)
                        }
                    }} ref={leftButtonRef}>
                        <FaChevronLeft />
                    </div>

                    <div className={css.coursesScrollViewContainer} ref={scrollViewContainer}>
                        <div className={css.coursesScrollView} ref={scrollView}>
                            {
                                        props.courses && props.courses.length > 0 ? props.courses.map((el) => {
                                            return(<ProfileCourseItem onSetWidth={setItemWidth} course={el} key={el.id}/>)
                                        }):
                                        <div className={css.noCoursesContainer}>
                                            <span>Нет доступных курсов</span>
                                        </div>
                                
                            }
                        </div>
                    </div>

                    <div className={`${css.scrollButtonRight} ${!end && viewWidth > scrollViewWidth && css.active}`} onClick={() => {
                        if(!end && viewWidth > scrollViewWidth) {
                            setElementIndex(elementIndex+1)
                        }
                    }} ref={rightButtonRef}>
                        <FaChevronRight />
                    </div>

                </div>
            </div>)
}

export default Profile