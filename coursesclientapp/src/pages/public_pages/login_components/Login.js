import React from "react";
import LoginForm from "./LoginForm"
import axios from "axios";
import Cookies from "js-cookie";
import Footer from "../../../Footer";
import ApiUrl from "../../../api/ApiUrl";
import Toastr, { errorToast } from "../../../things/Toastr";

const baseUrl = ApiUrl + "Auth/login"

class Login extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="content-with-footer">
                <div className="login_container">
                    <Toastr />
                    <LoginForm onSubmit={this.submit} onLoginFunc={this.props.onLogin} />
                </div>
                <Footer/>
            </div>)
    }

    

    submit(e, onLogin) {
        axios.post(baseUrl, {
                Email: e.email,
                Password: e.password
            }, {
                headers:{
                    'Content-Type': 'application/json',
                }
            }
        ).catch((e) => {
            console.log("Login failed!");
            errorToast(e.response.data.message)
            console.log(e.response);
        }).then((e) => {
            if (e) {
                let id = e.data.user.id;
                let email = e.data.user.email;
                let roleEnum = e.data.user.roleEnum
                let token = e.data.token;
                Cookies.set('id', id);
                Cookies.set('email', email);
                Cookies.set('roleEnum', roleEnum);
                Cookies.set('token', token);
                console.log("Login success!");
                //document.cookie = "user="+e.user.email+
                onLogin(e.data);

            }
        });
    }


}

export default Login;