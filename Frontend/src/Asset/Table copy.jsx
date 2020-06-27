import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import ToolTip from "./Tooltip";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(share, currentRatio, ROE, Dividend, EPS) {
  return { share, currentRatio, ROE, Dividend, EPS };
}




const rows = [createData("Amazon", 1.08, 18.58, 23.18, 0.13)];

export default function SimpleTable() {
  const classes = useStyles();
  const [assets, setState] = useState({
    assets: [],
  });
  

  useEffect(() => {
    fetch(
      "http://0.0.0.0:5200/getDataFromUUID/asset/jerY83IB35d_ivospiSm"
    ).then((response) =>
      response.json().then((data) => {
        setState({  data.asset });
      })
    );
  }, []);




  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Asset Name</TableCell>
            <TableCell align="center">Interest Rate</TableCell>
            <TableCell align="center">Current Value </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.share}>
              <TableCell component="th" scope="row">
                {row.share}
                <IconButton aria-label="delete" className={classes.margin}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center">{row.currentRatio}</TableCell>
              <TableCell align="center">{row.ROE}</TableCell>
              <TableCell align="center">{row.Dividend}</TableCell>
              <TableCell align="center">{row.EPS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
