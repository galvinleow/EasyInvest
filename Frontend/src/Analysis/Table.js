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
        {
          title: "Share Ticker",
          field: "name",
        },
        {
          title: "Current Ratio",
          field: "CR",
          type: "numeric",
        },
        { title: "Return on Equity (%)", field: "ROE", type: "numeric" },
        {
          title: "Dividend Yield",
          field: "Dividend",
          type: "numeric",
        },
        {
          title: "Price per Earning",
          field: "PE",
          type: "numeric",
        },
      ],
      data: [],
    };
  }

  //data from database
  async componentDidMount() {
    try {
      let response = await fetch("/getFinancialData/" + uuid, {
        method: "GET",
      });
      let responseJson = await response.json();

      if (!responseJson.error) {
        if (responseJson.data.length) {
          const newShares = responseJson.data.map((share) => {
            return {
              name: share.TICKER,
              CR: share["CURRENT RATIO"],
              ROE: share["RETURN ON EQUITY %"],
              Dividend: share["DIVIDENDS YIELD"],
              PE: share["PE RATIO"],
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
        title="Share Details"
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
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                //to get deleted row after clicking delete -> save
                var requestOptions = {
                  method: "POST",
                  redirect: "follow",
                };

                fetch(
                  "/deleteWatchlist/" + uuid + "/" + oldData.name,
                  requestOptions
                )
                  .then((response) => response.text())
                  .then((result) => console.log(result))
                  .catch((error) => console.log("error", error));

                this.setState((prevState) => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });

                this.props.update();
              }, 600);
            }),
        }}
      />
    );
  }
}

export default Table;
