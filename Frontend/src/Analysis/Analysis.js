import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import Table from "./Table.js";
import Tooltip from "./Tooltip.jsx";
import "../App.css";
import Matrix from "./Matrix.js";
import Form from "./Form.js";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

const token = localStorage.getItem("usertoken");
const decoded = jwt_decode(token);
const uuid = decoded.identity.uuid;
console.log(uuid);

export class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: 0,
      ranks: [],
      current: 0,
      ROE: 0,
      dividend: 0,
      EPS: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.update = this.update.bind(this);
  }

  async componentDidMount() {
    try {
      let response = await fetch("getDataFromUUID/rank/" + uuid, {
        method: "GET",
      });
      let responseJson = await response.json();

      if (!responseJson.error) {
        if (responseJson.rank.length) {
          responseJson.rank.map((ratio) => {
            this.setState({
              current: ratio["CURRENT RATIO"],
              ROE: ratio["RETURN ON EQUITY %"],
              dividend: ratio["DIVIDENDS YIELD"],
              EPS: ratio["PE RATIO"],
            });
          });
        }
      } else {
        console("Cant Connect to Server");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  handleSubmit(name) {
    //add shares to database
    var requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    fetch("/addWatchlist/" + uuid + "/" + name, requestOptions)
      .then((response) => response.text())
      .then((result) =>
        //console.log(result)
        result ===
        "Error - Ticker already exist in watchlist: [watchlist] & [" +
          uuid +
          "]"
          ? alert("Share already exists!")
          : result === "Error - Currently do not support this ticker"
          ? alert("Currently do not support this ticker")
          : console.log(result)
      )
      .catch((error) => console.log("error", error));

    this.setState({ refresh: this.state.refresh - 1 });
  }

  update() {
    this.setState({ refresh: this.state.refresh + 1 });
  }

  render() {
    return (
      <Grid container direction="column">
        <Grid item container>
          <Grid item md={3} sm={0} />
          <Grid item md={6} sm={12} className="centerGrid">
            <Form key={this.state.refresh} onSubmit={this.handleSubmit} />
          </Grid>
          <Grid item md={3} sm={0} />
        </Grid>

        <Grid item container align="center">
          <Grid item md={1} sm={0} />
          <Grid item md={3} sm={2} xs={0}>
            <Tooltip
              title={"Current Ratio (Rank: " + this.state.current + ")"}
              string="Measures the company’s ability to pay off short-term liabilities with current assets"
            />

            <Tooltip
              title={"Return on Equity (Rank: " + this.state.ROE + ")"}
              string="Measures how efficiently a company is using its equity to generate profit"
            />
            <Tooltip
              title={"Dividend Yield (Rank: " + this.state.dividend + ")"}
              string="Measures the amount of dividends attributed to shareholders relative to the market value per share"
            />
            <Tooltip
              title={"Earnings per Share (Rank: " + this.state.EPS + ")"}
              string="Measures the amount of net income earned for each share outstanding"
            />
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" size="medium">
                Modify Ranks
              </Button>
            </Link>
          </Grid>
          <Grid item md={7} sm={10} xs={12} className="centerGrid">
            <Table key={this.state.refresh} update={this.update} />
          </Grid>
          <Grid item md={1} sm={0} xs={0}></Grid>
        </Grid>

        <Grid item container>
          <Grid item md={1} sm={0}></Grid>
          <Grid item md={10} sm={12}>
            <Matrix key={this.state.refresh} />
          </Grid>
          <Grid item md={1} sm={0}></Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Analysis;
