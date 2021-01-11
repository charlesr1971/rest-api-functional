import React from 'react';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router} from "react-router-dom";

import PageHeader from "./components/PageHeader";

import './App.css';

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

const App = (props) => {
  const _global_remote = "community";
  const endpointInsecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : ( _global_remote === "playground" ? "http://playground.application.me.uk/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "cfm/rest/api/v1/index.cfm");
  const endpointSecure = document.domain === "localhost" ? "http://localhost:8500/react/react-router-es6/assets/cfm/rest/api/v1/index.cfm" : "https://community.establishmindfulness.com/assets-react_es6_restapi/cfm/rest/api/v1/index.cfm";
  const global_height = 55;
  const global_consoleDebug = false;
  const global_enableProfanityFilter = 0;
  const global_restapiEndpointInsecure = endpointInsecure;
  const global_restapiEndpointSecure = endpointSecure;
  if(global_consoleDebug){
    console.log("App: constructor(): endpointInsecure: ", endpointInsecure," endpointSecure: ",endpointSecure);
  }
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
