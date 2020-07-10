import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
});

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      amount: 0,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleAmountChange(e) {
    this.setState({ amount: e.target.value });
  }

  handleSubmit() {
    this.props.onSubmit(this.state.name, this.state.amount);
    //get finalised name and amount
  }
  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root} autoComplete="off">
        <TextField
          id="share_name"
          label="Share Name"
          onChange={this.handleNameChange}
          helperText="eg.AAPL"
          variant="outlined"
          required
        ></TextField>
        <TextField
          id="amount"
          type="number"
          label="Number of Shares"
          onChange={this.handleAmountChange}
          variant="outlined"
          required
        ></TextField>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
        >
          Add this share
        </Button>
      </form>
    );
  }
}

export default withStyles(useStyles)(Form);
