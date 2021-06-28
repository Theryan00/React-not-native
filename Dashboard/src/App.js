import React, { useState } from "react";
import {
  createMuiTheme,
  MuiThemeProvider,
  CssBaseline,
} from "@material-ui/core";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import GlobalStyle from "./GlobalStyle";
import theme from "./theme";
import { lightTheme, darkTheme } from "./theme";
import Inventory from "./pages/Inventory/Inventory";
import { Staff } from "./pages/Staff/Staff";
import Menu from "./pages/Menu/Menu";
import Scheduler from "./pages/Schedule/Scheduler";
import { Manager } from "./pages/Manager/Manager";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

function App(props) {
  const { isAuthenticated, isVerifying } = props;

  return (
    <BrowserRouter>
      <Switch>
        <MuiThemeProvider theme={darkTheme}>
          <CssBaseline />
          <GlobalStyle />
          <ProtectedRoute
            exact
            path="/"
            component={Home}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
          />

          <Route path="/login" component={Login} />
          <Route path="/scheduler" render={(props) => <Scheduler />} />
          <Route path="/inventory" render={(props) => <Inventory />} />
          <Route path="/staff" component={Staff} />
          <Route exact path="/menu" component={Menu} />
          <Route path="/manager" component={Manager} />
        </MuiThemeProvider>
      </Switch>
    </BrowserRouter>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

export default connect(mapStateToProps)(App);
