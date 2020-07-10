import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const ranks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
];

export default function DiscreteSlider(props) {
  const classes = useStyles();

  const handleChange = (e, value) => {
    props.handleChange(e.target.id, value);
  };
  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-custom" gutterBottom>
        {props.string}
      </Typography>
      <Slider
        step={null}
        marks={ranks}
        onChange={handleChange}
        id={props.id}
        min={1}
        max={5}
      />
    </div>
  );
}
