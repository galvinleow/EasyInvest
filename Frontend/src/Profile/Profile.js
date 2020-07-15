import React, { Component } from "react";
import Slider from "./Slider";
import { Grid, Button } from "@material-ui/core";
import "../App.css";
import HelpIcon from "@material-ui/icons/Help";
import Tooltip from "@material-ui/core/Tooltip";
import jwt_decode from "jwt-decode";

const token = localStorage.getItem("usertoken");
const decoded = jwt_decode(token);
const uuid = decoded.identity.uuid;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      ROE: 1,
      Dividend: 1,
      EPS: 1,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCurrentChange = this.handleCurrentChange.bind(this);
    this.handleDividendChange = this.handleDividendChange.bind(this);
    this.handleEPSChange = this.handleEPSChange.bind(this);
    this.handleROEChange = this.handleROEChange.bind(this);
  }

  handleCurrentChange(value) {
    this.setState({ current: value });
  }

  handleROEChange(value) {
    this.setState({ ROE: value });
  }

  handleDividendChange(value) {
    this.setState({ Dividend: value });
  }

  handleEPSChange(value) {
    this.setState({ EPS: value });
  }

  handleSubmit() {
    alert("Ranks updated!");
    console.log(this.state);
    //get final rankings
    var raw = {
      rank: [
        {
          "DIVIDENDS YIELD": this.state.Dividend,
          "CURRENT RATIO": this.state.current,
          "PE RATIO": this.state.EPS,
          "RETURN ON EQUITY %": this.state.ROE,
        },
      ],
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    fetch("/rankAddEdit/" + uuid, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <Grid container>
        <Grid item md="3"></Grid>
        <Grid item md="6" className="centerGrid">
          <Slider
            string="Please rank Current Ratio (1 being the most important to you, 5 being the least important to you)"
            id="Current"
            handleChange={this.handleCurrentChange}
          />
        </Grid>
        <Grid item md="1">
          <Tooltip title="Current Ratio measures the company’s ability to pay off short-term liabilities with current assets">
            <HelpIcon />
          </Tooltip>
        </Grid>

        <Grid item md="2"></Grid>

        <Grid item md="3"></Grid>
        <Grid item md="6" className="centerGrid">
          <Slider
            string="Please rank Return on Equity (1 being the most important to you, 5 being the least important to you)"
            id="ROE"
            handleChange={this.handleROEChange}
          />
        </Grid>
        <Grid item md="1">
          <Tooltip title="Return on Equity measures how efficiently a company is using its equity to generate profit">
            <HelpIcon />
          </Tooltip>
        </Grid>
        <Grid item md="2"></Grid>

        <Grid item md="3"></Grid>
        <Grid item md="6" className="centerGrid">
          <Slider
            string="Please rank Dividend Yield (1 being the most important to you, 5 being the least important to you)"
            id="Dividend"
            handleChange={this.handleDividendChange}
          />
        </Grid>
        <Grid item md="1">
          <Tooltip title="Dividend Yield measures the amount of dividends attributed to shareholders relative to the market value per share">
            <HelpIcon />
          </Tooltip>
        </Grid>
        <Grid item md="2"></Grid>

        <Grid item md="3"></Grid>
        <Grid item md="6" className="centerGrid">
          <Slider
            string="Please rank Earnings per Share (1 being the most important to you, 5 being the least important to you)"
            id="EPS"
            handleChange={this.handleEPSChange}
          />
        </Grid>
        <Grid item md="1">
          <Tooltip title="Earnings per Share measures the amount of net income earned for each share outstanding">
            <HelpIcon />
          </Tooltip>
        </Grid>
        <Grid item md="2"></Grid>

        <Grid item md="5"></Grid>
        <div>
          <Grid item md="2" className="centerButton">
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              Confirm
            </Button>
          </Grid>
        </div>
        <Grid item md="5"></Grid>
      </Grid>
    );
  }
}

export default Profile;
