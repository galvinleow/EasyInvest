import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import HelpIcon from "@material-ui/icons/Help";


export default function TriggersTooltips(props) {
  return (
    <div>
      <Grid container justify="center">
        <Grid item>
          <Tooltip
            disableFocusListener
            disableTouchListener
            title={props.string}
          >
            <Button>
              <HelpIcon fontSize="small" />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
}
