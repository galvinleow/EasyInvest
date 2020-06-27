import React, { useEffect, useState } from "react";
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

export default function MaterialTableDemo(props) {
  const uuid = props.id;

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
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  const allAssets = props.assets;

  function createData(name, interest, value) {
    return { name: name, interest: interest, value: value };
  }


  const dataList = allAssets.map((asset) =>
    createData(asset.name, asset.rate, asset.amount[0].value)
  );
  // setState({data: dataList});
  console.log(dataList);

  const [state, setState] = React.useState({
    columns: [
      { title: "Asset Name", field: "name" },
      {
        title: "Interest Rate per annum (%)",
        field: "interest",
        type: "numeric",
      },
      { title: "Current Value", field: "value", type: "numeric" },
    ],
    //to loop through database
    data: dataList,
  });

  return (
    <MaterialTable
      icons={tableIcons}
      title="My Assets"
      columns={state.columns}
      data={state.data}
      options={{
        headerStyle: {
          backgroundColor: "royalblue",
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
        onRowUpdateCancelled: (rowData) => console.log("Row editing cancelled"),
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
                        date: new Date().toLocaleDateString(),
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

              fetch("http://0.0.0.0:5200/addAsset/" + uuid, requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.log("error", error));

              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              //to get edited row after clicking edit -> save
              const raw = {
                asset: [
                  {
                    amount: [
                      {
                        date: new Date().toLocaleDateString(),
                        value: "1",
                      },
                    ],
                    name: "sc",
                    rate: "1",
                    type: "saving",
                    uuid: "3c575070-b771-11ea-979e-acde48001122",
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

              fetch("http://0.0.0.0:5200/updateAsset/" + uuid, requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.log("error", error));

              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
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
                        date: "11/03/2020",
                        value: "100000",
                      },
                    ],
                    name: "DBS",
                    rate: "5",
                    type: "saving",
                    uuid: "bcc33675-b770-11ea-9dc9-acde48001122",
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

              fetch("http://0.0.0.0:5200/deleteAsset/" + uuid, requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.log("error", error));

              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}
