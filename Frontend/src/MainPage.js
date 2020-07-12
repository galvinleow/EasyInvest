import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import { Grid } from "@material-ui/core";

const Asset = lazy(() => import("./Asset/Asset"));
const Analysis = lazy(() => import("./Analysis/Analysis"));
const Profile = lazy(() => import("./Profile/Profile"));

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
          <NavBar></NavBar>
        </Grid>
        <br />
        <br />
        <Grid item container>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/" component={Asset} />
              <Route exact path="/asset" component={Asset} />
              <Route exact path="/analysis" component={Analysis} />
              <Route exact path="/profile" component={Profile} />
            </Switch>
          </Suspense>
        </Grid>
      </Grid>
    );
  }
}

export default MainPage;
