import React, { useState, useEffect } from 'react';
import { RadioGroup, Radio } from 'react-mdl';

const EnableProfanityFilter = (props) => {
  if(props.global_consoleDebug){
    console.log("EnableProfanityFilter: constructor(): props: ", props);
  }
  useEffect(() => {
    window.componentHandler.upgradeDom();
    setTimeout(function(){
      addClassToRadioYesNo();
    },1000);
  },[]);
  const addClassToRadioYesNo = () => {
    const labelRadioYesNo = props.enableprofanityfilter === 1 ?  document.getElementById("radio-yes").parentElement : document.getElementById("radio-no").parentElement;
    if(props.global_consoleDebug){
      console.log("EnableProfanityFilter: addClassToRadioYesNo(): labelRadioYesNo: ",labelRadioYesNo);
    }
    if(labelRadioYesNo){
      labelRadioYesNo.classList.add("is-checked");
      window.componentHandler.upgradeDom();
    }
  }
  const enableprofanityfilter = props.enableprofanityfilter;
  if(props.global_consoleDebug){
    console.log("EnableProfanityFilter: render(): enableprofanityfilter: ",enableprofanityfilter);
  }
  return (
    <div className="radio-container">
      <RadioGroup name="radio-yes-no" value={enableprofanityfilter}>
          <Radio 
          id="radio-yes" 
          value="1" 
          ripple 
          onClick={props.toggleEnableprofanityfilter.bind(this,1)}
          >
            Yes
          </Radio>
          <Radio 
          id="radio-no" 
          value="0" 
          ripple 
          onClick={props.toggleEnableprofanityfilter.bind(this,0)}
          >
            No
          </Radio>
      </RadioGroup>
    </div>
  )
}

export default EnableProfanityFilter;