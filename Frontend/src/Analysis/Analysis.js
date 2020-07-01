import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Table from "./table.js";
import Tooltip from "./Tooltip.jsx";
import "../App.css";
import Matrix from "./Matrix.js";
import Field from "./Form.js";

export class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisOpen: true,
      assetOpen: false,
    };
    this.changeState = this.changeState.bind(this);
  }

  changeState(newState) {
    this.setState({ analysisOpen: !newState, assetOpen: newState });
  }

  render() {
    return (
      <Grid container direction="column">
        <Grid item container>
          <Grid item md={5} sm={1} />
          <Grid item md={3} sm={12}>
            <Field />
          </Grid>
          <Grid item md={4} sm={1} />
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
          <Grid item md={8} sm={10} xs={12}>
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
