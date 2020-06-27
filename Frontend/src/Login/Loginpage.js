import React, { Component } from "react";
import "./LoginStyle.scss";
import { Login } from "./Login";
import { Register } from "./Register";
import "../App.css";
import { Redirect } from "react-router-dom";
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
      users: [],
      errors: "",
    };

    this.showRegister = this.showRegister.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.changeState = this.changeState.bind(this);
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

    fetch("http://0.0.0.0:5200/register", requestOptions)
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

  changeState() {
    console.log("l");
    //this.setState({ profileOpen: true });
  }

  //where you can find the finalised username and password
  handleLogin(name, password) {
    //this.setState({ username: name });
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

    fetch("http://0.0.0.0:5200/login", requestOptions)
      .then((response) => response.text())
      .then((result) =>
        result === "Error - Username not found"
          ? alert("User is not registered")
          : result === "Error - Invalid password"
          ? alert("Invalid password")
          : this.setState({ ProfileOpen: true })
      )
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
          <Redirect to="./Asset" />
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
              // onChange={this.changeState}
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
