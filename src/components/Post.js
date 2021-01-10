import React, { useState, useEffect } from 'react';
import { Card, CardText, CardTitle, CardActions, CardMenu, IconButton  } from 'react-mdl';

const Post = (props) => {
  if(props.global_consoleDebug){
    console.log("Post: constructor(): props: ", props);
  }
  useEffect(() => {
    window.componentHandler.upgradeDom();
  });
  const display = props.id1 === props.id2 ? "block" : "none";
  const defaultStyle1 = {
    display: display
  };
  const defaultStyle2 = {
    padding: "20px"
  };
  let optsClassName1 = {};
  optsClassName1['className'] = "demo-card-wide";
  let optsClassName2 = {};
  optsClassName2['className'] = "post";
  return (
    <Card shadow={0} {...optsClassName1} style={defaultStyle1}>
      <CardTitle {...optsClassName2}>
        <h2 className="mdl-card__title-text">{props.title}</h2>
      </CardTitle>
      <CardText>
        {props.createdAt}
        <i className="fa fa-trash" onClick={props.removeTodo}></i>
      </CardText>
      <CardActions border>
        <div className="todo-container" style={defaultStyle2}>
          {props.content}
        </div>
      </CardActions>
      <CardMenu style={{color: '#fff'}}>
        <IconButton name="share" onClick={props.openModal("Share","Click below to share","",2)} />
      </CardMenu>
    </Card>
  );
}

export default Post;