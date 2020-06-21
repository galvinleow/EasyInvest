import React from "react";
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, interest, amount) {
  return { name, interest, amount };
}

const rows = [
  createData("Standard Chartered Jumpstart Account", 2, 10000),
  createData("OCBC Savings Account", 0.1, 10000),
  createData("DBS Savings Account", 0.1, 10000),
];

export default function SimpleTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Asset Name</TableCell>
            <TableCell align="right">Interest Rate (%)</TableCell>
            <TableCell align="right">Current Value ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
                <IconButton aria-label="delete" className={classes.margin}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
              <TableCell align="right">{row.interest}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
