import React from "react";
import { HashRouter, Switch } from "react-router-dom";
import "./scss/style.scss";
import "./App.css";
import TheSideBar from "./SideBar";
import TheHeader from "./Header";
function Dashboard() {
  return (
    <div className="App">
      <HashRouter>
        <React.Suspense>
          <Switch>
            <div className="c-app c-default-layout">
              <TheSideBar />
              <div className="c-wrapper">
                <TheHeader />
                <div className="c-body">{/* <TheContent/> */}</div>
                {/* <TheFooter/> */}
              </div>
            </div>
          </Switch>
        </React.Suspense>
      </HashRouter>
    </div>
  );
}

export default Dashboard;
