require('styles/Login.css');

import React from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.login = {value: ''};
        this.password = {value: ''};
        this.token = {value: ''};
        
        this.handleChange = this.handleChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }
    
    onAuthTokenClick() {
        $('#inputToken').toggle();
    }
    
    onLogin(event) {
        alert(this.login.value);
        event.preventDefault();
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    render() {
        return (
            <form className="form-signin" onSubmit={this.onLogin}>
                <h2 className="form-signin-heading">Please sign in</h2>
                    <label for="inputLogin" className="sr-only">Login</label>
                    <input type="text" id="inputLogin" value={this.login.value} onChange={this.handleChange} className="form-control" placeholder="Login" autofocus/>
                    <label for="inputPassword" className="sr-only">Password</label>
                    <input type="password" id="inputPassword" value={this.password.value} onChange={this.handleChange} className="form-control" placeholder="Password"/>
                    <p className="token-text" onClick={this.onAuthTokenClick}>or login by auth token</p>
                    <label for="inputToken" className="sr-only">Token</label>
                    <input type="text" id="inputToken" className="form-control" value={this.token.value} onChange={this.handleChange} placeholder="Auth token" autofocus/>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        );
    }
}

LoginComponent.defaultProps = {
};

export default LoginComponent;
