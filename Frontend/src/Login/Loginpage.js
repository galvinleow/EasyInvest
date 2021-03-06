import React, { Component } from "react";
import "./LoginStyle.scss";
import { Login } from "./Login";
import { Register } from "./Register";
import "../App.css";
import { MainPage } from "../MainPage";

export class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LoginOpen: true,
      RegisterOpen: false,
      ProfileOpen: false,
      username: "",
      password: "",
    };

    this.showRegister = this.showRegister.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegister(username, email, password) {
    const raw = {
      username: username,
      email: email,
      password: password,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    fetch("/register", requestOptions)
      .then((response) => response.text())
      .then((result) =>
        result === "Username already exist"
          ? alert(
              "User has already been registered. Please login/ choose another username."
            )
          : alert(username + " registered!")
      )
      .catch((error) => console.log("error", error));
  }

  //where you can find the finalised username and password
  handleLogin(name, password) {
    const raw = {
      username: name,
      password: password,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    fetch("/login", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result === "Error - Username not found") {
          alert("User is not registered");
        } else if (result === "Error - Invalid password") {
          alert("Invalid password");
        } else {
          const res = JSON.parse(String(result));
          localStorage.setItem("usertoken", res.token);
          this.setState({ ProfileOpen: true });
        }
      })
      .catch((error) => console.log("errors", error));
  }

  showRegister() {
    this.setState({ LoginOpen: false, RegisterOpen: true });
  }

  showLogin() {
    this.setState({ LoginOpen: true, RegisterOpen: false });
  }

  render() {
    if (this.state.ProfileOpen) {
      return (
        <div>
          <MainPage name={this.state.username} />
        </div>
      );
    }

    return (
      <div className="root-container">
        <h1 className="page-header">EasyInvest</h1>
        <h2 className="cursive">
          <em>An online platform that manages your wealth</em>
        </h2>
        <div className="box-controller">
          <div
            className={
              "controller " +
              (this.state.LoginOpen ? "selected-controller" : "")
            }
            onClick={this.showLogin}
          >
            Login
          </div>
          <div
            className={
              "controller " +
              (this.state.RegisterOpen ? "selected-controller" : "")
            }
            onClick={this.showRegister}
          >
            Register
          </div>
        </div>

        <div className="box-container">
          {this.state.LoginOpen && (
            <Login
              profileOpen={this.state.ProfileOpen}
              handleLogin={this.handleLogin}
              users={this.state.users}
            />
          )}
          {this.state.RegisterOpen && <Register users={this.handleRegister} />}
        </div>
      </div>
    );
  }
}
