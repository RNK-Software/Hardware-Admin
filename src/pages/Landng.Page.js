import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import "../scss/style.scss";
import "../App.css";
import TheSideBar from "../Components/SideBar";
import TheHeader from "../Components/Header";
import ProducsPage from "./Products.Page";
import Dashboard from './Dashboard.Page';
import HardwarePage from "./Hardware.Page";
import DashboardHardware from './DashboardHardware.Page';
import CategoryPage from "./Category.Page";

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
                  <Route path={props.match.url + '/hardware'} component={DashboardHardware}/>
                  <Route path={props.match.url + '/add-hardware'} component={HardwarePage}/>
                  <Route path={props.match.url + '/category'} component={CategoryPage}/>
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
