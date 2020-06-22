import React, { Component } from "react";
import { Line } from "react-chartjs-2";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: [
          "2020", "2021", "2022", "2023", "2024", "2025"
        ],
        datasets: [
          {
            label: "OCBC",
            data: [500, 1000, 1700, 2000, 2500, 3000],
            backgroundColor: "cornflowerblue",
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


  render() {
    return (
      <div className="chart">
        <Line
          data={this.state.chartData}
          options={{
            title: {
              display: true,
              text: "Projected Accumulated Savings",
              fontSize: 25
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
          height = "90"
          width = "450"
        />
      </div>
    );
  }
}

export default Graph;
