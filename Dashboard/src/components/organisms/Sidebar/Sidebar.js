import React from "react";
import PropTypes from "prop-types";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: 400,
    paddingTop: 60,
    height: "calc(100vh -100px)",
    backgroundColor: theme.palette.primary.main,
    "& .MuiListItem-root": {
      color: theme.palette.common.white,
      fontSize: "2em",
    },
  },
}));

const Sidebar = ({ open }) => {
  const classes = useStyles();

  return (
    <Drawer
      variant="persistent"
      //   className={classes.sidebar}
      classes={{ paper: classes.sidebar }}
      anchor="left"
      open={open}
    >
      <List>
        <ListItem>
          <Link style={{ color: "white" }} to="/">
            Dashboard
          </Link>
        </ListItem>
        <ListItem>
          <Link style={{ color: "white" }} to="/scheduler">
            Schedule
          </Link>
        </ListItem>
        <ListItem>
          <Link style={{ color: "white" }} to="/staff">
            Staff
          </Link>
        </ListItem>
        <ListItem>
          <Link style={{ color: "white" }} to="/inventory">
            Inventory
          </Link>
        </ListItem>
        <ListItem>
          <Link style={{ color: "white" }} to="/menu">
            Menu
          </Link>
        </ListItem>
        <ListItem>Settings</ListItem>
      </List>
    </Drawer>
  );
};

const linkStyle = {
  color: "#ffffff",
  textDecoration: "none",
};

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default Sidebar;
