import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import jwt_decode from 'jwt-decode'

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
        datasets: [
          {
            label: "OCBC",
            data: this.getData.amount,
            backgroundColor: "royalblue",
          },
          {
            label: "DBS",
            data: [200, 600, 700, 100, 1500, 3000],
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      },
    };
  }

  getData() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    const uuid = decoded.identity.uuid
    console.log(uuid)
    fetch(
      "/calculateProjected/" + uuid,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <div className="chart">
        <Line
          data={this.state.chartData}
          options={{
            title: {
              display: true,
              text: "Projected Accumulated Savings",
              fontSize: 25,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
          height="120"
          width="450"
        />
      </div>
    );
  }
}

export default Graph;
