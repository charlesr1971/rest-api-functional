import React, { useState, useEffect } from 'react';

import ToDoList from "./ToDoList";

const Posts = (props) => {
  if(props.global_consoleDebug){
    console.log("Posts: constructor(): props: ", props);
  }
  useEffect(() => {
    window.componentHandler.upgradeDom();
  });
  return (
    <ToDoList origin="posts" posts={props.posts} id="" removeTodo={props.removeTodo} markTodoDone={props.markTodoDone} addTodo={props.addTodo} readPost={props.readPost} pages={props.pages} postCount={props.postCount} handleChange={props.handleChange} handleContentChange={props.handleContentChange} inputValue={props.inputValue} contentValue={props.contentValue} postCountPrev={props.postCountPrev} toggleEndpoints={props.toggleEndpoints} restapiEndpointType={props.restapiEndpointType} page={props.page} maxpostpage={props.maxpostpage} sortmethod={props.sortmethod} sortby={props.sortby} postbatch={props.postbatch} request_postbatch={props.request_postbatch} postbatch_select={props.postbatch_select} handleSelectChange={props.handleSelectChange} enableprofanityfilter={props.enableprofanityfilter} toggleEnableprofanityfilter={props.toggleEnableprofanityfilter} openModal={props.openModal} showProfanitylist={props.showProfanitylist} global_height={props.global_height} global_consoleDebug={props.global_consoleDebug} global_enableProfanityFilter={props.global_enableProfanityFilter} global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} global_restapiEndpointSecure={props.global_restapiEndpointSecure} />
  );
}

export default Posts;