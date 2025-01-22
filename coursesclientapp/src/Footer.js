import { FaPhone } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaViber } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import footerCSS from './Footer.module.css'

const Footer = (props) => {
    return (
        <div className={footerCSS.footer}>
            <div className={footerCSS.phoneContactContaner}>
                <FaPhone/>
                <text>+373 79997272</text>
            </div>
            <div className={footerCSS.logoWrapper}>
                <img src={require("./img/logo_incolorbalance.png")}/>
            </div>
            <div className={footerCSS.contactsContainer}>
                <FaTelegram />
                <FaViber />
                <FaInstagram />
                <FaYoutube />
                <FaFacebook />
            </div>
        </div>
    )
}

export default Footer