import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

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

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("usertoken");
    window.location.href = "http://localhost:3000/";
  };

  return (
    <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Link to="/asset">
              <Tooltip title="My Assets">
                <IconButton>
                  <AccountBalanceWalletIcon />
                </IconButton>
              </Tooltip>
            </Link>
            <Link to="/analysis">
              <Tooltip title="Investment Analysis">
                <IconButton>
                  <AttachMoneyIcon />
                </IconButton>
              </Tooltip>
            </Link>
            <Typography variant="h6" className={classes.title}>
              EasyInvest
            </Typography>

            <div>
              <Link to="/profile">
                <Tooltip title="Profile">
                  <IconButton>
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
              </Link>
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
