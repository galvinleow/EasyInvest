import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function FormPropsTextFields() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField id="asset_name" label="Asset Name" variant="outlined" />

        <TextField
          id="interest_rate"
          label="Asset Interest Rate"
          type="number"
          variant="outlined"
        />
        <TextField
          id="asset_name"
          label="Current Value"
          type="number"
          variant="outlined"
        />
      </div>
    </form>
  );
}
