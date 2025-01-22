import React, { useRef, useState } from "react"
import css from "../Popup.module.css"
import { GiCheckMark } from "react-icons/gi"
import { GiCrossMark } from "react-icons/gi"
import { FaHammer } from "react-icons/fa";
import { MdMonochromePhotos } from "react-icons/md";
import ImageHelper from "../../../../classes/ImageHelper";
import { PiGearFineBold } from "react-icons/pi";
import { putCourse } from "../../../../api/CoursesApi";
import { putSection } from "../../../../api/SectionsApi";
import { MdEditNote } from "react-icons/md";
import Toastr, { errorToast } from "../../../../things/Toastr";

const EditSectionPopup = (props) => {
    const [id, setId] = useState(props.section.id)
    
    const [editedName, setEditedName] = useState(props.section.name)
    const [editedDescription, setEditedDescription] = useState(props.section.description)
    const [editedImage, setEditedImage] = useState(props.section.image)

    const inputFile = useRef(null) 
    const submitBtn = useRef()

    const [hiding, setHiding] = useState(false)
    const submit = () => {
        setHiding(true)
        setTimeout(() => {
            props.onSubmit()
        }, 450)
    }
    const cancel = () => {
        setHiding(true)
        setTimeout(() => {
            props.onCancel()
        }, 450)

        const checkName = () => {
            return editedImage.length > 0;
        }
    }

    const checkName = () => {
        return editedName.length > 0;
    }

    return(<div className={`${css.popupBackground} ${!hiding ? css.show : css.hide}`}>
        <Toastr />
        <div className={css.popup}>
            <div className={css.popupHeader}>
                <div className={css.title}>
                    <div className={css.titleIcon}>
                        <MdEditNote  />
                    </div>
                    <h4>Правка раздела</h4>
                </div>
                    
                <div className={css.buttons}>                    
                    <div className={`${css.button} ${css.ok}`} onClick={() => {submitBtn.current.click()}}>        
                        <GiCheckMark className={css.okMark}/>
                    </div>
                    <div className={`${css.button} ${css.cross}`} onClick={(e) => { cancel()}}>                      
                        <GiCrossMark className={css.crossMark}/>   
                    </div>
                
                    <input style={{display: 'none'}} ref={submitBtn} type="submit" onClick={(e) => {
                        e.preventDefault();
                        if(checkName())
                            putSection({
                                'courseSectionId' : id,
                                
                                'bImage': true,
                                'image': editedImage,
                                
                                'bDescription': true,
                                'description': editedDescription,
                                
                                'bName': true,
                                'name': editedName,
                            }, () => submit());
                        else
                            errorToast("Введите название раздела")
                    }}/>
                </div>
            </div>
                <form className={css.sectionAddForm}>

                        {   
                            editedImage == "" ? 
                                <MdMonochromePhotos className={css.addSectionNoPhoto} onClick={() => inputFile.current.click()}/> :
                                <img className={css.sectionImage} src={new ImageHelper(editedImage).getWithPrefix()} onClick={() => inputFile.current.click()}/>                            
                        }
                        <input accept="image/png, image/jpeg"  type="file" ref={inputFile} style={{display: 'none'}} onChange={(e) => {
                            if (e.target.value.length > 0){
                                let reader = new FileReader();
                                reader.onload = () => {
                                    var originalImg = new Image();
                                    originalImg.src = e.target.result;
                                    var x = new ImageHelper(reader.result).getResizedWithoutPrefix(720, 720, (data) => {
                                        setEditedImage(data)
                                    });
                                };
                                reader.onerror = function (error) {
                                    console.log('Error: ', error);
                                };
                                reader.readAsDataURL(e.target.files[0]);
                            }
                        }}/>

                        <textarea rows="1" cols="30" placeholder="Название" value={editedName} onChange={(e) => setEditedName(e.target.value)}/>
                        <textarea rows="4" cols="30" placeholder="Описание" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value) }/>
                    
                </form>
            </div>
        </div>
    )
}

export default EditSectionPopup