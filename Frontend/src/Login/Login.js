import React, { Component } from "react";
import "./LoginStyle.scss";

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
  }

  submitLogin(e) {
    this.props.handleLogin(this.state.username, this.state.password);
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
