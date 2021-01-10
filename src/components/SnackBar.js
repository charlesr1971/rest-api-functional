import React, { useState, useEffect } from 'react';
import { Snackbar } from 'react-mdl';

const SnackBar = (props) => {
  const [isSnackbarActive, setIsSnackbarActive] = useState(false);
  const [snackbarTimeout, setSnackbarTimeout] = useState(2750);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  if(props.global_consoleDebug){
    console.log("SnackBar: constructor(): props: ", props);
  }
  useEffect(() => { 
    setTimeout(function(){
      setIsSnackbarActive(props.isSnackbarActive);
      setSnackbarTimeout(props.snackbarTimeout);
      setSnackbarMessage(props.snackbarMessage);
      if(props.global_consoleDebug){
        console.log("SnackBar: componentDidMount(): isSnackbarActive: ",isSnackbarActive," snackbarTimeout: ",snackbarTimeout," snackbarMessage: ",snackbarMessage);
      }
    },1000);
  });
  const handleTimeoutSnackbar = () => {
    setIsSnackbarActive(false);
  }
  const handleClickActionSnackbar = () => {
    setIsSnackbarActive(false);
  }
  return (
    <Snackbar
      active={isSnackbarActive}
      onClick={handleClickActionSnackbar}
      onTimeout={handleTimeoutSnackbar} 
      timeout={snackbarTimeout}
      action="Close">{snackbarMessage}</Snackbar>
  );
}

export default SnackBar;