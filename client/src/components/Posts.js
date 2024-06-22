import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import "../App.css";
import logoImg from "../images/logo.gif";
import $, { event } from "jquery";
import { Modal } from "bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
import cryptojs from "crypto-js";
import Session from "react-session-api";
import { ReactSession } from "react-client-session";
import { Form, FloatingLabel, Button, Row, Col } from "react-bootstrap";
import EditPost from "./EditPost";
import Like from "./Like";

import FormData from "form-data";
import UserImage from "./UserImage";
//const bcrypt = require('bcryptjs');
//const saltRounds = 16;

const Posts = (props) => {
  const [file, setFile] = useState([]);

  let title;
  let body;
  let uploadedImg;
  let isPublic = true;
  // let postData = null;
  let postcontainer = null;

  const [Seepost, setSeepost] = useState(undefined);

  const fileSelected1 = (e) => {
    const temp = e.target.files[0];
    console.log(temp);

    setFile(temp);
  };
  const [postData, setPostData] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [about, setAbout] = useState(undefined);
  const [aboutedit, setAboutEdit] = useState(undefined);
  const [editdataid, seteditdataid] = useState(undefined);
  const [editdata, seteditdata] = useState(undefined);
  const [finaleditid, setfinaleditid] = useState("");

  const [likenum, setlikenum] = useState("");
  let a;

  const navigate = useNavigate();
  console.log(localStorage);
  //localStorage.clear();
  let user = null;

  //console.log(ReactSession.get("userSession"));
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const instance = axios.create({
          baseURL: "*",
          timeout: 20000,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          },
        });

        const { data } = await instance.get(`http://localhost:3000/session`);
        console.log(data);
        if ("error" in data) {
          setSession(false);
          setLoading(false);
          // return;
        } else {
          let bytes1 = cryptojs.AES.decrypt(data._id, "MySecretKey");
          console.log(bytes1);
          let tempid = JSON.parse(bytes1.toString(cryptojs.enc.Utf8));

          let id = localStorage.getItem("userSession");
          let bytes = cryptojs.AES.decrypt(id, "MySecretKey");
          console.log(bytes);
          // let decid = JSON.parse(temp);
          let decid = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

          if (tempid === decid.toString()) {
            console.log("here");
            console.log("works");
            setSession(true);
            setLoading(false);
          } else {
            setSession(false);
            setLoading(false);
          }
          // return;
        }
      } catch (e) {
        console.log(e);
      }
    }

    async function fetchdata() {
      const instance = axios.create({
        baseURL: "*",
        timeout: 20000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      });

      const seepostdata = await instance.get(`http://localhost:3000/posts`);
      console.log(seepostdata.data);
      setSeepost(seepostdata.data);
      setLoading(false);
    }
    if (localStorage.length !== 0) {
      console.log("here");
      checkSession();
      if (session) {
        fetchdata();
      }
      //return;
    } else {
      console.log("here in the outer if");
      setLoading(false);
      //setSession(false);
    }
  }, [session]);

  function handleOpenModal(n) {
    console.log(n);
    //setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  //useEffect(() => {
  /*
        async function openeditmodal(){
       
            const instance = axios.create({
                baseURL: '*',
                timeout: 20000,
                withCredentials: true,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                },
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
                }
            });
            const userdata1  = await instance.get(`http://localhost:3000/session`);
            let postid = finaleditid;

            const clickedpost = await instance.get(`http://localhost:3000/posts/${postid}`);
            console.log(clickedpost.data);
            if(clickedpost.data){
           
            console.log(postid);
            //editdata = clickedpost.data;
            a = clickedpost.data;
            seteditdata(a);
            console.log(a);
            }
            
            console.log(editdata);
            console.log(userdata1.data.id);
            // if(userdata1.data.id === n.userThatPosted._id){
                
            
            // }else{
            //     alert("You cannot edit this post.");
            // }
        }
        openeditmodal();
*/
  // },[finaleditid]);

  /* postcontainer = Seepost && Seepost.map((n) => {
        let imgstr = "";
        if(n.imagePath){
            imgstr ="http://localhost:3000"+n.imagePath;
        }
        console.log(n.imagePath+":"+n.imagePath == null );
       
       
        async function opendeltemodal(idd){
    
            
            const instance = axios.create({
                baseURL: '*',
                timeout: 20000,
                withCredentials: true,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                },
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
                }
            });
            const userdata1  = await instance.get(`http://localhost:3000/session`);
            console.log(n.userThatPosted._id);
            console.log(userdata1.data.id);
            if(userdata1.data.id === n.userThatPosted._id){
                seteditdataid(idd);
            let myDeleteModal = new Modal(document.getElementById('deleteModal'));
            myDeleteModal.show();
            }else{
                alert("You cannot delete this post.");
            }
        }

            async function deletepost(delid){
                delid = editdataid
                console.log(delid)
            const instance = axios.create({
                baseURL: "*",
                timeout: 20000,
                
                headers: {
                  "Content-Type": "application/json;charset=UTF-8",
                  "Access-Control-Allow-Origin": "*",
                },
                validateStatus: function (status) {
                  return status < 500; // Resolve only if the status code is less than 500
                },
              });
        
             
              let postid = delid;
              console.log(postid);
              console.log(delid);
              const newseepostdata = await instance.delete(
                `http://localhost:3000/posts/${postid}`,{
                    headers:{
                        "Content-Type": "application/json;charset=UTF-8",
                        "Access-Control-Allow-Origin": "*",
                    }
            }).then(function (response) {
        console.log(response.data);

        if(response.status === 200){
            let myDeleteModal = new Modal(document.getElementById('deleteModal'));
            myDeleteModal.hide();
            window.location.reload();
        }
      }).catch(function (error) {
        console.log(error);
        //setSuccess(false);
        alert("There was some error please try again");

      });
       



              const seepostdata = await instance.get(
                `http://localhost:3000/posts`
              );
              console.log(seepostdata.data);
              setSeepost(seepostdata.data);
              setLoading(false);

        }

       
        async function editclicked(edid){
            let myEditModal = new Modal(document.getElementById('editModal'));
                myEditModal.show();
            setfinaleditid(edid);
        }    


        return(
            <div>
                <div className="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure to delete this post ?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-danger" onClick={deletepost}>Delete</button>
                    </div>
                </div>
            </div>
                </div>
                <div className="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            <EditPost n={a}></EditPost>
                            {/* <form onSubmit={
    async (e)=>{
        e.preventDefault();
       let btn = document.getElementById("sub1");
      btn.disabled = false;
    //    if(!title.value){
    //        console.log(title.value);
    //        alert("Please enter post title");
    //        btn.disabled = false;
    //        return;
    //    }
    //    if(title.value.trim().length == 0){
    //     alert("Only white spaces are not allowed.");
    //     btn.disabled = false;
    //        return;
    //    }

    //    let regf = /^[ A-Za-z0-9_@./#&+-]*$/
    //    if(!regf.test(title.value)){
    //         alert("Please enter valid post title");
    //         btn.disabled = false;
    //         return;
    //    }

    //    if(!body.value){
    //        alert("Please enter first post description");
    //        btn.disabled = false;
    //        return;
    //    }
    //    if(body.value.trim().length == 0){
    //     alert("Only white spaces are not allowed.");
    //     btn.disabled = false;
    //        return;
    //    }

    //    if(!regf.test(body.value)){
    //         alert("Please enter valid post description");
    //         btn.disabled = false;
    //         return;
    //    }
      
       // let temp = JSON.parse(user);
       let flag = false;
        //let msg = await axios.post('http:/localhost:3000/signup', user);

        const instance = axios.create({
            baseURL: '*',
            timeout: 20000,
            withCredentials: true,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            },
        validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
            }
        });
        
        

        let postid = n._id;

        const clickedpost = await instance.get(`http://localhost:3000/posts/${postid}`);
        
    
               
        n.title = clickedpost.data.title;
        n.body = clickedpost.data.body;

       
        const data1  = await instance.get(`http://localhost:3000/session`);
                console.log(data1.data);
            
        const userdata1  = await instance.get(`http://localhost:3000/getUserData`);
        console.log(userdata1.data);

        
        let user = {
                        id: postid,
                        title : document.getElementById('title').value,
                        body:  document.getElementById('body').value,
                        isPublic: true,
                    }
                    console.log(user);

        await axios.patch(`http://localhost:3000/posts/${postid}`,user,{
            headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  "Access-Control-Allow-Origin": "*",
                }
                }).then(function (response) {
            console.log(response.data);

            if(response.status === 200){
                alert("Post posted successfully!!!");
                flag = true;
                window.location.reload();
            }
          }).catch(function (error) {
            console.log(error);
            //setSuccess(false);
            alert("There was some error please try again");

          });

          e.target.reset();
          //btn.disabled = false;
           if(flag){
            
            props.handleClose(false);
           }            
    }
}>

                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" className="form-control" id="title" aria-describedby="emailHelp" ref={(node)=>{
                            title = node;
                        }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="body" className="col-form-label">Message:</label>
                            <textarea className="form-control" id="body" defaultValue={n.body} ref={(node)=>{
                            body = node;
                        }} ></textarea>
                        </div>
                        <div className="mb-3">
                            <button type="button" className="btn btn-secondary me-3" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" id="sub1">Publish</button>
                        </div>
                        </form> }
                            </div>
                           
                        </div>
                    </div>
                </div>
           
            <div className="card post-card align-self-center mb-3">
            <div className="post-row justify-content-between">
                <div className="d-flex justify-content-between">
                    <div className="left-header-box">
                        <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
                            <aside className="material-icons messanger-dark-color post-icon">account_circle</aside>
                        </div>
                    </div>
                    <div className="right-header-box d-flex align-items-center">
                        <div className="p-2 p-lg-3 pb-0 pb-lg-0 ps-lg-0">
                            <strong>
                                <p className="post-heading mobile-text-center">{n.userThatPosted.firstName}</p>
                            </strong>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                <div className="p-2 p-lg-3 pb-0 pb-lg-0 ps-lg-0">
                        <button type="button" className="btn btn-outline-primary delete-post-btn d-flex" onClick={async () => await editclicked(n._id)} disabled>
                            <span className="material-icons">
                                edit
                            </span>
                        </button>
                    </div>
                <div className="p-2 p-lg-3 pb-0 pb-lg-0 ps-lg-0">
                        <button type="button" className="btn btn-outline-danger delete-post-btn d-flex" onClick={() => opendeltemodal(n._id)}>
                            <span className="material-icons">
                                delete
                            </span>
                        </button>
                    </div>
                    </div>
            </div>
            <hr className="m-0 mb-2"></hr>
            <div className="post-row flex-column">
                <p className="post-heading ps-4 pe-4"><strong>{n.title}</strong></p>
                <p className="post-heading ps-4 pe-4">{n.body}</p>
                {imgstr.includes(null) ? <img className="img-fluid" src={imgstr} alt="post image" style={{display:"none"}} /> : <img className="img-fluid" src={imgstr} alt="post image" type="file" accept="image/*" />}
            </div>
            <hr className="m-0 mb-2"></hr>
            <Like mainid={n._id} numlikes={n.likes.length} numcomments={n.comments.length} commentsdata={Seepost}></Like>   
        </div>  
        </div>
     )
    });*/

  postcontainer =
    Seepost &&
    Seepost.map((n) => {
      console.log(n);

      async function opendeltemodal(idd) {
        console.log(idd);
        const instance = axios.create({
          baseURL: "*",
          timeout: 20000,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          },
        });
        const userdata1 = await instance.get(`http://localhost:3000/session`);

        console.log(n.userThatPosted._id);
        console.log(userdata1.data.id);
        if (userdata1.data.id === n.userThatPosted._id) {
          seteditdataid(idd);
          let myDeleteModal = new Modal(document.getElementById("deleteModal"));
          myDeleteModal.show();
        } else {
          alert("You cannot delete this post.");
        }
      }

      async function deletepost(delid) {
        delid = editdataid;
        console.log(delid);
        // const instance = axios.create({
        //   baseURL: "*",
        //   timeout: 20000,

        //   headers: {
        //     "Content-Type": "application/json;charset=UTF-8",
        //     "Access-Control-Allow-Origin": "*",
        //   },
        //   validateStatus: function (status) {
        //     return status < 500; // Resolve only if the status code is less than 500
        //   },
        // });

        let postid = delid;
        console.log(postid);
        console.log(delid);
        const instance2 = axios.create({
          baseURL: "*",
          timeout: 20000,
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data; boundary=${form._boundary}",
            //;charset=UTF-8
          },
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          },
        });
        const newseepostdata = await instance2
          .delete(`http://localhost:3000/posts/${postid}`)
          .then(function (response) {
            console.log(response.data);

            if (response.status === 200) {
              let myDeleteModal = new Modal(
                document.getElementById("deleteModal")
              );
              myDeleteModal.hide();
              window.location.reload();
            }
          })
          .catch(function (error) {
            console.log(error);

            alert("There was some error please try again");
          });
      }

      let imgstr = "";
      if (n.imagePath) {
        imgstr = "http://localhost:3000" + n.imagePath;
      }
      return (
        <div>
          <div
            className="modal fade"
            id="deleteModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <p className="modal-title">Modal title</p>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure to delete this post ?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={deletepost}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card post-card align-self-center mb-3 scale-in-center">
            <div className="post-row justify-content-between">
              <div className="d-flex justify-content-between">
                <div className="left-header-box">
                  <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center"></div>
                </div>
                <div className="right-header-box d-flex align-items-center">
                  <div className="p-2 p-lg-3 pb-0 pb-lg-0 ps-lg-0">
                    <strong>
                      <p className="post-heading mobile-text-center">
                        {n.userThatPosted.firstName}
                      </p>
                    </strong>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="p-2 p-lg-3 pb-0 pb-lg-0 ps-lg-0">
                  <button
                    type="button"
                    className="btn btn-outline-primary delete-post-btn d-flex"
                    onClick={async (e) => {
                      console.log(n);

                      const instance = axios.create({
                        baseURL: "*",
                        timeout: 20000,
                        withCredentials: true,
                        headers: {
                          "Content-Type": "application/json;charset=UTF-8",
                          "Access-Control-Allow-Origin": "*",
                        },
                        validateStatus: function (status) {
                          return status < 500; // Resolve only if the status code is less than 500
                        },
                      });
                      const userdata1 = await instance.get(
                        `http://localhost:3000/session`
                      );
                      console.log(n.userThatPosted._id);
                      console.log(userdata1.data.id);
                      if (userdata1.data.id === n.userThatPosted._id) {
                        //seteditdataid(idd);
                        //let myDeleteModal = new Modal(document.getElementById('deleteModal'));
                        setPostData(n);
                        setShowModal(true);
                      } else {
                        alert("You cannot edit this post.");
                      }
                    }}
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  {showModal && showModal && (
                    <EditPost
                      isOpen={showModal}
                      handleClose={handleCloseModal}
                      modal="editpost"
                      n={postData}
                    />
                  )}
                </div>
                <div className="p-2 p-lg-3 pb-0 pb-lg-0 ps-lg-0">
                  <button
                    type="button"
                    className="btn btn-outline-danger delete-post-btn d-flex"
                    onClick={() => opendeltemodal(n._id)}
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            </div>
            <hr className="m-0 mb-2"></hr>
            <div className="post-row flex-column">
              <p className="post-heading ps-4 pe-4">
                <strong>{n.title}</strong>
              </p>
              <p className="post-heading ps-4 pe-4">{n.body}</p>
              {imgstr.includes(null) ? (
                <img
                  className="img-fluid"
                  src={imgstr}
                  alt="post image"
                  style={{ display: "none" }}
                />
              ) : (
                <img
                  className="img-fluid"
                  src={imgstr}
                  alt="post image"
                  type="file"
                  accept="image/*"
                />
              )}
            </div>
            <hr className="m-0 mb-2"></hr>
            <Like
              mainid={n._id}
              numlikes={n.likes.length}
              numcomments={n.comments.length}
              commentsdata={Seepost}
              numlikesdata={n.likes}
            ></Like>
          </div>{" "}
        </div>
      );
    });

  if (
    localStorage.getItem("user") &&
    localStorage.getItem("user") !== "undefined"
  ) {
    //console.log(localStorage.getItem("user"));
    let bytes = cryptojs.AES.decrypt(
      localStorage.getItem("user"),
      "MySecretKey"
    );
    user = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
  }

  function openModal() {
    let myModal = new Modal(document.getElementById("myModal"));
    myModal.show();
  }

  if (loading) {
    return (
      <div>
        <span>Loading....</span>
      </div>
    );
  } else {
    if (!session) {
      return <Navigate to="/" replace />;
    } else {
      return (
        // ---------- Start of Posts ---------- //
        <>
          <Navigation></Navigation>
          <section className="section posts-section">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="write-post-section mb-3">
                    <div className="card post-card align-self-center text-center scale-in-center">
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="p-3 pe-lg-0">
                            <aside className="material-icons messanger-dark-color post-icon">
                              account_circle
                            </aside>
                          </div>
                        </div>
                        <div className="col-lg-10">
                          <div className="p-3 ps-lg-0">
                            <div className="input-group input-group-lg">
                              <input
                                type="text"
                                className="form-control rounded-pill facebook-light-gray-color"
                                id="write-post-textbox"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-lg"
                                placeholder="What's on your mind ..."
                                onFocus={openModal}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="read-post-section">{postcontainer}</div>
                </div>
              </div>
            </div>
          </section>
          <div
            className="modal fade"
            id="myModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <p className="modal-title" id="exampleModalLabel">
                    <strong>Create Post</strong>
                  </p>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {/*  */}

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      let btn = document.getElementById("sub");
                      btn.disabled = false;
                      if (!title.value || title.value == null) {
                        alert("Please enter post title");
                        btn.disabled = false;
                        return;
                      }
                      if (title.value.trim().length == 0) {
                        alert("Empty post title is not allowed.");
                        btn.disabled = false;
                        return;
                      }

                      //    let regf = /^[ A-Za-z0-9_@./#&+-]*$/
                      //    if(!regf.test(title.value)){
                      //         alert("Please enter valid post title");
                      //         btn.disabled = false;
                      //         return;
                      //    }

                      if (!body.value || body.value == null) {
                        alert("Please enter post message");
                        btn.disabled = false;
                        return;
                      }
                      if (body.value.trim().length == 0) {
                        alert("White spaces are not allowed.");
                        btn.disabled = false;
                        return;
                      }

                      //    if(!regf.test(body.value)){
                      //         alert("Please enter valid post description");
                      //         btn.disabled = false;
                      //         return;
                      //    }

                      // let temp = JSON.parse(user);
                      let flag = false;

                      //let msg = await axios.post('http:/localhost:3000/signup', user);

                      const instance = axios.create({
                        baseURL: "*",
                        timeout: 20000,
                        withCredentials: true,
                        headers: {
                          "Content-Type": "application/json;charset=UTF-8",
                          "Access-Control-Allow-Origin": "*",
                        },
                        validateStatus: function (status) {
                          return status < 500; // Resolve only if the status code is less than 500
                        },
                      });

                      const data1 = await instance.get(
                        `http://localhost:3000/session`
                      );
                      console.log(data1.data);

                      const userdata1 = await instance.get(
                        `http://localhost:3000/getUserData`
                      );
                      console.log(userdata1.data);

                      let user = {
                        title: title.value,
                        body: body.value,
                        userThatPosted: "Akshay",
                        isPublic: true,
                        uploadedImg: "",
                      };
                      let sampleonj = {
                        firstName: userdata1.data.firstName,
                        _id: data1.data.id,
                      };

                      let formData = new FormData();
                      formData.append("title", title.value);
                      formData.append("body", body.value);
                      formData.append(
                        "userThatPosted",
                        JSON.stringify(sampleonj)
                      );
                      formData.append("isPublic", true);
                      formData.append("image", file);

                      console.log(formData.get("userThatPosted"));

                      setAbout([user]);
                      console.log(user);
                      const instance2 = axios.create({
                        baseURL: "*",
                        timeout: 20000,
                        withCredentials: true,
                        headers: {
                          "Content-Type":
                            "multipart/form-data; boundary=${form._boundary}",
                          //;charset=UTF-8
                        },
                        validateStatus: function (status) {
                          return status < 500; // Resolve only if the status code is less than 500
                        },
                      });
                      await instance2
                        .post(`http://localhost:3000/posts`, formData)
                        .then(function (response) {
                          console.log(response);

                          if (response.status === 200) {
                            alert("Post posted successfully!!!");
                            flag = true;
                            window.location.reload();
                          }
                        })
                        .catch(function (error) {
                          console.log(error);
                          //setSuccess(false);
                          alert("There was some error please try again");
                        });

                      e.target.reset();
                      //btn.disabled = false;
                      if (flag) {
                        props.handleClose(false);
                      }
                    }}
                  >
                    <div className="mb-3">
                      <label for="title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        aria-describedby="emailHelp"
                        ref={(node) => {
                          title = node;
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="body" className="col-form-label">
                        Message:
                      </label>
                      <textarea
                        className="form-control"
                        id="body"
                        ref={(node) => {
                          body = node;
                        }}
                      ></textarea>
                    </div>
                    <div className="input-group mb-3">
                      {/* <label className="input-group-text" htmlFor="inputGroupFile01">Upload</label> */}
                      {/* <input type="file" className="form-control" id="inputGroupFile01" /> */}
                      <label>
                        <input
                          onChange={fileSelected1}
                          name="file"
                          type="file"
                          accept="image/*"
                        ></input>
                      </label>
                    </div>
                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn btn-secondary me-3"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        id="sub"
                      >
                        Publish
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/*  */}
        </>
      );
    }
  }
};

export default Posts;
