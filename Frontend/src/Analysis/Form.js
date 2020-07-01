import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [
        {
          value: "singtel",
          label: "Singtel",
        },
        {
          value: "amazon",
          label: "Amazon",
        },
        {
          value: "dbs",
          label: "DBS",
        },
        {
          value: "sembcorp",
          label: "Sembcorp Industries",
        },
      ],
      chosen: "",
    };
  }

  handleChange = (event) => {
    this.setState({ chosen: event.target.value });
  };

  render() {
    return (
      <form>
        <TextField
          id="outlined-select-currency"
          select
          label="Share Name"
          onChange={this.handleChange}
          helperText="Please select a share"
          variant="outlined"
          required
        >
          {this.state.assets.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button size="large" variant="contained" color="primary">
          Add this share
        </Button>
      </form>
    );
  }
}

export default Form;
