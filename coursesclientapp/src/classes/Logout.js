import Cookies from "js-cookie";

const Logout = () => {
    Cookies.set('email', "");
    Cookies.set('roleEnum', "");
    Cookies.set('token', "");
    window.location.reload();
}

export default Logout