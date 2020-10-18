import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import "../scss/style.scss";
import "../App.css";
import TheSideBar from "../Components/SideBar";
import TheHeader from "../Components/Header";
import ProducsPage from "./Products.Page";
import Dashboard from './Dashboard.Page';


const LandingPage = (props) => {
  return (
    <div className="App">
      <HashRouter>
        <React.Suspense>
            <div className="c-app c-default-layout">
              <TheSideBar />
              <div className="c-wrapper">
                <TheHeader />
                <Switch>
                  <Route path={props.match.url} exact component={Dashboard}/>
                  <Route path={props.match.url + '/add'} component={ProducsPage}/>
                </Switch>
                <div className="c-body">{/* <TheContent/> */}</div>
                {/* <TheFooter/> */}
              </div>
            </div>
        </React.Suspense>
      </HashRouter>
    </div>
  );
}

export default LandingPage;
