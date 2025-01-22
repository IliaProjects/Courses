import React, { useEffect, useRef, useState } from "react";
import "./css/Profile.css"
import { getProfile, putProfile } from "../../api/ProfileApi";
import { FaUserCircle } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa"
import { FaUpload } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { ImCross } from "react-icons/im";
import ImageHelper from "../../classes/ImageHelper";

const ProfileTable = (props) => {
    const [isEditing, setEditState] = useState(false);

    const [photo, setPhoto] = useState("");
    const [name, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNr, setPhoneNr] = useState("");
    const [courses, setCourses] = useState("");

    const [editedFirstName, setEditedFirstName] = useState("");
    const [editedLastName, setEditedLastName] = useState("");
    const [editedPhoto, setEditedPhoto] = useState("");    
    const [editedPhoneNr, setEditedPhoneNr] = useState("");

    const [isFirstNameEditing, setIsFirstNameEditingState] = useState(false);
    const [isLastNameEditing, setIsLastNameEditingState] = useState(false);
    const [isPhotoEditing, setIsPhotoEditingState] = useState(false);    
    const [isPhoneNrEditing, setIsPhoneNrEditingState] = useState(false);

    const [isPhotoUploading, setIsPhotoUploading] = useState(false)

    const inputFile = useRef(null) 

    const setConcreteEditState = (setConcreteState, bool) => {
        setEditedFirstName(name);
        setEditedLastName(lastName);
        setEditedPhoneNr(phoneNr);
        setEditedPhoto(photo);

        setConcreteState(bool);
        setEditState(bool);
    }

    useEffect(() => {getProfile((data) => {
        setPhoto(data.photo)
        setFirstName(data.name != null ? data.name : "-")
        setLastName(data.lastName != null ? data.lastName : "-")
        setPhoneNr(data.phoneNr != null ? data.phoneNr : "-")
        setEmail(data.email)
        setCourses(data.courses)
    })}, [])
    
    useEffect(() => {
        if(isPhotoUploading){
            console.log(inputFile.value);
        }
      }, [isPhotoEditing]);
    
    return (<table className="profile-table">
        <tbody>
            <tr className="photo">
                <td className="profile-fieldname"><h4>Фото:</h4></td>
                <td className="profile-value user-photo">
                    {
                        !isPhotoEditing ?
                            photo == "" ? 
                                <FaUserCircle className="no-photo"/> :
                                <img className="user-photo-img" src={new ImageHelper(photo).getWithPrefix()}/>
                        :
                            editedPhoto == "" ?
                                photo == "" ?                                
                                    <div className="user-img-container">
                                        <FaUserCircle className="no-photo"/>
                                        {!(editedPhoto.length < 1 && photo.length < 1) && <FaMinus onClick={() =>{setPhoto(""); setEditedPhoto("")}} className="trash-icon" />}
                                        <FaUpload className="upload-icon" onClick={() => {console.log(inputFile); inputFile.current.click(); setIsPhotoUploading(false); setIsPhotoUploading(true)}} />
                                    </div> :                                
                                    <div className="user-img-container">
                                        <img className="user-photo-img" src={new ImageHelper(photo).getWithPrefix()}/>
                                        {!(editedPhoto.length < 1 && photo.length < 1) && <FaMinus onClick={() =>{setPhoto(""); setEditedPhoto("")}} className="trash-icon" />}
                                        <FaUpload className="upload-icon" onClick={() => {console.log(inputFile); inputFile.current.click(); setIsPhotoUploading(false); setIsPhotoUploading(true)}} />
                                    </div>
                            :                                
                            <div className="user-img-container">
                                <img className="user-photo-img" src={new ImageHelper(editedPhoto).getWithPrefix()}/>
                                {!(editedPhoto.length < 1 && photo.length < 1) && <FaMinus onClick={() =>{setPhoto(""); setEditedPhoto("")}} className="trash-icon" />}
                                <FaUpload className="upload-icon" onClick={() => {console.log(inputFile); inputFile.current.click(); setIsPhotoUploading(false); setIsPhotoUploading(true)}} />
                            </div>
                    }
                    
                    <input type='file' accept="image/png, image/jpeg"  id='file' ref={inputFile} onChange={(e) => {
                        if (e.target.value.length > 0){
                            let reader = new FileReader();
                            reader.onload = () => {
                                var originalImg = new Image();
                                originalImg.src = e.target.result;
                                var x = new ImageHelper(reader.result).getResizedWithoutPrefix(720, 720, (data) => {
                                    setEditedPhoto(data)
                                });
                            };
                            reader.onerror = function (error) {
                                console.log('Error: ', error);
                            };
                            reader.readAsDataURL(e.target.files[0]);
                        }
                    }} style={{display: 'none'}}/>
                </td>
                {
                    <TrEditIcons    isConcreteEditing= {isPhotoEditing}
                                    isEditing = {isEditing} 
                                    setEditState = {setConcreteEditState} 
                                    setConcreteEditState={setIsPhotoEditingState} 
                                    pushChanges={() => {

                                        putProfile({
                                            "bPhoto": true,
                                            "Photo": editedPhoto,
                                        }, 
                                        () => {
                                            getProfile((data) => {
                                                window.location.reload();
                                                setPhoto(data.photo)
                                                setFirstName(data.name)
                                                setLastName(data.lastName)
                                                setPhoneNr(data.phoneNr)
                                                setEmail(data.email)
                                                setCourses(data.courses)
                                            })
                                            //setConcreteEditState(setIsPhotoEditingState, false)
                                        })}}/>
                }
            </tr>
            <tr className="first-name">
                <td className="profile-fieldname"><h4>Фамилия:</h4></td>
                <td className="profile-value">{isFirstNameEditing ? <input type="text" onChange={(e)=> { setEditedFirstName(e.target.value); console.log(editedFirstName) }} value={editedFirstName}/> : name}</td>
                {
                    <TrEditIcons    isConcreteEditing= {isFirstNameEditing}
                                    isEditing = {isEditing} 
                                    setEditState = {setConcreteEditState} 
                                    setConcreteEditState={setIsFirstNameEditingState} 
                                    pushChanges={() => {
                                        putProfile({
                                            "bName": true,
                                            "Name": editedFirstName,
                                        }, 
                                        () => {
                                            getProfile((data) => {
                                                setPhoto(data.photo)
                                                setFirstName(data.name)
                                                setLastName(data.lastName)
                                                setPhoneNr(data.phoneNr)
                                                setEmail(data.email)
                                                setCourses(data.courses)
                                            })
                                            setConcreteEditState(setIsFirstNameEditingState, false)                                        
                                        })
                                    }}/>
                }
            </tr>
            <tr className="last-name">
                <td className="profile-fieldname"><h4>Имя:</h4></td>
                <td className="profile-value">{isLastNameEditing ? <input type="text" onChange={(e)=> { setEditedLastName(e.target.value);}} value={editedLastName}/> : lastName}</td>  
                {                        
                    <TrEditIcons    isConcreteEditing= {isLastNameEditing}
                                    isEditing = {isEditing} 
                                    setEditState = {setConcreteEditState} 
                                    setConcreteEditState={setIsLastNameEditingState} 
                                    pushChanges={() => {
                                        putProfile({
                                            "bLastName": true,
                                            "LastName": editedLastName,
                                        }, 
                                        () => {
                                            getProfile((data) => {
                                                setPhoto(data.photo)
                                                setFirstName(data.name)
                                                setLastName(data.lastName)
                                                setPhoneNr(data.phoneNr)
                                                setEmail(data.email)
                                                setCourses(data.courses)
                                            })
                                            setConcreteEditState(setIsLastNameEditingState, false)
                                        })
                                    }}/>
                }
            </tr>
            <tr className="phoneNr">
                <td className="profile-fieldname"><h4>Моб. номер:</h4></td>
                <td className="profile-value">{isPhoneNrEditing ? <input autoFocus type="text" onChange={(e)=> {setEditedPhoneNr(e.target.value);}} value={editedPhoneNr}/> : phoneNr}</td>
                {                        
                    <TrEditIcons    isConcreteEditing= {isPhoneNrEditing}
                                    isEditing = {isEditing} 
                                    setEditState = {setConcreteEditState} 
                                    setConcreteEditState={setIsPhoneNrEditingState} 
                                    pushChanges={() => {
                                        putProfile({
                                            "bPhoneNr": true,
                                            "PhoneNr": editedPhoneNr,
                                        }, 
                                        () => {
                                            getProfile((data) => {
                                                setPhoto(data.photo)
                                                setFirstName(data.name)
                                                setLastName(data.lastName)
                                                setPhoneNr(data.phoneNr)
                                                setEmail(data.email)
                                                setCourses(data.courses)
                                            })
                                            setConcreteEditState(setIsPhoneNrEditingState, false) 
                                        })
                                    }}/>
                }
            </tr>
            <tr className="email">
                <td className="profile-fieldname"><h4>Эл. почта:</h4></td>
                <td className="profile-value">{email}</td>
                <td className="edit-icon"></td>
            </tr>
            <tr className="courses">
                <td className="profile-fieldname"><h4>Мои курсы:</h4></td>
                <td className="profile-value">{courses}</td>
                <td></td>
            </tr>
        </tbody>
    </table>);

}

const TrEditIcons = (props) => {
    return(<td className="edit-icon">
                {
                    props.isConcreteEditing ?
                    <div className="edit-icon-edit">
                        <ImCheckmark onClick={props.pushChanges} className="check-mark" /> 
                        <ImCross onClick={() => props.setEditState(props.setConcreteEditState, false)} className="cross-mark" />
                    </div>:
                    !props.isEditing &&
                    <FaPencilAlt onClick={() => props.setEditState(props.setConcreteEditState, true)}/>
                }
            </td>)
}

export default ProfileTable