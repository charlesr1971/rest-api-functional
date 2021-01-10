import React, { useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router} from "react-router-dom";
//import React, { useState } from "react";

import PageHeader from "./components/PageHeader";

import './App.css';

const global_height = 55;
const global_consoleDebug = false;
const global_enableProfanityFilter = 0;

const global_remote = "community";

let global_restapiEndpointInsecure = "";
let global_restapiEndpointSecure = "";

if(global_remote === "playground"){

  global_restapiEndpointInsecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "http://playground.application.me.uk/react-router-es6/assets/cfm/rest/api/v1/index.cfm";
  global_restapiEndpointSecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "https://community.establishmindfulness.com/assets-react_es6_restapi/cfm/rest/api/v1/index.cfm";

}
else{

  global_restapiEndpointInsecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "cfm/rest/api/v1/index.cfm";
  global_restapiEndpointSecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "https://community.establishmindfulness.com/assets-react_es6_restapi/cfm/rest/api/v1/index.cfm";

}

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

const App = (props) => {
  const [global_height, setGlobal_height] = useState(global_height);
  const [global_consoleDebug, setGlobal_consoleDebug] = useState(global_consoleDebug);
  const [global_enableProfanityFilter, setGlobal_consoleDebug] = useState(global_enableProfanityFilter);
  const [global_restapiEndpointInsecure, setGlobal_restapiEndpointInsecure] = useState(global_restapiEndpointInsecure);
  const [global_restapiEndpointSecure, setGlobal_restapiEndpointSecure] = useState(global_restapiEndpointSecure);
  if(global_consoleDebug){
    console.log("App: constructor(): props: ", props);
  }
  useEffect(() => {
    window.componentHandler.upgradeDom();
  });
  return (
    <Router history={history}>
      <div className="App">
        <PageHeader global_height={global_height} global_consoleDebug={global_consoleDebug}  global_enableProfanityFilter={global_enableProfanityFilter}  global_restapiEndpointInsecure={global_restapiEndpointInsecure}  global_restapiEndpointSecure={global_restapiEndpointSecure} />
      </div>
    </Router>
  );
}


export default App;
