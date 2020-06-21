import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Table from "./table.jsx";
import Form from "./form.jsx";
import Button from "@material-ui/core/Button";
import Analysis from "../Analysis/Analysis";

export class Asset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisOpen: false,
      assetOpen: true,
    };
    this.changeState = this.changeState.bind(this);
  }
  createData(name, interest, amount) {
    return { name, interest, amount };
  }

  changeState(newState) {
    this.setState({ analysisOpen: newState, assetOpen: !newState });
  }

  render() {
    const name = this.props.name;

    if (this.state.analysisOpen) {
      return <Analysis name={name} />;
    }

    return (
      <Grid container direction="column">
        <br />
        <br />
        <Grid item container>
          <Grid item sm={3}></Grid>
          <Grid item sm={6} xs={12}>
            <Form />
          </Grid>
          <Grid item sm={3}></Grid>

          <Grid item sm={5}></Grid>
          <Grid item sm={2} xs={12}>
            <Button variant="contained" color="primary">
              Add this asset
            </Button>
          </Grid>
          <Grid item sm={5}></Grid>
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
