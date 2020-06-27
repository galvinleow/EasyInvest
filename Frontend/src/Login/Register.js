import React, { Component } from "react";

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      errors: [],
      pwdState: null,
    };
    this.submitRegister = this.submitRegister.bind(this);
    this.showWarning = this.showWarning.bind(this);
    this.removeWarning = this.removeWarning.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  submitRegister(e) {
    if (this.state.username === "") {
      this.showWarning("username", "Username cannot be empty!");
    }
    if (this.state.email === "") {
      this.showWarning("email", "Email cannot be empty!");
    }
    if (this.state.password === "") {
      this.showWarning("password", "Password cannot be empty!");
    } else {
      this.props.users(
        this.state.username,
        this.state.email,
        this.state.password
      );
    }
  }

  showWarning(element, message) {
    this.setState((prevState) => ({
      errors: [...prevState.errors, { element, message }],
    }));
  }

  removeWarning(element) {
    this.setState((prevState) => {
      let newArray = [];
      for (let i = 0; i < prevState.errors.length; i++) {
        if (prevState.errors[i].element !== element) {
          newArray.push(prevState.errors[i]);
        }
      }
      return { errors: newArray };
    });
  }

  onUsernameChange(e) {
    this.setState({ username: e.target.value });
    this.removeWarning("username");
  }

  onEmailChange(e) {
    this.setState({ email: e.target.value });
    this.removeWarning("email");
  }

  onPasswordChange(e) {
    this.setState({ password: e.target.value });
    this.removeWarning("password");

    if (e.target.value.length <= 8) {
      this.setState({ pwdState: "weak" });
    } else if (e.target.value.length > 8 && e.target.value.length <= 12) {
      this.setState({ pwdState: "medium" });
    } else if (e.target.value.length > 12) {
      this.setState({ pwdState: "strong" });
    }
  }

  render() {
    let usernameErr = null,
      emailErr = null,
      passwordErr = null;

    for (let j = 0; j < this.state.errors.length; j++) {
      if (this.state.errors[j].element === "username") {
        usernameErr = this.state.errors[j].message;
      }
      if (this.state.errors[j].element === "email") {
        emailErr = this.state.errors[j].message;
      }
      if (this.state.errors[j].element === "password") {
        passwordErr = this.state.errors[j].message;
      }
    }

    let pwdWeak = false,
      pwdMedium = false,
      pwdStrong = false;

    if (this.state.pwdState === "weak") {
      pwdWeak = true;
    } else if (this.state.pwdState === "medium") {
      pwdWeak = true;
      pwdMedium = true;
    }
    if (this.state.pwdState === "strong") {
      pwdWeak = true;
      pwdMedium = true;
      pwdStrong = true;
    }

    return (
      <form>
        <div className="inner-container">
          <div className="header">Register</div>
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
              <small className="danger-error">
                {usernameErr ? usernameErr : ""}
              </small>
            </div>

            <div className="input-group">
              <label className="login-label" htmlFor="email">
                Email
              </label>
              <input
                className="login-input"
                type="email"
                id="email"
                name="email"
                onChange={this.onEmailChange}
              ></input>
              <small className="danger-error">{emailErr ? emailErr : ""}</small>
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
              <small className="danger-error">
                {passwordErr ? passwordErr : ""}
              </small>

              {this.state.password && (
                <div className="password-state">
                  <div>Password Strength : </div>
                  <div
                    className={"pwd pwd-weak " + (pwdWeak ? "show" : "")}
                  ></div>
                  <div
                    className={"pwd pwd-medium " + (pwdMedium ? "show" : "")}
                  ></div>
                  <div
                    className={"pwd pwd-strong " + (pwdStrong ? "show" : "")}
                  ></div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="login-btn"
              onClick={this.submitRegister}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    );
  }
}
