import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Table from "./Table.js";
import Tooltip from "./Tooltip.jsx";
import "../App.css";
import Matrix from "./Matrix.js";
import Form from "./Form.js";

export class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisOpen: true,
      assetOpen: false,
    };
    this.changeState = this.changeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  changeState(newState) {
    this.setState({ analysisOpen: !newState, assetOpen: newState });
  }

  handleSubmit(name, amount) {
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
          <Grid item md={1} sm={1} />
          <Grid item md={2} sm={1}>
            <Tooltip
              contentStyle={{ backgroundColor: "blue" }}
              title="Current Ratio"
              string="Measures the company’s ability to pay off short-term liabilities with current assets"
            />
            <Tooltip
              title="Return on Equity"
              string="Measures how efficiently a company is using its equity to generate profit"
            />
            <Tooltip
              title="Dividend Yield"
              string="Measures the amount of dividends attributed to shareholders relative to the market value per share"
            />
            <Tooltip
              title="Earnings per Share"
              string="Earnings per Share measures the amount of net income earned for each share outstanding"
            />
          </Grid>
          <Grid item md={8} sm={10} xs={12} className="centerGrid">
            <Table />
          </Grid>
          <Grid item md={1} sm={1}></Grid>

          <Grid item md={1} sm={1}></Grid>
          <Grid item md={10} sm={10} xs={12}>
            <Matrix />
          </Grid>
          <Grid item md={1} sm={1}></Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Analysis;
