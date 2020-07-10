import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Table from "./table.js";
import Analysis from "../Analysis/Analysis";
import Graph from "./graph";
import jwt_decode from "jwt-decode";

export default function Asset(props) {
  const [state, setState] = useState({
    analysisOpen: false,
    assetOpen: true,
    data: 5,
    assets: [],
  });

  const token = localStorage.getItem("usertoken");
  const decoded = jwt_decode(token);
  const uuid = decoded.identity.uuid;

  useEffect(() => {
    fetch("getDataFromUUID/asset/" + uuid).then((response) =>
      response.json().then((data) => {
        setState({ assets: data.asset });
      })
    );
  });

  if (state.analysisOpen) {
    return <Analysis name={props.name} id={uuid} />;
  }

  return (
    <Grid container direction="column">
      <Grid item container>
        <Grid item md={1}></Grid>
        <Grid item md={10} sm={12}>
          {" "}
          <Graph id={uuid} />
        </Grid>
        <Grid item md={1}></Grid>
        <Grid item md={3} sm={1}></Grid>
        <Grid item md={6} sm={10} xs={12}>
          <Table assets={state.assets} id={uuid} />
        </Grid>
        <Grid item md={3} sm={1}></Grid>
      </Grid>
    </Grid>
  );
}
