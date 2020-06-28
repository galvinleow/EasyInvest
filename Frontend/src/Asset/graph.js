import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import jwt_decode from 'jwt-decode'

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: [],
        datasets: [
          // {
          //   label: "OCBC",
          //   data: [0],
          //   backgroundColor: "royalblue",
          // },
          // {
          //   label: "DBS",
          //   data: [200, 600, 700, 100, 1500, 3000],
          //   backgroundColor: "rgba(255, 99, 132, 0.6)",
          // },
        ],
      },
    };
  }

  async componentDidMount() {
    try {
      let response = await fetch("/calculateProjected/" + this.props.id, {
        method: "GET",
      });
      let responseJson = await response.json();

      if (!responseJson.error) {
        if (responseJson.asset.length) {
          const newAssets = responseJson.asset.map((asset) => {
            return {
              label: asset.name,
              amount: asset.amount
            };
          });

          const labelList = newAssets.map((asset) => {
            return asset.amount.map(amount => {
              return amount.date
            })
          })

          const dataList = newAssets.map((asset) => {
            const temp =asset.amount.map(amount => {
              return amount.value
            })
            return {
              label: asset.label,
              data: temp,
              // backgroundColor: "rgba(255, 99, 132, 0.6)"
            }
          })

          // console.log(dataList)
          this.setState({ chartData: { ...this.state.chartData, labels: labelList[0]} });
          this.setState({ chartData: { ...this.state.chartData, datasets: dataList} });
          // console.log(this.state.chartData.datasets);
        }
      } else {
        console("Cant Connect to Server");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  // getData() {
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };

  //   const token = localStorage.usertoken
  //   const decoded = jwt_decode(token)
  //   const uuid = decoded.identity.uuid
  //   console.log(uuid)
  //   fetch(
  //     "/calculateProjected/" + uuid,
  //     requestOptions
  //   )
  //     .then((response) => response.text())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log("error", error));
  // }

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
