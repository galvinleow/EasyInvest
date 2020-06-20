import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import NavBar from "./NavBar";
import Table from "./table.jsx";
import Form from "./form.jsx";
import Button from "@material-ui/core/Button";

export class Asset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysisOpen: false,
    };
  }

  render() {
    // const name = this.props.name;
    return (
      <Grid container direction="column">
        <Grid item>
          <NavBar></NavBar>
        </Grid>
        <br />
        <br />
        <Grid item container>
          <Grid item sm={3} xs={0}></Grid>
          <Grid item sm={6} xs={12}>
            <Form />
          </Grid>
          <Grid item sm={3} xs={0}></Grid>

          <Grid item sm={5} xs={0}></Grid>
          <Grid item sm={2} xs={12}>
            <Button variant="contained" color="primary">
              Add this asset
            </Button>
          </Grid>
          <Grid item sm={5} xs={0}></Grid>
          <br />
          <br />

          <Grid item sm={1} xs={0}></Grid>
          <Grid item sm={10} xs={12}>
            <Table />
          </Grid>
          <Grid item sm={1} xs={0}></Grid>
        </Grid>
      </Grid>
    );
  }
}
