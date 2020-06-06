import React, { Component } from "react";
import "../LoginStyle.scss";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.submitLogin = this.submitLogin.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  //  this.registeredUser = this.registeredUser.bind(this);
  }

  // registeredUser() {
  //   const users = this.props.users;
  //   let registered = false;
  //   for (let i = 0; i < users.length; i++) {
  //     if (
  //       users[i].username === this.state.username &&
  //       users[i].password === this.state.password
  //     ) {
  //       registered = true;
  //     }
  //   }

  //   return registered;
  //}

  submitLogin(e) {
    // const isRegistered = this.registeredUser();
    // if (isRegistered) {
    //   const profileOpen = e.target.value;
    this.props.onChange(e.target.value);
    this.props.name(this.state.username);
    // } else {
    //   alert("wrong username/ password!");
    // }
  }

  onUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  onPasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div className="inner-container">
        <div className="header">Login</div>
        <div className="box">
          <div className="input-group">
            <label className="login-label" htmlFor="username">
              Username
            </label>
            <input
              className="login-input"
              type="text"
              id="username"
              name="username"
              onChange={this.onUsernameChange}
            ></input>
          </div>
          <div className="input-group">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              className="login-input"
              type="password"
              id="password"
              name="password"
              onChange={this.onPasswordChange}
            ></input>
          </div>
          <button className="login-btn" onClick={this.submitLogin} value="true">
            Login
          </button>
        </div>
      </div>
    );
  }
}
