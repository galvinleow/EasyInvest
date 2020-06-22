import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function FormPropsTextFields(props) {
  const classes = useStyles();
  const [assetName, setAssetName] = React.useState("");
  const [interestRate, setInterestRate] = React.useState(0);
  const [currentValue, setCurrentValue] = React.useState(0);
  const [data, setData] = React.useState(["ocbc"]);

  const handleNameChange = (e) => {
    setAssetName({ assetName: e.target.value });
  };

  const handleInterestChange = (e) => {
    setInterestRate({ interestRate: e.target.value });
  };

  const handleValueChange = (e) => {
    setCurrentValue({ currentValue: e.target.value });
  };

  const addAsset = (e) => {
    const newAsset = {assetName, interestRate, currentValue};
   // props.onChange(newAsset);
   //const newList = [...data, newAsset];
    setData((prevState) => ({}));
    setAssetName("");
    setInterestRate(0);
    setCurrentValue(0);
    console.log(data);
  };

  return (
    <form className={classes.root} autoComplete="off">
      <div>
        <TextField
          id="asset_name"
          label="Asset Name"
          variant="outlined"
          //value={assetName}
          onChange={handleNameChange}
        />

        <TextField
          id="interest_rate"
          label="Asset Interest Rate"
          type="number"
          variant="outlined"
          //value={interestRate}
          onChange={handleInterestChange}
        />
        <TextField
          id="current_value"
          label="Current Value"
          type="number"
          variant="outlined"
          //value={currentValue}
          onChange={handleValueChange}
        />
        <Button variant="contained" color="primary" onClick={addAsset}>
          Add this asset
        </Button>
      </div>
    </form>
  );
}
