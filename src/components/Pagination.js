import React from 'react';

const Pagination = (props) => {
  if(props.global_consoleDebug){
    console.log("Pagination: constructor(): props: ", props);
  }
  const page = props.page;
  const pageMax = parseInt(props.maxpostpage + 1);
  let ordinal = props.ordinal;
  if(props.global_consoleDebug){
    console.log('Pagination: render(): pageMax:', pageMax,' props.page: ',props.page,' props.ordinal: ',props.ordinal);
  }
  let optsClassName = {};
  if(props.page >= pageMax && props.maxpostpage === props.ordinal) {
    optsClassName['className'] = "max";
    ordinal = page;
  }
  else{
    if(page === props.ordinal) {
      optsClassName['className'] = "current";
    }
  }
  let defaultStyle = {
    display: "inline-block"
  };
  if(props.pages > props.maxpostpage && props.ordinal > props.maxpostpage) {
    defaultStyle = {
      display: "none"
    };
  }
  if(props.global_consoleDebug){
    console.log('Pagination: render(): optsClassName: ', optsClassName);
  }
  return (
    <span style={defaultStyle} {...optsClassName}>
      <span onClick={props.readPost}>{ordinal}</span>
    </span>
  )
}

export default Pagination;