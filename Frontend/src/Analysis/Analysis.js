import React, { Component } from "react";
import Table from "./Table.jsx";


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
      <Table />
    );
  }
}

export default Analysis;