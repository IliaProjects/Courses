import { useRef, useState } from "react"
import css from "../Popup.module.css"
import { MdMonochromePhotos } from "react-icons/md"
import ImageHelper from "../../../../classes/ImageHelper"
import { GiCheckMark, GiCrossMark } from "react-icons/gi"
import { postSection } from "../../../../api/SectionsApi"
import { MdFormatListBulletedAdd } from "react-icons/md";
import Toastr, { errorToast } from "../../../../things/Toastr"

const AddSectionPopup = (props) => {
    const [image, setImage] = useState("")
    const [sectionName, setSectionName] = useState("")
    const [description, setDescription] = useState("")
    
    const inputFile = useRef(null) 
    const submitBtn = useRef()

    const [hiding, setHiding] = useState(false)
    const submit = () => {
        setHiding(true)
        setTimeout(() => {
            props.onAdd()
        }, 450)
    }
    const cancel = () => {
        setHiding(true)
        setTimeout(() => {
            props.onClose()
        }, 450)
    }

    const checkName = () => {
        return sectionName.length > 0;
    }

    return(<div className={`${css.popupBackground} ${!hiding ? css.show : css.hide}`}>
        <div className={css.popup}>
            <Toastr/>
            <div className={css.popupHeader}>
                <div className={css.title}>
                    <div className={css.titleIcon}>
                        <MdFormatListBulletedAdd />
                    </div>
                    <h4>Новый раздел</h4>
                </div>
                <div className={css.buttons}>   
                    <div className={`${css.button} ${css.ok}`} onClick={() => {submitBtn.current.click()}}>              
                        <GiCheckMark className={css.okMark} />
                    </div>           
                    <div className={`${css.button} ${css.cross}`} onClick={(e) => { cancel() }}>          
                        <GiCrossMark className={css.crossMark} />
                    </div>

                    <input style={{display: 'none'}} ref={submitBtn} type="submit" onClick={(e) => {
                        e.preventDefault();
                        if(checkName())
                            postSection({
                                courseId: props.courseId,
                                image: image,
                                description: description,
                                name: sectionName,
                                order: -1
                            }, () => submit())
                        else
                            errorToast("Введите название раздела")
                    }}/>
                </div>
            </div>
            <form className={css.sectionAddForm}>
                {   
                    image == "" ? 
                        <MdMonochromePhotos className={css.addSectionNoPhoto} onClick={() => inputFile.current.click()}/> :
                        <img className={css.sectionImage} src={new ImageHelper(image).getWithPrefix()} onClick={() => inputFile.current.click()}/>                            
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
                }} />

                <textarea rows="1" cols="30" placeholder="Название" autoFocus onChange={(e) => setSectionName(e.target.value)} />
                <textarea rows="4" cols="30" placeholder="Описание" onChange={(e) => setDescription(e.target.value) } />
                                
            </form>
        </div>
    </div>)
}

export default AddSectionPopup