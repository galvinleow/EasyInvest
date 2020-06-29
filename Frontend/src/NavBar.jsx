import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Drawer from "./Drawer.jsx";

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const name = props.name;
  const [analysisOpen] = useState(props.analysis);
  const [assetOpen] = useState(props.asset);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAssetChange = () => {
    props.changeAsset();
  };

  const handleAnalysisChange = () => {
    props.changeAnalysis();
  };

  const handleLogout = (e) => {
    // e.preventDefault()
    // localStorage.removeItem('usertoken')
    // console.log('logout')
    //props.history.push('/')
    e.preventDefault();
    localStorage.removeItem("usertoken");
    window.location.href = "http://localhost:3000/";
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
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Typography>{name}</Typography>
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem /*onClick={handleClose}*/ onClick={handleLogout}>
                Log Out
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
