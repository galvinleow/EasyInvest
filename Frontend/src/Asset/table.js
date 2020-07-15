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
        { title: "Asset Name", field: "name" },
        {
          title: "Interest Rate per annum (%)",
          field: "interest",
          type: "numeric",
        },
        { title: "Current Value", field: "value", type: "numeric" },
      ],
      data: [],
    };
  }

  async componentDidMount() {
    try {
      let response = await fetch("getDataFromUUID/asset/" + this.props.id, {
        method: "GET",
      });
      let responseJson = await response.json();

      if (!responseJson.error) {
        if (responseJson.asset.length) {
          const newAssets = responseJson.asset.map((asset) => {
            return {
              name: asset.name,
              interest: asset.rate,
              value: asset.amount[0].value,
              uuid: asset.uuid,
              date: asset.amount[0].date,
            };
          });
          this.setState({ data: newAssets });
          console.log(this.state.data);
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
        title="My Assets"
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
          onRowAddCancelled: (rowData) => console.log("Row adding cancelled"),
          onRowUpdateCancelled: (rowData) =>
            console.log("Row editing cancelled"),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                //need to have a function that disallow a row to be added when one of the fields are empty
                if (!newData.name | !newData.interest | !newData.value) {
                  alert("Fields cannot be empty! Please delete and add again!");
                }
                resolve();
                //to get added row after clicking add -> save
                var raw = {
                  asset: [
                    {
                      name: newData.name,
                      type: "saving",
                      rate: newData.interest,
                      amount: [
                        {
                          value: newData.value,
                          date: new Date().toLocaleDateString("en-GB"),
                        },
                      ],
                    },
                  ],
                };

                const requestOptions = {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(raw),
                  redirect: "follow",
                };

                fetch("/addAsset/" + this.props.id, requestOptions)
                  .then((response) => response.text())
                  .then((result) => console.log(result))
                  .catch((error) => console.log("error", error));

                this.setState((prevState) => {
                  const data = [...prevState.data];
                  data.push(newData);
                  return { ...prevState, data };
                });

                this.props.update();
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                if (!newData.name | !newData.interest | !newData.value) {
                  alert("Fields cannot be empty! Please delete and add again!");
                }
                resolve();
                //to get edited row after clicking edit -> save
                const raw = {
                  asset: [
                    {
                      amount: [
                        {
                          date: new Date().toLocaleDateString("en-GB"),
                          value: newData.value,
                        },
                      ],
                      name: newData.name,
                      rate: newData.interest,
                      type: "saving",
                      uuid: oldData.uuid,
                      //uuid: "3c575070-b771-11ea-979e-acde48001122",
                    },
                  ],
                };

                const requestOptions = {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(raw),
                  redirect: "follow",
                };

                fetch("/updateAsset/" + this.props.id, requestOptions)
                  .then((response) => response.text())
                  .then((result) => console.log(result))
                  .catch((error) => console.log("error", error));

                if (oldData) {
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  });
                }
                this.props.update();
              }, 600);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                //to get deleted row after clicking delete -> save
                var raw = {
                  asset: [
                    {
                      amount: [
                        {
                          date: oldData.date,
                          value: oldData.value,
                        },
                      ],
                      name: oldData.name,
                      rate: oldData.interest,
                      type: "saving",
                      uuid: oldData.uuid,
                    },
                  ],
                };

                var requestOptions = {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(raw),
                  redirect: "follow",
                };

                fetch("/deleteAsset/" + this.props.id, requestOptions)
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
