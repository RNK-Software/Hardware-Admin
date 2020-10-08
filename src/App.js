import React, { Component, useContext } from "react";
import "./scss/style.scss";
import "./App.css";
import TheSideBar from "./SideBar";
import TheHeader from "./Header";
import Login from "./Login.Page";
import Dashboard from "./Landng.Page";
import * as firebase from "./utilities/firebase";
import { AuthContext } from "./providers/authProvider";
import { HashRouter, Switch, Route } from "react-router-dom";

const App = () => {
  const user = useContext(AuthContext);

  let routes = (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
    </Switch>
  );

  if (user) {
    routes = (
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    );
  }

  return <HashRouter>{routes}</HashRouter>;
};

export default App;
