import React, { Component } from "react";
import NavBar from "./NavBar";
import Asset from "./Asset/Asset";
import { Analysis } from "./Analysis/Analysis";
import { Grid } from "@material-ui/core";
import Profile from "./Profile/Profile";

export class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetOpen: true,
      analysisOpen: false,
      profileOpen: false,
    };
    this.changeAsset = this.changeAsset.bind(this);
    this.changeAnalysis = this.changeAnalysis.bind(this);
    this.changeProfile = this.changeProfile.bind(this);
  }

  changeAsset() {
    this.setState({
      assetOpen: true,
      analysisOpen: false,
      profileOpen: false,
    });
  }

  changeAnalysis() {
    this.setState({
      assetOpen: false,
      analysisOpen: true,
      profileOpen: false,
    });
  }

  changeProfile() {
    this.setState({
      assetOpen: false,
      analysisOpen: false,
      profileOpen: true,
    });
  }

  render() {
    return (
      <Grid container direction="column">
        <Grid item>
          <NavBar
            changeAsset={this.changeAsset}
            changeAnalysis={this.changeAnalysis}
            changeProfile={this.changeProfile}
          ></NavBar>
        </Grid>
        <br />
        <br />
        <Grid item container>
          {this.state.assetOpen && <Asset />}
          {this.state.analysisOpen && <Analysis />}
          {this.state.profileOpen && (
            <Profile name={this.props.name} onSubmit={this.changeAnalysis} />
          )}
        </Grid>
      </Grid>
    );
  }
}

export default MainPage;
