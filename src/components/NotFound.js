import React, { useEffect } from 'react';
import { Redirect} from "react-router-dom";

const NotFound = (props) => {
  if(props.global_consoleDebug){
    console.log("NotFound: constructor(): props: ", props);
  }
  useEffect(() => {
    window.componentHandler.upgradeDom();
  });
  return (
    <Redirect to="/" />
  )
}

export default NotFound;