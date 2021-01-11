import React from 'react';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router} from "react-router-dom";
//import React, { useState } from "react";

import PageHeader from "./components/PageHeader";

import './App.css';


export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

const App = (props) => {
  const _global_remote = "community";
  let _global_restapiEndpointInsecure = "";
  let _global_restapiEndpointSecure = "";
  if(_global_remote === "playground"){
    _global_restapiEndpointInsecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "http://playground.application.me.uk/react-router-es6/assets/cfm/rest/api/v1/index.cfm";
    _global_restapiEndpointSecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "https://community.establishmindfulness.com/assets-react_es6_restapi/cfm/rest/api/v1/index.cfm";

  }
  else{
    _global_restapiEndpointInsecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "cfm/rest/api/v1/index.cfm";
    _global_restapiEndpointSecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "https://community.establishmindfulness.com/assets-react_es6_restapi/cfm/rest/api/v1/index.cfm";
  }
  const global_height = 55;
  const global_consoleDebug = false;
  const global_enableProfanityFilter = 0;
  const global_restapiEndpointInsecure = _global_restapiEndpointInsecure;
  const global_restapiEndpointSecure = _global_restapiEndpointSecure;
  if(global_consoleDebug){
    console.log("App: constructor(): props: ", props);
  }
  return (
    <Router history={history}>
      <div className="App">
        <PageHeader global_height={global_height} global_consoleDebug={global_consoleDebug}  global_enableProfanityFilter={global_enableProfanityFilter}  global_restapiEndpointInsecure={global_restapiEndpointInsecure}  global_restapiEndpointSecure={global_restapiEndpointSecure} />
      </div>
    </Router>
  );
}


export default App;
