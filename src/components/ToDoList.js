import React, { useState, useEffect } from 'react';
import { Textfield, Button, Spinner, Card, CardText, CardTitle, CardActions, CardMenu, IconButton  } from 'react-mdl';
import { CSSPlugin, TweenMax, Elastic } from "gsap";
import { BrowserRouter as Router, Redirect } from "react-router-dom";

import ToDo from "./ToDo";
import Post from "./Post";
import Pagination from "./Pagination";
import Endpoint from "./Endpoint";
import EnableProfanityFilter from "./EnableProfanityFilter";

const ToDoList = (props) => {
  const height = props.global_height;
  const [todos, setTodos] = useState(props.posts);
  const [inputValue, setInputValue] = useState(props.inputValue);
  const [contentValue, setContentValue] = useState("");
  const [movementMatrix, setMovementMatrix] = useState([]);
  const [reorderClicked, setReorderClicked] = useState(false);
  const [slug, setSlug] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [postCount, setPostCount] = useState(props.postCount);
  const [postCountPrev, setPostCountPrev] = useState(props.postCountPrev);
  const [addToDo, setAddToDo] = useState(false);
  const [pages, setPages] = useState(props.pages);
  const [page, setPage] = useState(props.page);
  const [enableprofanityfilter, setEnableprofanityfilter] = useState(props.global_enableProfanityFilter);
  if(props.global_consoleDebug){
    console.log("ToDoList: constructor(): props: ", props);
  }
  useEffect(() => {
    if (reorderClicked) {
      movementMatrix.map((child, index) => {
      const domNode = document.getElementById("callout-" + child["index"]);
      // START CREDITS
      // Author: Joshua Comeau
      // Link: https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd
      /* 
          
        Notes: 
        
        This is where the magic happens that allows us to reorder a list based on its array index. 
        Ingenious solution, using requestAnimationFrame(). 
        This type of animation cannot be achieved by using 'react-spring' or CSSTransition
        
      */
      if (domNode) {
        requestAnimationFrame(() => {
          domNode.style.transform = `translateY(${child.top}px)`;
          domNode.style.transition = "transform 0s";
          requestAnimationFrame(() => {
            domNode.style.transform = "";
            domNode.style.transition =
            "transform 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            setReorderClicked(false);
          });
        });
      }
      // END CREDITS
      });
    }
  });
  useEffect(() => {
    window.componentHandler.upgradeDom();
    window.componentHandler.upgradeAllRegistered();
    if(props.global_consoleDebug){
      console.log("ToDoList: componentDidMount()...");
    }
    setTimeout(function(){
      if(props.postCount !== props.postCountPrev){
        animatePostCountIcon();
      }
    },0);
  });
  const animatePostCountIcon = () => {
    const overshoot = 5;
    const period = 0.25;
    const postCountIcon = document.getElementById("post-count-icon");
    if(props.global_consoleDebug){
      console.log("ToDoList: animatePostCountIcon(): postCountIcon: ",postCountIcon);
    }
    if(postCountIcon){
      TweenMax.to(postCountIcon,0.5,{
      scale:0.25,
      onComplete:function(){
            TweenMax.to(postCountIcon,1.4,{
            scale:1,
            /* ease:Elastic.easeOut,
            easeParams:[overshoot,period] */
            //Elastic.easeOut.config(overshoot,period)
            ease:Elastic.easeOut.config(overshoot,period)
          })
        }
      });
    }
  }
  const createMovementMatrix = (allMoveUp, allMoveDown, index1, index2, direction) => {
    const y = height;
    let _todos = todos;
    /* 
        
      Notes:
    
      There are 3 possible movement scenarios:
    
      1) All move up: all items move up, except the first item which moves all the way to the down
    
      2) All move down: all items move down, except the last item which moves all the way to the up
    
      3) Two items swap: all items remain static except for the current index and the list item it will swap with
    
      Objective:
    
      Record the following properties of each list item:
    
      1) current index
      2) index to move to
      3) y movement
    
    */
    let movementMatrix = [];
    if (allMoveUp) {
      _todos = todos;
      let obj = {};
      movementMatrix = [];
      const temp = _todos.map(
      function (todo, index) {
        obj = {};
        obj["index"] = index;
        obj["indexNew"] = index - 1;
        obj["top"] = -y;
        movementMatrix.push(obj);
      }
      );
      obj = {};
      obj["index"] = 0;
      obj["indexNew"] = _todos.length - 1;
      obj["top"] = (_todos.length - 1) * y;
      movementMatrix[0] = obj;
    }
    if (allMoveDown) {
      _todos = todos;
      let obj = {};
      movementMatrix = [];
      const temp = _todos.map(
      function (todo, index) {
        obj = {};
        obj["index"] = index;
        obj["indexNew"] = index + 1;
        obj["top"] = y;
        movementMatrix.push(obj);
      }
      );
      obj = {};
      obj["index"] = _todos.length - 1;
      obj["indexNew"] = 0;
      const _y = (_todos.length - 1) * y;
      obj["top"] = -_y;
      movementMatrix[_todos.length - 1] = obj;
    }
    if (!allMoveUp && !allMoveDown) {
      _todos = todos;
      let obj = {};
      movementMatrix = [];
      const temp = _todos.map(
      function (todo, index) {
        obj = {};
        obj["index"] = index;
        obj["indexNew"] = index;
        obj["top"] = 0;
        movementMatrix.push(obj);
      }
      );
      obj = {};
      obj["index"] = index1;
      obj["indexNew"] = direction === "up" ? index1 - 1 : index1 + 1;
      obj["top"] = direction === "up" ? -y : y;
      movementMatrix[index1] = obj;
      obj = {};
      obj["index"] = index2;
      obj["indexNew"] = direction === "up" ? index2 - 1 : index2 + 1;
      obj["top"] = direction === "up" ? y : -y;
      movementMatrix[index2] = obj;
    }
    if(props.global_consoleDebug){
      console.log("ToDoList: movementMatrix(): ", movementMatrix);
    }
    setMovementMatrix(movementMatrix);
  }
  const reorder = (allMoveUp, allMoveDown, index1, index2, direction) => {
    const y = height;
    let _todos = todos;
    /* 
        
      Notes:
    
      There are 3 possible movement scenarios:
    
      1) All move up: all items move up, except the first item which moves all the way to the down
    
      2) All move down: all items move down, except the last item which moves all the way to the up
    
      3) Two items swap: all items remain static except for the current index and the list item it will swap with
    
      Objective:
    
      Reorder items by manipulating the todo array
    
    */
    if (allMoveUp) {
      _todos = todos;
      const firstItem = _todos[0];
      _todos.push(firstItem);
      _todos.shift();
    }
    if (allMoveDown) {
      _todos = todos;
      const lastItem = _todos[_todos.length - 1];
      _todos.unshift(lastItem);
      _todos.pop();
    }
    if (!allMoveUp && !allMoveDown) {
      _todos = todos;
      const item1 = _todos[index1];
      const item2 = _todos[index2];
      _todos[index1] = item2;
      _todos[index2] = item1;
    }
    // Now lets update the 'todo' array
    setTodos(todos);
  }
  const move = (index, direction) => {
    setReorderClicked(true);
    const maxDistanceDown = todos.length * 55;
    const maxDistanceUp = -maxDistanceDown;
    const todosLength = todos.length - 1;
    // index1: current index of item to move
    let index1 = index;
    // index_1: index to move to of item to move
    let index_1 = index;
    // direction1: direction of item to move
    const direction1 = direction;
    let allMoveDown = false;
    let allMoveUp = false;
    // top1: y movement of item to move
    let top1 = 0;
    // direction2: direction of item to be swapped
    let direction2 = direction1 === "up" ? "down" : "up";
    if (direction1 === "up") {
      top1 = index1 > 0 ? -height : maxDistanceDown;
      direction2 = index1 > 0 ? "down" : "up";
      index_1 = index1 > 0 ? index1 - 1 : todos.length - 1;
    } 
    else {
      top1 = index1 < todos.length - 1 ? height : maxDistanceUp;
      direction2 = index1 < todos.length - 1 ? "up" : "down";
      index_1 = index1 < todos.length - 1 ? index1 + 1 : 0;
    }
    // index2: current index of item to be swapped
    let index2 = 0;
    // index_2: index to move to of item to be swapped
    let index_2 = 0;
    // top1: y movement of item to be swapped
    let top2 = 0;
    if (direction1 === "up") {
      index2 = index1 === 0 ? todos.length - 1 : index1 - 1;
      top2 = index1 === 0 ? -height : height;
      index_2 = index1 === 0 ? todos.length - 2 : index1;
      allMoveUp = index1 === 0 ? true : false;
    } 
    else {
      index2 = index1 === todos.length - 1 ? 0 : index1 + 1;
      top2 = index1 === todos.length - 1 ? height : -height;
      index_2 = index1 === todos.length - 1 ? 1 : index1;
      allMoveDown = index1 === todos.length - 1 ? true : false;
    }
    createMovementMatrix(
      allMoveUp,
      allMoveDown,
      index1,
      index2,
      direction
    );
    reorder(allMoveUp, allMoveDown, index1, index2, direction);
  }
  
  if(props.global_consoleDebug){
    console.log('ToDoList: render(): props.postCount:', props.postCount,' props.postCountPrev: ',props.postCountPrev);
  }
  var todocontainerStyle = {
    height: todos.length * height + "px"
  };
  if(props.global_consoleDebug){
    console.log('ToDoList: render(): pages:', pages,' props.inputValue: ',props.inputValue,' props.contentValue: ',props.contentValue);
  }
  let pages = []; 
  for (var i = 1; i <= pages; i++) {
    pages.push(i);
  }
  let pagination = pages.map(
    function (page, index) {
      return (
        <Pagination 
          ordinal={page} 
          readPost={props.readPost.bind(this,page,props.origin,"",props.sortmethod,props.sortby,props.postbatch,"")} 
          page={props.page} 
          pages={props.pages} 
          maxpostpage={props.maxpostpage} 
          global_height={props.global_height} 
          global_consoleDebug={props.global_consoleDebug} 
          global_enableProfanityFilter={props.global_enableProfanityFilter} 
          global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} 
          global_restapiEndpointSecure={props.global_restapiEndpointSecure} 
          key={index}
        />
      );
    }.bind(this)
  );
  let prev = pages.map(
    function (page, index) {
      const defaultStyle = props.page === 1 ? {cursor: "default", color: "rgba(0,0,0,0.05)"} : {cursor: "pointer", color: "rgba(0,0,0,0.5)"};
      let opts = {};
      if(props.page !== 1) {
        opts['onClick'] = props.readPost.bind(this,parseInt(props.page - 1),props.origin,"",props.sortmethod,props.sortby,props.postbatch,"");
      }
      return (
        page === 1 ? 
        (
        <i className="fa fa-caret-left" style={defaultStyle} {...opts}></i>
        )
        :
        (
        ""
        )
      );
    }.bind(this)
  );
  let next = pages.map(
    function (page, index) {
      const defaultStyle = props.page === props.pages ? {cursor: "default", color: "rgba(0,0,0,0.05)"} : {cursor: "pointer", color: "rgba(0,0,0,0.5)"};
      let opts = {};
      if(props.page !== props.pages) {
        opts['onClick'] = props.readPost.bind(this,parseInt(props.page + 1),props.origin,"",props.sortmethod,props.sortby,props.postbatch,"");
      }
      return (
        page === props.maxpostpage ? 
        (
        <i className="fa fa-caret-right" style={defaultStyle} {...opts}></i>
        )
        :
        (
        ""
        )
      );
    }.bind(this)
  );
  pagination = (<div className="pagination-container">{prev}{pagination}{next}</div>);
  if(props.global_consoleDebug){
    console.log('ToDoList: render(): props.sortmethod: ', props.sortmethod,' props.sortby: ',props.sortby,' props.page: ',props.page,' props.postbatch: ',props.postbatch,' props.request_postbatch: ',props.request_postbatch,' props.postbatch_select: ',props.postbatch_select);
  }
  let titleSortmethodUpOptsClassName = {};
  titleSortmethodUpOptsClassName['className'] = "fa fa-arrow-circle-up";
  if(props.sortmethod === "Title" && props.sortby === "ASC") {
    titleSortmethodUpOptsClassName['className'] = "fa fa-arrow-circle-up current";
  }
  let titleSortmethodUpOpts = {};
  titleSortmethodUpOpts['onClick'] = props.readPost.bind(this,props.page,props.origin,"","Title","ASC",props.postbatch,"");
  const titleSortmethodUp = (<i {...titleSortmethodUpOptsClassName} {...titleSortmethodUpOpts}></i>);
  let titleSortmethodDownOptsClassName = {};
  titleSortmethodDownOptsClassName['className'] = "fa fa-arrow-circle-down";
  if(props.sortmethod === "Title" && props.sortby === "DESC") {
    titleSortmethodDownOptsClassName['className'] = "fa fa-arrow-circle-down current";
  }
  let titleSortmethodDownOpts = {};
  titleSortmethodDownOpts['onClick'] = props.readPost.bind(this,props.page,props.origin,"","Title","DESC",props.postbatch,"");
  const titleSortmethodDown = (<i {...titleSortmethodDownOptsClassName} {...titleSortmethodDownOpts}></i>);
  const titleColumnTitle = (<div className="column-title"><span>Title</span>{titleSortmethodUp}{titleSortmethodDown}</div>);
  let submissiondateSortmethodUpOptsClassName = {};
  submissiondateSortmethodUpOptsClassName['className'] = "fa fa-arrow-circle-up";
  if(props.sortmethod === "Submission_date" && props.sortby === "ASC") {
    submissiondateSortmethodUpOptsClassName['className'] = "fa fa-arrow-circle-up current";
  }
  let submissiondateSortmethodUpOpts = {};
  submissiondateSortmethodUpOpts['onClick'] = props.readPost.bind(this,props.page,props.origin,"","Submission_date","ASC",props.postbatch,"");
  const submissiondateSortmethodUp = (<i {...submissiondateSortmethodUpOptsClassName} {...submissiondateSortmethodUpOpts}></i>);
  let submissiondateSortmethodDownOptsClassName = {};
  submissiondateSortmethodDownOptsClassName['className'] = "fa fa-arrow-circle-down";
  if(props.sortmethod === "Submission_date" && props.sortby === "DESC") {
    submissiondateSortmethodDownOptsClassName['className'] = "fa fa-arrow-circle-down current";
  }
  let submissiondateSortmethodDownOpts = {};
  submissiondateSortmethodDownOpts['onClick'] = props.readPost.bind(this,props.page,props.origin,"","Submission_date","DESC",props.postbatch,"");
  const submissiondateSortmethodDown = (<i {...submissiondateSortmethodDownOptsClassName} {...submissiondateSortmethodDownOpts}></i>);
  const submissiondateColumnTitle = (<div className="column-title"><span>Created At</span>{submissiondateSortmethodUp}{submissiondateSortmethodDown}</div>);
  let resetSortmethodSortbyOptsClassName = {};
  resetSortmethodSortbyOptsClassName['className'] = "fa fa-power-off";
  let resetSortmethodSortbyOpts = {};
  resetSortmethodSortbyOpts['onClick'] = props.readPost.bind(this,1,props.origin,"","Submission_date","DESC",4,"");
  const resetSortmethodSortby = (<i {...resetSortmethodSortbyOptsClassName} {...resetSortmethodSortbyOpts}></i>);
  const resetSortmethodSortbyColumnTitle = (<div className="column-title">{resetSortmethodSortby}</div>);
  let postbatch_select = props.postbatch_select.map(
    function (records, index) {
      return (
        <option value={records}>{records}</option>
      );
    }
  );
  postbatch_select = (<div className="post-batch-select-column-title"><select className="custom" onChange={props.handleSelectChange.bind(this,props.page,props.origin,"",props.sortmethod,props.sortby)} value={props.postbatch}>{postbatch_select}</select></div>);
  const openProfanitylistModal = enableProfanityFilter === 1 ? (<i className="fa fa-file-o" onClick={props.openModal.bind(this,"Profanity List","The profanity list contains highly offensive words. This list is for testing purposes only.","View Profanity List",1)}></i>) : ("") ;
  // loop through list item array and initiate <ToDo /> child components
  let _todos = null;
  if(props.origin === "posts"){
    _todos = todos.map(
      function (todo, index) {
        return (
        <ToDo 
          key={index} 
          keyRef={index} 
          ref={index} 
          title={todo.title} 
          content={todo.content} 
          done={todo.done} 
          slug={todo.slug} 
          createdAt={todo.createdAt} 
          postid={todo.postid}
          removeTodo={props.removeTodo.bind(this,index,"posts",todo.postid)}
          markTodoDone={props.markTodoDone.bind(this,index)}
          moveUp={this.move.bind(this,index,"up")}
          moveDown={this.move.bind(this,index,"down")} 
          global_height={props.global_height} 
          global_consoleDebug={props.global_consoleDebug} 
          global_enableProfanityFilter={props.global_enableProfanityFilter} 
          global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} 
          global_restapiEndpointSecure={props.global_restapiEndpointSecure}
        />
        );
      }.bind(this)
    );
  }
  else{
    _todos = todos.map(
      function (todo, index) {
        return (
        <Post 
          key={index} 
          keyRef={index} 
          ref={index} 
          title={todo.title} 
          done={todo.done} 
          slug={todo.slug} 
          createdAt={todo.createdAt} 
          content={todo.content} 
          id1={props.id} 
          id2={todo.id} 
          postid={todo.postid}
          removeTodo={props.removeTodo.bind(this,index,"post",todo.postid)} 
          global_height={props.global_height} 
          global_consoleDebug={props.global_consoleDebug} 
          global_enableProfanityFilter={props.global_enableProfanityFilter} 
          global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} 
          global_restapiEndpointSecure={props.global_restapiEndpointSecure} 
          openModal={props.openModal} 
        />
        );
      }.bind(this)
    );
  }
  if(!_todos){
    _todos = (<div className="spinner-container"><div className="spinner-container-inner"><Spinner singleColor /></div></div>)
  }
  const mdltextfieldStyle = {
    marginBottom: "0px"
  };
  const clearbothStyle = {
    clear: "both"
  };
  let optsClassName1 = {};
  optsClassName1['className'] = "demo-card-wide";
  let optsClassName2 = {};
  optsClassName2['className'] = "posts";
  let optsClassName3 = {};
  optsClassName3['className'] = "enableprofanityfilter";
  let optsClassName4 = {};
  optsClassName4['className'] = "columns";
  return (
    redirect === false ? (
    props.origin === "posts" ? 
    (
    <Card shadow={0} {...optsClassName1}>
      <CardTitle {...optsClassName2}>
        <h2 className="mdl-card__title-text">Posts<span><i id="post-count-icon" className="fa fa-files-o"></i>{postCount}</span></h2>
      </CardTitle>
      <CardText>
        Please choose between the following endpoints:
        <Endpoint toggleEndpoints={props.toggleEndpoints} restapiEndpointType={props.restapiEndpointType} global_height={props.global_height} global_consoleDebug={props.global_consoleDebug} global_enableProfanityFilter={props.global_enableProfanityFilter} global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} global_restapiEndpointSecure={props.global_restapiEndpointSecure} />
      </CardText>
      <CardActions border {...optsClassName3}>
        Please choose whether to enable the profanity filter:
        <EnableProfanityFilter toggleEnableprofanityfilter={props.toggleEnableprofanityfilter} enableprofanityfilter={props.enableprofanityfilter} global_height={props.global_height} global_consoleDebug={props.global_consoleDebug} global_enableProfanityFilter={props.global_enableProfanityFilter} global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} global_restapiEndpointSecure={props.global_restapiEndpointSecure} />
        {openProfanitylistModal}
      </CardActions>
      <CardActions border {...optsClassName4}>
        <div className="column-title-container">
          <div className="column-title-container-inner">
            {titleColumnTitle}
            {submissiondateColumnTitle}
            {resetSortmethodSortbyColumnTitle}
            {postbatch_select}
          </div>
        </div>
      </CardActions>
      <CardActions border>
        <div className="todo-container" style={todocontainerStyle}>
          {_todos}
        </div>
        {pagination}
        <form>
          <div className="mdl-textfield mdl-js-textfield" style={mdltextfieldStyle}>
            <Textfield 
            value={props.inputValue} 
            onChange={props.handleChange.bind(this)} 
            placeholder="Post title" 
            label="" 
            />
          </div>
          <div className="mdl-textfield mdl-js-textfield">
            <Textfield 
            value={props.contentValue} 
            onChange={props.handleContentChange.bind(this)} 
            placeholder="Post content" 
            label="" 
            rows="6" 
            />
          </div>
          <a className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={props.addTodo.bind(this)}>
            Add Post
          </a>
        </form>
        <div id="restapi-container" className="restapi-container">
          <div id="restapi-container-legend" className="restapi-container-legend">
            Message from Server
          </div>
          <div id="restapi-container-text" className="restapi-container-text">
            <div id="restapi-container-text-subtitle" className="restapi-container-text-subtitle">
              <i id="restapi-container-text-subtitle-icon" className="fa fa-check-circle information"></i>
              <span id="restapi-container-text-subtitle-span">No errors detected</span>
            </div>
            <div id="restapi-container-text-inner" className="restapi-container-text-inner">
            </div>
          </div>
        </div>
        <div style={clearbothStyle}></div>
      </CardActions>
      <CardMenu style={{color: '#fff'}}>
        <IconButton name="share" onClick={props.openModal.bind(this,"Share","Click below to share","",2)} />
      </CardMenu>
    </Card>
    )
    :
    (
    <div>
      {todos}
    </div>
    )
    )
    :
    (<Redirect to="/" />)
  );
  
}

export default ToDoList;