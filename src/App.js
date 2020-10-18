import React, { useContext } from "react";
import "./scss/style.scss";
import "./App.css";
import Login from "./pages/Login.Page";
import Dashboard from "./pages/Landng.Page";
import { AuthContext } from "./providers/authProvider";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";

const App = () => {
  const user = useContext(AuthContext);
  let redirect = null;

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
    redirect = <Redirect to="/dashboard"/>
    
  }

return <HashRouter>{routes}{redirect}</HashRouter>;
};

export default App;
