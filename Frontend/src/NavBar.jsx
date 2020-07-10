import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Drawer from "./Drawer.jsx";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 30,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MenuAppBar(props) {
  const classes = useStyles();
  const [analysisOpen] = useState(props.analysis);
  const [assetOpen] = useState(props.asset);

  const handleAssetChange = () => {
    props.changeAsset();
  };

  const handleAnalysisChange = () => {
    props.changeAnalysis();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("usertoken");
    window.location.href = "http://localhost:3000/";
  };

  const handleProfileClick = () => {
    props.changeProfile();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Drawer
              Asset={assetOpen}
              Analysis={analysisOpen}
              changeAsset={handleAssetChange}
              changeAnalysis={handleAnalysisChange}
            />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            EasyInvest
          </Typography>

          <div>
            <Tooltip title="Profile">
              <IconButton aria-label="Profile" onClick={handleProfileClick}>
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Log Out">
              <IconButton aria-label="Log Out" onClick={handleLogout}>
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
