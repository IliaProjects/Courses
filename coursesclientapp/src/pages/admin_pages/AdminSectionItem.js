import React, { useEffect, useRef, useState } from "react";
import css from "./AdminSectionsList.module.css"
import ImageHelper from "../../classes/ImageHelper";
import { MdMonochromePhotos } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { deleteSection, postSection, putSection } from "../../api/SectionsApi";
import { FaPencilAlt } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteSectionPopup from "./Popups/admin_sections/DeleteSectionPopup";
import { FaPersonDressBurst } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";



const InsertSectionItem = (props) => {
    
    const [image, setImage] = useState("")
    const [sectionName, setName] = useState("")
    const [description, setDescription] = useState("")

    const [horisontal, setHorisontal] = useState(false)
    
    const inputFile = useRef()
    return (<div className={css.sectionItem}>
        <FaUpload className={css.imageUploader} onClick={() => { inputFile.current.click()}}/>
        {image.length > 0 && <FaMinus className={css.imageMinus} onClick={ () => setImage("")}/>}
        
        <div className={css.sectionImageContainer}>
            {image.length < 1 ? <MdMonochromePhotos className={css.sectionNoPhoto}/> :
                <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(image).getWithPrefix()}/>
            }
            
            <input accept="image/png, image/jpeg"  type="file" ref={inputFile} style={{display: 'none'}} onChange={(e) => {
                if (e.target.value.length > 0){
                    let reader = new FileReader();
                    reader.onload = () => {
                        new ImageHelper(reader.result).getResizedWithoutPrefix(720, 720, (data) => {
                            var img = new Image()
                            img.onload = () => {
                                img.width > img.height && setHorisontal(true)
                            }
                            img.src = new ImageHelper(data).getWithPrefix()
                            setImage(data)
                        });
                    };
                    reader.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            }}/>
            {/* <img className={horisontal ? css.imgHorisontal : css.imgVertical} src={new ImageHelper(props.course.image).getWithPrefix()}/> */}
        </div>
        <div className={css.sectionTextContainer}>
            <input autoFocus className={css.sectionItemInput} placeholder="№ и название раздела" onChange={(e) => setName(e.target.value)}/>
            <textarea rows="1" cols="24" className="sectionItemDescription" placeholder="Описание раздела (необяз.)" onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <ImCheckmark className={css.insertSectionSubmit} onClick={() => {
            if(sectionName.length > 0){
                postSection({
                    "courseId": props.courseId,
                    "name": sectionName,
                    "description": description,
                    "image": image,
                }, 
                props.onAdded)
            }
            else
                alert("Имя раздела обязательно!")
        }}/>
        
    </div>)
}

const EditSectionItem = (props) => {
    const [image, setImage] = useState(props.section.image)
    const [sectionName, setName] = useState(props.section.name)
    const [description, setDescription] = useState(props.section.description)

    const [nameEdited, setNameEdited] = useState(false)
    const [descriptionEdited, setDescriptionEdited] = useState(false)
    const [imageEdited, setImageEdited] = useState(false)

    const [horisontal, setHorisontal] = useState(false)
    
    const inputFile = useRef()

    new ImageHelper(new ImageHelper(image).getWithPrefix()).getResizedWithoutPrefix(720, 720, (data) => {
        
        var img = new Image()
        img.onload = () => {
            img.width > img.height && setHorisontal(true)
        }
        img.src = new ImageHelper(data).getWithPrefix()
        setImage(data)
    });


    return (<div className={css.sectionItem}>
        <FaUpload className={css.imageUploader} onClick={() => { inputFile.current.click()}}/>
        {image.length > 0 && <FaMinus className={css.imageMinus} onClick={ () => setImage("")}/>}
        
        <div className={css.sectionImageContainer}>
            {image.length < 1 ?  <MdMonochromePhotos className={css.sectionNoPhoto}/> :
                            <img className={horisontal ? css.imgHorisontal : css.imgVertical}  src={new ImageHelper(image).getWithPrefix()}/>
            }
            
            <input accept="image/png, image/jpeg"  type="file" ref={inputFile} style={{display: 'none'}} onChange={(e) => {
                if (e.target.value.length > 0){
                    let reader = new FileReader();
                    reader.onload = () => {
                        new ImageHelper(reader.result).getResizedWithoutPrefix(720, 720, (data) => {
                            var img = new Image()
                            img.onload = () => {
                                img.width > img.height && setHorisontal(true)
                            }
                            img.src = new ImageHelper(data).getWithPrefix()
                            setImage(data)
                            setImageEdited(true)
                        });
                    };
                    reader.onerror = function (error) {
                        console.log('Error: ', error);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            }}/>
        </div>
        <div className={css.sectionTextContainer}>
            <input autoFocus className={css.sectionItemInput} placeholder="№ и название раздела" value={sectionName} onChange={(e) => {setName(e.target.value); setNameEdited(true)}}/>
            <textarea rows="1" cols="24" className="sectionItemDescription" placeholder="Описание раздела (необяз.)" value={description} onChange={(e) => {setDescription(e.target.value); setDescriptionEdited(true)}}/>
        </div>


        <div className={css.buttons}> 
            <ImCheckmark className={css.insertSectionSubmit} onClick={() => {
                if(sectionName.length > 0){
                    console.log("on init: "+ props.onSubmit);
                    putSection({
                        "courseSectionId": props.section.id,
                        "name": sectionName,
                        "bName": nameEdited,
                        "description": description,
                        "bDescription": descriptionEdited,
                        "image": image,
                        "bImage": imageEdited,
                    }, props.onSubmit)
                }
                else
                    alert("Имя раздела обязательно!")
            }}/>
            < FaXmark className={css.trash} onClick={props.onCancel}/>
        </div>

        
    </div>)
}




const AdminSectionItem = (props) => {    

    const [deleting, setDeletingState] = useState(false)

    const [editing, setEditingState] = useState(false)

    //для стиля изображения
    const [horisontal, setHorisontal] = useState(false)
    if(props.section.image) {
        var img = new Image()
        img.onload = () => {
            img.width > img.height && setHorisontal(true)
            console.log("Горизонтально: " + horisontal)
        }
        img.src = new ImageHelper(props.section.image).getWithPrefix()
    }

    useEffect(() => {
        !deleting && props.onInit();
    }, [deleting])
    

    if(props.section.name == "default") {
        return(
        <div className={css.defaultSectionItem}>
            <div className={css.sectionItem}>
                <div className={css.sectionImageContainer}>
                    {props.section.image.length < 1 ?  <MdMonochromePhotos className={css.sectionNoPhoto}/> :
                        <img className={horisontal ? css.imgHorisontal : css.imgVertical}  src={new ImageHelper(props.section.image).getWithPrefix()}/>
                    }
                </div>
                <div className={css.sectionTextContainer}>
                    <div className={css.sectionItemName}>
                        <span>Общий</span>
                    </div>
                    <div className={css.sectionItemDescription}>
                        <span>{props.section.description}</span>
                    </div>
                </div>
            
            </div>
        </div>)
    }

    return(
    !editing ?    
    <div>
            <div className={css.sectionItem}>
                <div className={css.sectionImageContainer}>
                    {props.section.image.length < 1 ?  <MdMonochromePhotos className={css.sectionNoPhoto}/> :
                        <img className={horisontal ? css.imgHorisontal : css.imgVertical}  src={new ImageHelper(props.section.image).getWithPrefix()}/>
                    }
                </div>
                <div className={css.sectionTextContainer}>
                    <div className={css.sectionItemName}>
                        <span>{props.section.name}</span>
                    </div>
                    <div className={css.sectionItemDescription}>
                        <span>{props.section.description}</span>
                    </div>
                </div>
                <div className={css.buttons}>
                    <FaPencilAlt onClick={() => setEditingState(true)}/>
                    <FaRegTrashAlt className={css.trash} onClick={() => setDeletingState(true)} />
                </div>
            
        </div>
        {deleting && <DeleteSectionPopup onCancel={() => setDeletingState(false)} sectionId={props.section.id} onDelete={(sectionId) => deleteSection(sectionId, () => setDeletingState(false))} />}
    </div>
    :  <EditSectionItem section={props.section} onCancel={() => setEditingState(false)} onSubmit={() => {setEditingState(false); props.onInit()}} />)}
                
export {InsertSectionItem, AdminSectionItem}