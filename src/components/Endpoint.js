import React, { useState, useEffect } from 'react';
import { RadioGroup, Radio } from 'react-mdl';

const Endpoint = (props) => {
  if(props.global_consoleDebug){
    console.log("Endpoint: constructor(): props: ", props);
  }
  useEffect(() => {
    window.componentHandler.upgradeDom();
    setTimeout(function(){
      //addClassToRadioSecureInsecure();
    },1000);
  },[]);
  const addClassToRadioSecureInsecure = () => {
    const radioSecureInsecure = props.restapiEndpointType === "secure" ?  document.getElementById("radio-secure").parentElement : document.getElementById("radio-insecure").parentElement;
    if(props.global_consoleDebug){
      console.log("Endpoint: addClassToRadioSecureInsecure(): radioSecureInsecure: ",radioSecureInsecure);
    }
    if(radioSecureInsecure){
      radioSecureInsecure.classList.add("is-checked");
      window.componentHandler.upgradeDom();
    }
  }
  const restapiEndpointType = props.restapiEndpointType;
  if(props.global_consoleDebug){
    console.log("Endpoint: render(): restapiEndpointType: ",restapiEndpointType);
  }
  return (
    <p className="radio-container">
      <RadioGroup name="radio-secure-insecure" value={props.restapiEndpointType}>
          <Radio 
          value="secure" 
          ripple 
          onClick={props.toggleEndpoints.bind(this,"secure")}
          >
            Secure, slow endpoint
          </Radio>
          <Radio 
          value="insecure" 
          ripple 
          onClick={props.toggleEndpoints.bind(this,"insecure")}
          >
            Insecure, fast endpoint<br />
            <span>This may cause UX issues, depending on which device/browser is being used.</span><br />
            <span><strong>codepen.io does not allow connections to insecure resources</strong></span>
          </Radio>
      </RadioGroup>
    </p>
  )
}

export default Endpoint;