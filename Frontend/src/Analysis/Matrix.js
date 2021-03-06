import React, { Component } from "react";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import ViewColumn from "@material-ui/icons/ViewColumn";
import jwt_decode from "jwt-decode";

const token = localStorage.getItem("usertoken");
const decoded = jwt_decode(token);
const uuid = decoded.identity.uuid;

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Share Ticker", field: "name" },
        {
          title: "Current Ratio (Score)",
          field: "CR",
          type: "numeric",
        },
        { title: "Return on Equity (Score)", field: "ROE", type: "numeric" },
        {
          title: "Dividend Yield (Score)",
          field: "Dividend",
          type: "numeric",
        },
        {
          title: "Price per Earning (Score)",
          field: "PE",
          type: "numeric",
        },
        {
          title: "Total Score",
          field: "Score",
          type: "numeric",
        },
      ],
      data: [],
    };
  }

  //get data from database
  async componentDidMount() {
    try {
      let response = await fetch("/getWeightedScore/" + uuid, {
        method: "GET",
      });
      let responseJson = await response.json();

      if (!responseJson.error) {
        if (responseJson.watchlist.length) {
          const newShares = responseJson.watchlist.map((share) => {
            return {
              name: share.TICKER,
              CR: share["CURRENT RATIO SCORE"],
              ROE: share["RETURN ON EQUITY % SCORE"],
              Dividend: share["DIVIDENDS YIELD SCORE"],
              PE: share["PE RATIO SCORE"],
              Score: share["TOTAL SCORE %"],
            };
          });
          this.setState({ data: newShares });
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
      <MaterialTable
        icons={tableIcons}
        title="Decision Matrix"
        columns={this.state.columns}
        data={this.state.data}
        options={{
          headerStyle: {
            backgroundColor: "#3f51b5",
            color: "white",
          },
          rowStyle: {
            backgroundColor: "#EEE",
          },
          actionsColumnIndex: -1,
          search: false,
        }}
      />
    );
  }
}

export default Table;
