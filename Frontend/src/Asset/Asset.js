import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Table from "./table.jsx";
import Analysis from "../Analysis/Analysis";
import Graph from "./graph";

export class Asset extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      analysisOpen: false,
      assetOpen: true,
      // currentData: {
      //   assetName: "",
      //   interestRate: 0,
      //   currentValue: 0,
      // },
      data: [],
    };
    this.changeState = this.changeState.bind(this);
  }

  changeState(newState) {
    this.setState({ analysisOpen: newState, assetOpen: !newState });
  }


  handleChange(data) {
    console.log(data);
  }

  render() {
    const name = this.props.name;

    if (this.state.analysisOpen) {
      return <Analysis name={name} />;
    }

    return (
      <Grid container direction="column">
        <Grid item container>
          <Grid item md={1} ></Grid>
          <Grid item md={10} sm={12}>
            {" "}
            <Graph />
          </Grid>
          <Grid item md={1}></Grid>
          <Grid item md={3} sm={1}></Grid>
          <Grid item md={6} sm={10} xs = {12}>
            <Table />
          </Grid>
          <Grid item md={3} sm={1}></Grid>
        </Grid>
      </Grid>
    );
  }
}
