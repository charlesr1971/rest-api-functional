import React, { useState, useEffect } from 'react';
import { Checkbox } from 'react-mdl';
import { BrowserRouter as Router, Link } from "react-router-dom";

const ToDo = (props) => {
  const height = props.global_height;
  const [top, setTop] = useState(height);
  if(props.global_consoleDebug){
    console.log("ToDo: constructor(): props: ", props);
  }
  useEffect(() => {
    window.componentHandler.upgradeDom();
  },[]);
  let defaultClass = "callout display-enter-active";
  defaultClass += props.done ? " callout-success" : " callout-info";
  const id1 = "callout-" + props.keyRef;
  const id2 = "checkbox-" + props.keyRef;
  const defaultStyle = {
    top: props.keyRef * top + "px"
  };
  const link = "/post/" + props.slug;
  return (
    <div className={defaultClass} style={defaultStyle} id={id1}>
      <i
        className="fa fa-arrow-circle-o-up"
        onClick={props.moveUp}
      ></i>
      <i
        className="fa fa-arrow-circle-o-down"
        onClick={props.moveDown}
      ></i>
      <Link to={{
        pathname: link,
        state: {
          id: props.keyRef,
          slug: props.slug,
          title: props.title,
          content: props.content,
          done: true,
          createdAt: props.createdAt,
          postid: props.postid
        }
      }}>
        <i className="fa fa-link"></i>
      </Link>
      <Checkbox 
        id={id2} 
        label={props.title} 
        onChange={props.removeTodo} 
        ripple 
        checked
        />
      <div className="createdat-container">{props.createdAt}</div>
    </div>
  );
}

export default ToDo;