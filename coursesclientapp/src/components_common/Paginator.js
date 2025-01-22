import React from "react"
import css from "./Paginator.module.css"
import { MdKeyboardArrowLeft } from "react-icons/md"
import { MdKeyboardArrowRight } from "react-icons/md"
import { MdKeyboardDoubleArrowLeft } from "react-icons/md"
import { MdKeyboardDoubleArrowRight } from "react-icons/md"

const Paginator = (props) => {
    const nums = [];
    if (props.pager == null) return
    for(let i = props.pager.startPage; i <= props.pager.endPage; i++) {
        nums.push(i);
    }
    return(<div className={css.paginatorContainer}>
        {
            props.pager.currentPage <= 1 ?
            <div className={`${css.backward}`}>
                <MdKeyboardDoubleArrowLeft />
                <MdKeyboardArrowLeft />
            </div>
            :
            <div className={`${css.backward} ${css.arrowsActive}`}>
                <MdKeyboardDoubleArrowLeft onClick={() => props.setPageNr(1)} />
                <MdKeyboardArrowLeft onClick={() => props.setPageNr(props.pager.currentPage - 1)} />
            </div>
        }

        <div className={css.pagesNr}>
            { 
                props.pager.startPage > 1 && (<div>...</div>) 
            }            
            {
                (
                    nums.map(el => (
                        el == props.pager.currentPage ?
                        <div className={css.active}>{el}</div>
                        :
                        <div className={css.number} onClick={() => props.setPageNr(el)}>{el}</div>
                    ))
                )
            } 
            { props.pager.endPage < props.pager.totalPages && (<div>...</div>) }              
        </div>
        {
            
            props.pager.currentPage >= props.pager.totalPages ?
            <div className={css.forward}>
                <MdKeyboardArrowRight />
                <MdKeyboardDoubleArrowRight />
            </div>
            :
            <div className={`${css.forward} ${css.arrowsActive}`}>
                <MdKeyboardArrowRight onClick={() => props.setPageNr(props.pager.currentPage + 1)} />
                <MdKeyboardDoubleArrowRight onClick={() => props.setPageNr(props.pager.totalPages)} />
            </div>
        }
    </div>)
}

export default Paginator