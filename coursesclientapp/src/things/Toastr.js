import React from "react";
import css from './Toaster.module.css'
import toast, { Toaster } from "react-hot-toast";

const Toastr = (props) => {
    return(
        <Toaster
            containerClassName={css.toasterWrapper}
            position="bottom-center"/>)
}

const successToast = (message) => {
    toast.success(message, {
        duration: 3000,
        gutter: 8,
        style: {
            borderRadius: '10px',
            background: "#2129347d",
            color: '#fff',
            'font-weight': '500',
            'font-size': '14px',
        },
    })
}

const errorToast = (message) => {
    toast.error(message, {
        duration: 3000,
        gutter: 8,
        style: {
            borderRadius: '10px',
            background: "#2129347d",
            color: '#fff',
            'font-weight': '500',
            'font-size': '14px',
        },
    })
}

export default Toastr
export { successToast, errorToast}