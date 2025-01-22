import { NavLink, useParams } from "react-router-dom"
import css from "./AdminCreateLesson.module.css"
import { useRef, useState } from "react"
import { postLesson } from "../../../../api/LessonsApi"
import Toastr, { errorToast, successToast } from "../../../../things/Toastr"


const AdminCreateLesson = (props) => {
    const params = useParams()

    const [name, setName] = useState(null)
    const [content, setContent] = useState(null)

    const returnRef = useRef()

    return(
        <div className={css.newLessonPage}>
            <Toastr/>
            Новый урок секции {params.sectionId}
            <input className={css.nameEditor} value={name} onChange={(e) => setName(e.target.value)}/>
            <textarea className={css.contentEditor} rows="30" cols="50" value={content} onChange={(e) => setContent(e.target.value)}/>
            <div className={css.createButton} onClick={() => {
                if(name && content && name.length > 0 && content.length > 0) 
                {
                    postLesson({
                        "name": name,
                        "content": content,
                        "sectionId": params.sectionId
                    }, () => returnRef.current.click())
                }
                else 
                {
                    if(name && name.length > 0)
                        errorToast("Контент урока отсутствует")
                    else
                        errorToast("Название урока отсутствует")
                }
            }}>
            <span>Добавить урок</span>
            </div>
            <NavLink ref={returnRef} to={`/admin/courses/lessons/${params.sectionId}`}/>
        </div>
    )
}

export default AdminCreateLesson