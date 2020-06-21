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

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Share Name</TableCell>
            <TableCell align="center">
              Current Ratio
              <ToolTip string="Measures the company’s ability to pay off short-term liabilities with current assets" />
            </TableCell>
            <TableCell align="center">
              Return on Equity (%)
              <ToolTip string="Measures how efficiently a company is using its equity to generate profit" />
            </TableCell>
            <TableCell align="center">
              Dividend Yield
              <ToolTip string="Measures the amount of dividends attributed to shareholders relative to the market value per share" />
            </TableCell>
            <TableCell align="center">
              Earnings per Share (growth)
              <ToolTip string="Earnings per Share measures the amount of net income earned for each share outstanding" />
            </TableCell>
            <TableCell align="center">Total Score</TableCell>
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
