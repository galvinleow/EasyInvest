import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import RefreshIcon from "@material-ui/icons/Refresh";
import Button from "@material-ui/core/Button";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: [],
        datasets: [],
      },
      // Add more color for better randomization
      bgColor: [
        "rgba(255, 0, 0, 0.5)",
        "rgba(0, 255, 0, 0.5)",
        "rgba(0, 0, 255, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)",
        "rgba(255, 159, 64, 0.5)",
        "rgba(255, 99, 1, 0.5)",
        "rgb(255, 154, 162)",
        "rgb(255, 218, 193)",
        "rgb(226, 240, 203)",
        "rgb(181, 234, 215)",
        "rgb(199, 206, 234)",
      ],
      name: "React Component reload sample",
    };
    this.getRandomColor = this.getRandomColor.bind(this);
  }

  getRandomColor() {
    var item = this.state.bgColor[
      Math.floor(Math.random() * this.state.bgColor.length)
    ];
    return item;
  }

  async componentDidMount() {
    try {
      this.setState({
        chartData: {
          datasets: this.props.assets,
        },
      });
      let response = await fetch("/calculateProjected/" + this.props.id, {
        method: "GET",
      });
      let responseJson = await response.json();

      if (!responseJson.error) {
        if (responseJson.asset.length) {
          const newAssets = responseJson.asset.map((asset) => {
            return {
              label: asset.name,
              amount: asset.amount,
            };
          });

          const labelList = newAssets.map((asset) => {
            return asset.amount.map((amount) => {
              return amount.date;
            });
          });

          const dataList = newAssets.map((asset) => {
            const temp = asset.amount.map((amount) => {
              return amount.value;
            });
            return {
              label: asset.label,
              data: temp,
              backgroundColor: this.state.bgColor[
                Math.floor(Math.random() * this.state.bgColor.length)
              ],
            };
          });

          this.setState({
            chartData: { ...this.state.chartData, labels: labelList[0] },
          });
          this.setState({
            chartData: { ...this.state.chartData, datasets: dataList },
          });
          console.log(this.state.chartData.datasets);
        }
      } else {
        console("Cant Connect to Server");
      }
    } catch (err) {
      console.warn(err);
    }
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
          height="140"
          width="450"
        />
      </div>
    );
  }
}

export default Graph;
