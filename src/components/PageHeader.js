import React, { useState, useEffect } from 'react';
import { Spinner, Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import { format } from "date-fns";
import { Switch, Route, Link, NavLink } from "react-router-dom";

import ToDoList from "./ToDoList";
import Posts from "./Posts";
import NotFound from "./NotFound";
import SnackBar from "./SnackBar";

const PageHeader = (props) => {
  const [posts, setPosts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [movementMatrix, setMovementMatrix] = useState([]);
  const [reorderClicked, setReorderClicked] = useState(false);
  const [slug, setSlug] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [postCountPrev, setPostCountPrev] = useState(0);
  const [addToDo, setAddToDo] = useState(false);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const [origin, setOrigin] = useState("");
  const [restapiEndpoint, setRestapiEndpoint] = useState(props.global_restapiEndpointSecure);
  const [restapiEndpointType, setRestapiEndpointType] = useState("secure");
  const [maxpostpage, setMaxpostpage] = useState(1);
  const [sortmethod, setSortmethod] = useState("Submission_date");
  const [sortby, setSortby] = useState("DESC");
  const [postbatch, setPostbatch] = useState(4);
  const [request_postbatch, setRequest_postbatch] = useState(4);
  const [postbatch_select, setPostbatch_select] = useState([]);
  const [enableprofanityfilter, setEnableprofanityfilter] = useState(0);
  const [request_profanitylist, setRequest_profanitylist] = useState([]);
  const [isSnackbarActive, setIsSnackbarActive] = useState(false);
  const [snackbarTimeout, setSnackbarTimeout] = useState(5000);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  //readPost(page,"","",sortmethod,sortby,postbatch,"");
  if(props.global_consoleDebug){
    console.log("PageHeader: constructor(): props: ", props);
  }
  useEffect(() => {
    readPost(page,"","",sortmethod,sortby,postbatch,"");
    setDataFetched(true);
  }, []);
  useEffect(() => {
    const mdlLayoutDrawerButton = document.querySelector(".mdl-layout__drawer-button");
    if(mdlLayoutDrawerButton){
      if(props.global_consoleDebug){
        console.log("Header: componentDidUpdate(): mdlLayoutDrawerButton exists");
      }
    }
    else{
      if(props.global_consoleDebug){
        console.log("Header: componentDidUpdate(): mdlLayoutDrawerButton does not exist");
      }
      const mdlJsLayout = document.querySelectorAll(".mdl-js-layout");
      window.componentHandler.downgradeElements(mdlJsLayout);
      try{
        window.componentHandler.register({
          constructor: window.MaterialLayout,
          classAsString: 'MaterialLayout',
          cssClass: 'mdl-js-layout'
        });
      }
      catch(e){
      }
    }
  });
  useEffect(() => {
    setPostCountPrev(postCount);
  });
  // CRUD
  // Pages: READ
  const readPages = () => {
    const url = restapiEndpoint + "/posts/1";
    fetch(url,{
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      if(props.global_consoleDebug){
        console.log('Header: readPages(): Success: data:', data);
      }
      if(data['posts'].length > 0){
        setPages(data['pages']);
      }
    })
    .catch((error) => {
      console.error('Header: readPages(): Error: data:', error);
    });
  }
  // CRUD
  // Post: CREATE
  const createPost = (title,content) => {
    const path = "/post/0";
    const url = restapiEndpoint + "/post/0/" + enableprofanityfilter;
    fetch(url,{
      method: 'POST', // or 'PUT'
      headers: {
        title: title,
        content: content
      },
    })
    .then(response => {
      if(!response.ok){
        throw response;
      }
      return response.json();
    })
    .then(data => {
      data['method'] = "POST";
      data['path'] = path;
      data['response'] = "200 OK";
      const json = JSON.stringify(data,null,2);
      if(data['error'].trim() === ""){
        if(props.global_consoleDebug){
          console.log('Header: createPost(): Success: data:', data);
        }
      }
      else{
        if(props.global_consoleDebug){
          console.log('Header: createPost(): error:', data['error']);
        }
      }
      readPost(page,"create-post",json,sortmethod,sortby,postbatch,data['error']);
    })
    .catch((error) => {
      error.text().then( errorMessage => {
        //const error = JSON.parse(errorMessage);
        //const errorText = error['ERROR'];
        const errorText = "An error occurred on the server. Please try again later...";
        const data = {};
        data['method'] = "POST";
        data['path'] = path;
        data['response'] = "500";
        data['error'] = errorText;
        const json = JSON.stringify(data,null,2);
        if(props.global_consoleDebug){
          console.log('Header: createPost(): error:', data['error']);
        }
        readPost(page,"create-post",json,sortmethod,sortby,postbatch,data['error']);
      });
    });
  }
  // Post: READ
  const readPost = (page,origin,json,sortmethod,sortby,postbatch,error) => {
    if(props.global_consoleDebug){
      console.log('Header: readPost(): postbatch:', postbatch);
    }
    if(origin !== ""){
      setDataFetched(false);
    }
    const url = restapiEndpoint + "/posts/" + page + "/" + sortmethod + "/" + sortby + "/" + postbatch;
    fetch(url,{
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      if(props.global_consoleDebug){
        console.log('Header: readPost(): Success: data:', data);
      }
      let posts = [];
      if(data['posts'].length > 0){
        for (var i = 0; i < data['posts'].length; i++) {
          const id = parseInt(i + 1);
          const obj1 = data['posts'][i];
          const title = titleFormat(obj1['title']);
          const slug = createSlug(title,id);
          const content = capitalizeFirstLetter(obj1['content']);
          const createdAt = obj1['createdAt'];
          const obj2 = {
            id: id,
            slug: slug,
            title: title,
            content: content,
            done: true,
            createdAt: createdAt,
            postid: obj1['postid']
          }	
          posts.push(obj2);	  
        } 
        count(data['recordcount']);

        setPosts(posts);
        setPages(data['pages']);
        setPage(page);
        setDataFetched(false);
        setMaxpostpage(data['maxpostpage']);
        setSortmethod(sortmethod);
        setSortby(sortby);
        setPostbatch(postbatch);
        setRequest_postbatch(data['request_postbatch']);
        setPostbatch_select(data['postbatch_select']);
        setRequest_profanitylist(data['request_profanitylist']);
        setIsSnackbarActive(error ? (error !== "" ? true : false) : false);
        setSnackbarTimeout(snackbarTimeout);
        setSnackbarMessage(error ? (error !== "" ? error : "") : false);
        toggleEndpoints(restapiEndpointType);
        if(json !== ""){
          const restapiContainerTextInner = document.getElementById("restapi-container-text-inner");
          if(restapiContainerTextInner){
            restapiContainerTextInner.innerText = json;
            const restapiContainerText = document.getElementById("restapi-container-text");
            if(restapiContainerText){
              if(error.trim() === ""){
                restapiContainerText.style.background = "rgba(0,0,0,0.0125)";
              }
              else{
                restapiContainerText.style.background = "#fef6f5";
              }
            }
            const restapiContainerTextSubtitleSpan = document.getElementById("restapi-container-text-subtitle-span");
            if(restapiContainerTextSubtitleSpan){
              if(error.trim() === ""){
                restapiContainerTextSubtitleSpan.innerText = "No errors detected";
              }
              else{
                restapiContainerTextSubtitleSpan.innerText = "Errors detected";
              }
              const id = "restapi-container-text-subtitle-icon";
              let restapiContainerTextSubtitleIcon = document.getElementById(id);
              if(restapiContainerTextSubtitleIcon){
                restapiContainerTextSubtitleIcon.classList.remove("information","error","fa-check-circle","fa-ban");
                if(error.trim() === ""){
                  restapiContainerTextSubtitleIcon.classList.add("fa-check-circle","information");
                }
                else{
                  restapiContainerTextSubtitleIcon.classList.add("fa-ban","error");
                }
              }
            }
            if(props.global_consoleDebug){
              console.log('Header: readPost(): Success: json:', json);
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error('Header: readPost(): Error: data:', error);
    });
  }
  // Post: DELETE
  const deletePost = (postid) => {
    const path = "/post/" + postid;
    const url = restapiEndpoint + "/post/" + postid + "/0";
    fetch(url,{
      method: 'POST', // or 'PUT'
      headers: {
        'X-HTTP-METHOD-OVERRIDE': 'DELETE'
      },
    })
    .then(response => {
      if(!response.ok){
        throw response;
      }
      return response.json();
    })
    .then(data => {
      data['method'] = "DELETE";
      data['path'] = path;
      data['response'] = "200 OK";
      const json = JSON.stringify(data,null,2);
      if(props.global_consoleDebug){
        console.log('Header: deletePost(): Success: data:', data);
      }
      readPost(page,"delete-post",json,sortmethod,sortby,postbatch,"");
    })
    .catch((error) => {
      error.text().then( errorMessage => {
        const error = JSON.parse(errorMessage);
        //const errorText = error['ERROR'];
        const errorText = "An error occurred on the server. Please try again later...";
        const data = {};
        data['method'] = "DELETE";
        data['path'] = path;
        data['response'] = "500";
        data['error'] = errorText;
        const json = JSON.stringify(data,null,2);
        if(props.global_consoleDebug){
          console.log('Header: deletePost(): error:', data['error']);
        }
        readPost(page,"delete-post",json,sortmethod,sortby,postbatch,data['error']);
      });
    });
  }
  // UDF Methods
  const showProfanitylist = () => {
    if(props.global_consoleDebug){
      console.log("Header: showProfanitylist()");
    }
    const profanityList = document.querySelector(".profanity-list");
    if(props.global_consoleDebug){
      console.log("Header: showProfanitylist(): profanityList: ",profanityList);
    }
    if(profanityList){
      const display = profanityList.style.display;
      if(props.global_consoleDebug){
        console.log("Header: showProfanitylist(): display: ",display);
      }
      if(display.trim() === "none"){
        profanityList.style.display = "block";
      }
      else{
        profanityList.style.display = "none";
      }
    }
  }
  const openModal = (title,message,buttonTitle,callback) => {
    if(props.global_consoleDebug){
      console.log("Header: openModal(): callback: ",callback);
    }
    const id = "dialog-modal";
    let dialogContainer = document.getElementById(id);
    if(props.global_consoleDebug){
      console.log("Header: openModal(): dialogContainer: ",dialogContainer);
    }
    if(!dialogContainer){
      const dialog = document.createElement("dialog");
      dialog.setAttribute("id",id);
      dialog.classList.add("mdl-dialog");
      const h3 = document.createElement("h3");
      h3.classList.add("mdl-dialog__title");
      const h3Textnode = document.createTextNode(title);
      const div1 = document.createElement("div");
      if(callback === 1){
        div1.classList.add("mdl-dialog__content","callback-1");
      }
      if(callback === 2){
        div1.classList.add("mdl-dialog__content","callback-2");
      }
      const p = document.createElement("p");
      const pTextnode = document.createTextNode(message);
      const select1 = document.createElement("select");
      select1.classList.add("profanity-list");
      select1.setAttribute("style","display:none;");
      for (var i = 0; i < request_profanitylist.length; i++) {
        const idx = request_profanitylist[i];
        const option = document.createElement("option");
        option.setAttribute("value",idx);
        const optionTextnode = document.createTextNode(idx);
        option.appendChild(optionTextnode);
        select1.appendChild(option);
      } 
      const div2 = document.createElement("div");
      div2.classList.add("mdl-dialog__actions","--full-width");
      const button1 = document.createElement("button");
      button1.classList.add("mdl-button","close");
      const button1Textnode = document.createTextNode("Close");
      const button2 = document.createElement("button");
      button2.classList.add("mdl-button","callback");
      const button2Textnode = document.createTextNode(buttonTitle);
      h3.appendChild(h3Textnode);
      p.appendChild(pTextnode);
      div1.appendChild(p);
      div1.appendChild(select1);
      if(callback === 2){
        const divShare = document.createElement("div");
        const aTwitter = document.createElement("a");
        const aTwitterText = encodeURIComponent("React ES6 REST API");
        const aTwitterUrl = encodeURIComponent("https://community.establishmindfulness.com/assets-react_es6_restapi/index.html");
        aTwitter.setAttribute("href","https://twitter.com/intent/tweet?text=" + aTwitterText + "&url=" + aTwitterUrl + "");
        aTwitter.setAttribute("target","_blank");
        const spanTwitter = document.createElement("span");
        const iTwitter = document.createElement("i");
        iTwitter.classList.add("fa","fa-twitter");
        divShare.appendChild(aTwitter);
        aTwitter.appendChild(spanTwitter);
        spanTwitter.appendChild(iTwitter);
        const aFacebook = document.createElement("a");
        const aFacebookUrl = encodeURIComponent("https://community.establishmindfulness.com/assets-react_es6_restapi/index.html");
        aFacebook.setAttribute("href","https://www.facebook.com/sharer/sharer.php?u=" + aFacebookUrl + "");
        aFacebook.setAttribute("target","_blank");
        const spanFacebook = document.createElement("span");
        const iFacebook = document.createElement("i");
        iFacebook.classList.add("fa","fa-facebook");
        divShare.appendChild(aFacebook);
        aFacebook.appendChild(spanFacebook);
        spanFacebook.appendChild(iFacebook);
        const aTumblr = document.createElement("a");
        const aTumblrText = encodeURIComponent("React ES6 REST API");
        const aTumblrUrl = encodeURIComponent("https://community.establishmindfulness.com/assets-react_es6_restapi/index.html");
        aTumblr.setAttribute("href","https://www.tumblr.com/share/link?name=" + aTumblrText + "&url=" + aTumblrUrl + "");
        aTumblr.setAttribute("target","_blank");
        const spanTumblr = document.createElement("span");
        const iTumblr = document.createElement("i");
        iTumblr.classList.add("fa","fa-tumblr");
        divShare.appendChild(aTumblr);
        aTumblr.appendChild(spanTumblr);
        spanTumblr.appendChild(iTumblr);
        const aLinkedin = document.createElement("a");
        const aLinkedinText = encodeURIComponent("React ES6 REST API");
        const aLinkedinUrl = encodeURIComponent("https://community.establishmindfulness.com/assets-react_es6_restapi/index.html");
        aLinkedin.setAttribute("href","https://www.linkedin.com/shareArticle?mini=true&title=" + aLinkedinText + "&url=" + aLinkedinUrl + "");
        aLinkedin.setAttribute("target","_blank");
        const spanLinkedin = document.createElement("span");
        const iLinkedin = document.createElement("i");
        iLinkedin.classList.add("fa","fa-linkedin");
        divShare.appendChild(aLinkedin);
        aLinkedin.appendChild(spanLinkedin);
        spanLinkedin.appendChild(iLinkedin);
        div1.appendChild(divShare);
      }
      button1.appendChild(button1Textnode);
      div2.appendChild(button1);
      button2.appendChild(button2Textnode);
      div2.appendChild(button2);
      dialog.appendChild(h3);
      dialog.appendChild(div1);
      dialog.appendChild(div2);
      document.body.appendChild(dialog);
      if(buttonTitle.trim() === ""){
        button2.style.display = "none";
      } 
      window.componentHandler.upgradeDom();
      dialogContainer = document.getElementById(id);
    }
    if(dialogContainer){
      if(!dialogContainer.showModal){
        window.dialogPolyfill.registerDialog(dialogContainer);
      }
      dialogContainer.showModal();
      dialogContainer.querySelector('button.callback')
      .addEventListener('click', function() {
        if(callback === 1){
          showProfanitylist();
        }
      });
      dialogContainer.querySelector('button.close')
      .addEventListener('click', function() {
        dialogContainer.close();
        dialogContainer = document.getElementById(id);
        if(dialogContainer){
          dialogContainer.remove();
        }
      });
    }
  }
  const createSnackBar = (message,type) => {
    const id = "snackbar-message";
    let snackbarContainer = document.getElementById(id);
    if(props.global_consoleDebug){
      console.log("Header: createSnackBar(): snackbarContainer: ",snackbarContainer);
    }
    if(!snackbarContainer){
      const div1 = document.createElement("div");
      div1.setAttribute("id",id);
      div1.classList.add("mdl-js-snackbar","mdl-snackbar");
      const div2 = document.createElement("div");
      div2.classList.add("mdl-snackbar__text");
      const button = document.createElement("button");
      button.classList.add("mdl-snackbar__action");
      div1.appendChild(div2);
      div1.appendChild(button);
      document.body.appendChild(div1);
      window.componentHandler.upgradeDom();
      snackbarContainer = document.getElementById(id);
    }
    if(snackbarContainer){
      setTimeout(function(){
        if(snackbarContainer){
          var data = {
            message:message,
            timeout:5000,
            actionHandler:function(event){
              snackbarContainer.classList.remove("mdl-snackbar--active")
            },
            actionText:'Close'
          };
          try{
            if(props.global_consoleDebug){
              console.log("Header: createSnackBar(): snackbarContainer.MaterialSnackbar: ",snackbarContainer.MaterialSnackbar);
            }
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
          }
          catch(e){
          }
        }
      },1000);
    }
  }
  const randomIntInc = (low, high) => {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }
  const titleFormat = (string) => {
    const words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
  }
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const createSlug = (slug,id) => {
    let value = "";
    const punctuationPattern = /[.,\/#!$%\^&\*;:{}=\-_`~()]/gim;
    value = slug.replace(punctuationPattern, "");
    value = value.trim();
    value = value.replace(/[\s]+/gim, "-");
    value = value.toLowerCase();
    if(props.global_consoleDebug){
      console.log("Header: createSlug(): value: ", value);
    }
    value = value + "-" + id;
    return value;
  }
  const addTodo = () => {
    const todos = posts;
    if (inputValue.trim() !== "") {
      const inputValue = inputValue;
      const contentValue = contentValue;
      const slug = createSlug(inputValue);
      const content = capitalizeFirstLetter(contentValue);
      const createdAt = format(new Date(), "yyyy-mm-dd hh:mm:ss");
      todos.push({
        title: inputValue,
        done: false,
        slug: slug,
        content: content,
        createdAt: createdAt,
        postid: 0
      });
      setPosts(todos);
      setInputValue("");
      setContentValue("");
      setAddToDo(true);
      const title = titleFormat(inputValue);
      createPost(title,content);
    }
  }
  const handleSelectChange = (page,origin,json,sortmethod,sortby,event) => {
    if(props.global_consoleDebug){
      console.log('Header: handleSelectChange():  page: ',page,' origin: ',origin,' json: ',json,' sortmethod: ',sortmethod,' sortby: ',sortby,' postbatch: ',event.target.value);
    }
    readPost(page,origin,json,sortmethod,sortby,event.target.value,"");
  }
  const handleChange = (e) => {
    setDataFetched(false);
    setInputValue(e.target.value);
    setDataFetched(true);
    if(props.global_consoleDebug){
      console.log("Header: handleChange(): inputValue: ",inputValue);
    }
  }
  const handleContentChange = (e) => {
    setDataFetched(false);
    setContentValue(e.target.value);
    setDataFetched(true);
    if(props.global_consoleDebug){
      console.log("Header: handleContentChange(): contentValue: ",contentValue);
    }
  }
  const count = (n) => {	
    setPostCountPrev(postCount);
    setPostCount(n);
  }
  const removeTodo = (index,origin,postid) => {
    if(props.global_consoleDebug){
      console.log("Header: removeTodo(): index: ",index," origin: ",origin," postid: ",postid);
    }
    posts.splice(index, 1);
    setPosts(posts);
    if(postid > 0){
      deletePost(postid);
    }
    if(origin === "post"){
      setRedirect(true);
    }
  }
  const markTodoDone = (index) => {
    let todos = posts;
    let todo = posts[index];
    todos.splice(index, 1);
    todo.done = !todo.done;
    todo.done ? todos.push(todo) : todos.unshift(todo);
    setPosts(todos);
  }
  const toggleEndpoints = (type) => {
    setRestapiEndpoint(type === "secure" ? props.global_restapiEndpointSecure : props.global_restapiEndpointInsecure);
    setRestapiEndpointType(type);
    if(props.global_consoleDebug){
      console.log("Header: toggleEndpoints(): restapiEndpoint: ",restapiEndpoint," restapiEndpointType: ",restapiEndpointType);
    }
  }
  const toggleEnableprofanityfilter = (type) => {
    setEnableprofanityfilter(type);
    if(props.global_consoleDebug){
      console.log("Header: toggleEnableprofanityfilter(): enableprofanityfilter: ",enableprofanityfilter);
    }
  }
  var _posts = posts.map(
    function (post, index) {
      const link = "/post/" + post.slug;
      return (
        <NavLink className="mdl-navigation__link" to={link} key={post.postid}>
          {post.title}
        </NavLink>
      );
    }
  );
  //dataFetched = false;
  const headerLink = (<Link to="/"><i className="fa fa-home home"></i></Link>);
  const headerA = (<a className="bitbucket-link" href="https://bitbucket.org/charlesrobertson/react-router-es6/src/master/" target="_blank"><i className="fa fa-github"></i></a>);
  const headerSpan = (<span className="mdl-layout-title">Postman REST API</span>);
  return (
  dataFetched === true ? (
    <Layout fixedHeader>
      <Header title={headerSpan}>
      {headerLink}
      {headerA}
      </Header>
      <Drawer title="Postman REST API">
        <Navigation className="mdl-navigation">
          <NavLink className="mdl-navigation__link" to="/">
            Home
          </NavLink>
          {_posts}
        </Navigation>
      </Drawer>
      <Content>
        <div className="page-content">
          <Switch>
            <Route
              exact
              path="/"
              render={() => { 
                return (
                    <Posts posts={posts} removeTodo={removeTodo} markTodoDone={markTodoDone} addTodo={addTodo} readPost={readPost} pages={pages} postCount={postCount} handleChange={handleChange} handleContentChange={handleContentChange} inputValue={inputValue} contentValue={contentValue} postCountPrev={postCountPrev} toggleEndpoints={toggleEndpoints} restapiEndpointType={restapiEndpointType} page={page} maxpostpage={maxpostpage} sortmethod={sortmethod} sortby={sortby} postbatch={postbatch} request_postbatch={request_postbatch} postbatch_select={postbatch_select} handleSelectChange={handleSelectChange} enableprofanityfilter={enableprofanityfilter} toggleEnableprofanityfilter={toggleEnableprofanityfilter} openModal={openModal} showProfanitylist={showProfanitylist} global_height={props.global_height} global_consoleDebug={props.global_consoleDebug} global_enableProfanityFilter={props.global_enableProfanityFilter} global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} global_restapiEndpointSecure={props.global_restapiEndpointSecure} />
                  );
                }
              }
            />
            <Route
              path="/post/:postSlug"
              render={(props) => {
                if(props.global_consoleDebug){
                  console.log("Header: render: props ", props);
                  console.log("Header: render: props.location.state ", props.location.state);
                  console.log("Header: render: posts ", posts);
                }
                const post = posts.find(
                  (post) => post.slug === props.match.params.postSlug
                );
                if (post) {
                  return (
                    <ToDoList origin="post" posts={posts} id={post.id} removeTodo={removeTodo} markTodoDone={markTodoDone} addTodo={addTodo} readPost={readPost} pages={pages} postCount={postCount} handleChange={handleChange} handleContentChange={handleContentChange} inputValue={inputValue} contentValue={contentValue} postCountPrev={postCountPrev} toggleEndpoints={toggleEndpoints} restapiEndpointType={restapiEndpointType} page={page} maxpostpage={maxpostpage} sortmethod={sortmethod} sortby={sortby} postbatch={postbatch} request_postbatch={request_postbatch} postbatch_select={postbatch_select} handleSelectChange={handleSelectChange} enableprofanityfilter={enableprofanityfilter} toggleEnableprofanityfilter={toggleEnableprofanityfilter} openModal={openModal} showProfanitylist={showProfanitylist} global_height={props.global_height} global_consoleDebug={props.global_consoleDebug} global_enableProfanityFilter={props.global_enableProfanityFilter} global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} global_restapiEndpointSecure={props.global_restapiEndpointSecure} />
                  );
                }
                else { 
                  return (
                    <NotFound global_height={props.global_height} global_consoleDebug={props.global_consoleDebug} global_enableProfanityFilter={props.global_enableProfanityFilter} global_restapiEndpointInsecure={props.global_restapiEndpointInsecure} global_restapiEndpointSecure={props.global_restapiEndpointSecure} />
                  );
                }
              }
            }
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Content>
      <SnackBar isSnackbarActive={isSnackbarActive} snackbarTimeout={snackbarTimeout} snackbarMessage={snackbarMessage} global_consoleDebug={props.global_consoleDebug} />
    </Layout>
    )
    :
    (
    <div className="spinner-container-outer">
      <div className="spinner-container-fetch">
        <div className="spinner-container-inner">
          <Spinner singleColor />
        </div>
      </div>
    </div>
    )
  );
}

export default PageHeader;