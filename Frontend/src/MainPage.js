import React, { Component } from "react";
import NavBar from "./NavBar";
import Asset from "./Asset/Asset";
import { Analysis } from "./Analysis/Analysis";
import { Grid } from "@material-ui/core";

export class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetOpen: true,
      analysisOpen: false,
    };
    this.changeAsset = this.changeAsset.bind(this);
    this.changeAnalysis = this.changeAnalysis.bind(this);
  }

  changeAsset() {
    this.setState({
      assetOpen: true,
      analysisOpen: false,
    });
  }

  changeAnalysis() {
    this.setState({
      assetOpen: false,
      analysisOpen: true,
    });
  }

  render() {
    return (
      <Grid container direction="column">
        <Grid item>
          <NavBar
            name={this.props.name}
            asset={this.assetOpen}
            analysis={this.analysisOpen}
            changeAsset={this.changeAsset}
            changeAnalysis={this.changeAnalysis}
          ></NavBar>
        </Grid>
        <br />
        <br />
        <Grid item container>
          {this.state.assetOpen && <Asset />}
          {this.state.analysisOpen && <Analysis />}
        </Grid>
      </Grid>
    );
  }
}

export default MainPage;
