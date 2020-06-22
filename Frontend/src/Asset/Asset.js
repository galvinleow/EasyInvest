import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Table from "./table.jsx";
import Form from "./form.jsx";
import Analysis from "../Analysis/Analysis";
import Graph from "./graph";

export class Asset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisOpen: false,
      assetOpen: true,
      currentData: {
        assetName: "",
        interestRate: 0,
        currentValue: 0,
      },
      data: [],
    };

    this.addAsset = this.addAsset.bind(this);
  }

  changeState(newState) {
    this.setState({ analysisOpen: newState, assetOpen: !newState });
  }

  addAsset(newAsset) {
    this.setState({ data: [...this.state.data, newAsset] });
  }

  render() {
    const name = this.props.name;

    if (this.state.analysisOpen) {
      return <Analysis name={name} />;
    }

    return (
      <Grid container direction="column">
        <Graph />
        <br />
        <br />
        <Grid item container>
          <Grid item sm={2}></Grid>
          <Grid item sm={8} xs={12}>
            <Form onChange={this.addAsset} />
          </Grid>
          <Grid item sm={2}></Grid>
          <br />
          <br />
          <Grid item sm={1}></Grid>
          <Grid item sm={10} xs={12}>
            <Table />
          </Grid>
          <Grid item sm={1}></Grid>
        </Grid>
      </Grid>
    );
  }
}
