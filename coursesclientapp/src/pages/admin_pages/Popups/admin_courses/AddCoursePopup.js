import React, { useEffect, useRef, useState } from "react";
import css from "../Popup.module.css"
import { BiSolidBookAdd } from "react-icons/bi";
import { MdMonochromePhotos } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";
import ImageHelper from "../../../../classes/ImageHelper";
import { postCourse } from "../../../../api/CoursesApi";
import Toastr, { errorToast, successToast } from "../../../../things/Toastr";

const AddCoursePopup = (props) => {

    const [image, setImage] = useState("")
    const [courseName, setCourseName] = useState("")
    const [description, setDescription] = useState("")

    const inputFile = useRef(null) 
    const submitBtn = useRef()
    
    const [hiding, setHiding] = useState(false)
    const hide = () => {
        setHiding(true)
        setTimeout(() => {
            props.onClose()
        }, 450)
    }

    const checkName = () => {
        return courseName.length > 0;
    }
    useEffect(() => console.log(image.length), [image])

    return (
        <div className={`${css.popupBackground} ${!hiding ? css.show : css.hide}`}>
        <Toastr />
            <div className={`${css.popup}`}>
                <div className={css.popupHeader}>
                    <div className={css.title}>
                        <div className={css.titleIcon}>
                            <BiSolidBookAdd />
                        </div>
                        <h4>Новый курс</h4>
                    </div>

                    <div className={css.buttons}>
                        <div className={`${css.button} ${css.ok}`} onClick={() => {console.log(submitBtn); submitBtn.current.click()}}>                
                            <GiCheckMark className={css.okMark}/>
                        </div>
                        <div className={`${css.button} ${css.cross}`} onClick={(e) => {hide()}}>              
                            <GiCrossMark className={css.crossMark}/>
                        </div>
                        
                        <input style={{display: 'none'}} ref={submitBtn} type="submit" onClick={(e) => {
                            e.preventDefault();
                            if(checkName())
                                postCourse(
                                    {
                                        image: image,
                                        description: description,
                                        name: courseName,
                                    }, () => {
                                        successToast("Добавлен новый курс"); hide()
                                    }
                                )
                            else
                                errorToast("Введите название курса")
                        }}/>
                    </div>
                </div>
                <form className={css.courseAddForm}>
                        {   
                            image == "" ? 
                                <MdMonochromePhotos className={css.addCourseNoPhoto} onClick={() => inputFile.current.click()}/> :
                                <img className={css.courseImage} src={new ImageHelper(image).getWithPrefix()} onClick={() => inputFile.current.click()}/>                            
                        }
                        <input accept="image/png, image/jpeg"  type="file" ref={inputFile} style={{display: 'none'}} onChange={(e) => {
                            if (e.target.value.length > 0){
                                let reader = new FileReader();
                                reader.onload = () => {
                                    var x = new ImageHelper(reader.result).getResizedWithoutPrefix(720, 720, (data) => {
                                        setImage(data)
                                    });
                                };
                                reader.onerror = function (error) {
                                    console.log('Error: ', error);
                                };
                                reader.readAsDataURL(e.target.files[0]);
                            }
                        }}/>

                        <textarea rows="1" cols="30" placeholder="Название" onChange={(e) => setCourseName(e.target.value)}/>
                        <textarea rows="4" cols="30" placeholder="Описание" onChange={(e) => setDescription(e.target.value) }/>
                    
                </form>
            </div>
        </div>
    );
}

export default AddCoursePopup