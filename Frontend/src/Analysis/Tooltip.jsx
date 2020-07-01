import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(2),
    },
  },
}));

export default function TriggersTooltips(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <Grid item>
          <Tooltip
            disableFocusListener
            disableTouchListener
            title={props.string}
          >
            <Button size="medium " variant="outlined" color="primary">
              {props.title}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
}
