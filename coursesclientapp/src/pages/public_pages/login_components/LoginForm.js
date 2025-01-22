import React from "react";
import './Login.css';
import './Checkbox.css';
import { AiOutlineUser } from "react-icons/ai";

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            remember: false
        }
    }
    render() {
        return (
            <div className="login-box">
            <h2>Авторизация</h2>
            <form>
                <div className="user-box">
                <input type="text" onChange={(e) => this.setState({ email:  e.target.value })}/>
                <label>Эл. почта</label>
                </div>
                <div className="user-box">
                <input type="password"  onChange={(e) => this.setState({ password:  e.target.value })}/>
                <label>Пароль</label>
                </div>
                <div className="enter-box">
                    <button type="submit"  onClick={(e) => {
                        e.preventDefault();
                        this.props.onSubmit({
                            email: this.state.email,
                            password: this.state.password,
                            remember: this.state.remember
                        }, this.props.onLoginFunc
                    )}}>
                    Вход
                    </button>
                    <div class="checkbox-wrapper-1">
                        <input id="example-1" class="substituted" type="checkbox" aria-hidden="true" />
                        <label for="example-1">Запомнить</label>
                    </div>
                </div>
            </form>
            </div>
        );
    }
}

export default LoginForm

