import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import { projectStorage } from "../../../firebase/firebase";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
  navbar: {
    position: "relative",
    zIndex: theme.zIndex.drawer + 1,
  },
  paper: {
    height: 60,
  },
  menuIcon: {
    // width: "1.5em",
    // height: "1.5em",
    fontSize: theme.spacing(5),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [sideOpen, setSideOpen] = useState(false);
  const [u, setUrl] = useState("");

  useEffect(() => {
    projectStorage
      .ref(`/images/logo`)
      .getDownloadURL()
      .then(function (val) {
        setUrl(val);

        console.log(u);
      });
  }, []);

  const toggleSidebar = () => {
    setSideOpen(!sideOpen);
  };

  return (
    <>
      <div
        className={clsx("grow", classes.navbar)}
        classes={{ paper: classes.paper }}
      >
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              aria-label="menu"
              onClick={toggleSidebar}
            >
              <Badge badgeContent={4} color="secondary">
                <MenuIcon className={classes.menuIcon} color="secondary" />
              </Badge>
            </IconButton>
            <Typography variant="h4" className="grow" align="center">
              <Link style={{ color: "white" }} to="/">
                <img height="60" width="60" src={u}></img>
              </Link>
            </Typography>
            <div className="d-flex">
              <Link style={{ color: "white" }} to="/manager">
                <Button color="inherit">
                  <Avatar>M</Avatar>
                  Manager
                </Button>
              </Link>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <Sidebar open={sideOpen} />
    </>
  );
};

export default Navbar;
