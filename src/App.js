import React from 'react';
import { HashRouter, Switch } from 'react-router-dom';
import './scss/style.scss';
import './App.css';
import TheSideBar from './SideBar';
import TheHeader from './Header';
import Login from './Login.Page';
function App() {
  return (
    <div className="App">
      <Login/>
    </div>
  );
}

export default App;
