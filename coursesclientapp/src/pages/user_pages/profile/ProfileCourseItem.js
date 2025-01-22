import { useEffect, useRef, useState } from 'react'
import ImageHelper from '../../../classes/ImageHelper'
import css from './ProfileCourseItem.module.css'
import { MdNoPhotography } from "react-icons/md";
import { NavLink } from 'react-router-dom';

const ProfileCourseItem = (props) => {
    
    const [horisontal, setHorisontal] = useState(false)

    if(props.course.image) {
        var img = new Image()
        img.onload = () => {
            img.width > img.height && setHorisontal(true)
        }
        img.src = new ImageHelper(props.course.image).getWithPrefix()
    }

    const itemRef = useRef()
    useEffect(() => {
        // const observer = new ResizeObserver(entries => {
            let style = window.getComputedStyle(itemRef.current)
            let ml = parseInt(style.getPropertyValue('margin-left'))
            let mr = parseInt(style.getPropertyValue('margin-right'))
            let bl = parseInt(style.getPropertyValue('border-left'))
            let br = parseInt(style.getPropertyValue('border-right'))
            let width = parseInt(style.getPropertyValue('width'))
            width < itemRef.current.getBoundingClientRect().width && width++
            props.onSetWidth(
                width + ml + mr + br + bl
            )
        // })
        // observer.observe(itemRef.current)

        // return () => {
        //     itemRef.current && observer.unobserve(itemRef.current)
        // }
    }, [])

    return(<NavLink className={css.item} ref={itemRef} to={`/catalog/${props.course.id}`}>
        <div className={css.imageContainer}>
            {
            props.course.image && props.course.image.length > 0 ?
                <img className={
                    horisontal ? css.imgHorisontal : css.imgVertical
                } src={ 
                    new ImageHelper(props.course.image).getWithPrefix()
                }/> :
                <MdNoPhotography className={css.noPhoto} />
            }
        </div>
        <div className={css.courseName}>
            <text>{props.course.name ? props.course.name : "-"}</text>
        </div>
    </NavLink>)
}

export default ProfileCourseItem