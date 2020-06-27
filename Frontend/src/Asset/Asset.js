import React, { Component, useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Table from "./table.jsx";
import Analysis from "../Analysis/Analysis";
import Graph from "./graph";

export default function Asset(props) {
  const [state, setState] = useState({
    analysisOpen: false,
    assetOpen: true,
    data: [],
    assets: [],
  });

  useEffect(() => {
    fetch(
      "http://0.0.0.0:5200/getDataFromUUID/asset/jerY83IB35d_ivospiSm"
    ).then((response) =>
      response.json().then((data) => {
        setState({ assets: data.asset });
      })
    );
  }, []);

  if (state.analysisOpen) {
    return <Analysis name={props.name} />;
  }

  return (
    <Grid container direction="column">
      <Grid item container>
        <Grid item md={1}></Grid>
        <Grid item md={10} sm={12}>
          {" "}
          <Graph />
        </Grid>
        <Grid item md={1}></Grid>
        <Grid item md={3} sm={1}></Grid>
        <Grid item md={6} sm={10} xs={12}>
          <Table assets={state.assets} />
        </Grid>
        <Grid item md={3} sm={1}></Grid>
      </Grid>
    </Grid>
  );
}
