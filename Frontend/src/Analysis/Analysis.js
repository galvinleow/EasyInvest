import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import Table from "./Table.js";
import Tooltip from "./Tooltip.jsx";
import "../App.css";
import Matrix from "./Matrix.js";
import Form from "./Form.js";
import { Link } from "react-router-dom";

export class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ranks: {
        current: 3,
        ROE: 3,
        dividend: 3,
        EPS: 3,
      },
      refresh: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(name, amount) {
   //add shares to database
    var raw = {
      shares: [
        {
          name: name,
          amount: amount,
        },
      ],
    };

    var requestOptions = {
      method: "POST",
      body: raw,
      redirect: "follow",
    };

    fetch("/addShares/" + this.props.id, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    

    this.setState({ refresh: 5 });
  }

  render() {
    return (
      <Grid container direction="column">
        <Grid item container>
          <Grid item md={3} sm={1} />
          <Grid item md={6} sm={12} className="centerGrid">
            <Form onSubmit={this.handleSubmit} />
          </Grid>
          <Grid item md={3} sm={1} />
        </Grid>

        <Grid item container>
          <Grid item md={1} sm={1} />
          <Grid item md={3}>
            <Tooltip
              title={"Current Ratio (Rank: " + this.state.ranks.current + ")"}
              string="Measures the company’s ability to pay off short-term liabilities with current assets"
            />

            <Tooltip
              title={"Return on Equity (Rank: " + this.state.ranks.ROE + ")"}
              string="Measures how efficiently a company is using its equity to generate profit"
            />
            <Tooltip
              title={"Dividend Yield (Rank: " + this.state.ranks.dividend + ")"}
              string="Measures the amount of dividends attributed to shareholders relative to the market value per share"
            />
            <Tooltip
              title={"Earnings per Share (Rank: " + this.state.ranks.EPS + ")"}
              string="Measures the amount of net income earned for each share outstanding"
            />
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary">
                Modify Ranks
              </Button>
            </Link>
          </Grid>
          <Grid item md={7} sm={10} xs={12} className="centerGrid">
            <Table refresh={this.state.refresh} />
          </Grid>
          <Grid item md={1} sm={1}></Grid>
        </Grid>

        <Grid item container>
          <Grid item md={1} sm={1}></Grid>
          <Grid item md={10} sm={10} xs={12}>
            <Matrix refresh={this.state.refresh} />
          </Grid>
          <Grid item md={1} sm={1}></Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Analysis;
