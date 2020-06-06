import React from "react";
import ReactDOM from "react-dom";
import "./LoginStyle.scss";
import { LoginPage } from "./Loginpage";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(<BrowserRouter><LoginPage /></BrowserRouter>, document.getElementById("root"));

