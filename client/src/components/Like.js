import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import "../App.css";
import logoImg from "../images/logo.gif";
import maleUser from "../images/male-user.svg";
import femaleUser from "../images/female-user.svg";
import otherUser from "../images/other.svg";
import $, { event } from "jquery";
import { Modal } from "bootstrap";
import axios from "axios";
import { Form, FloatingLabel, Button, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import cryptojs from "crypto-js";
const Like = (props) => {
  console.log(props);

  const [likedata, setlikedata] = useState(props.numlikes);

  const [commentsdata, setcommentsdata] = useState(props.numcomments);

  const [flag, setflag] = useState(undefined);

  const [getcommentsdata, setgetcommentsdata] = useState([]);
  const [editdataid, seteditdataid] = useState(undefined);
  // setlikedata(props.n);
  let likecontainer,
    commentscontainer = null;
  let finallikes = 0;
  let body;



  
  async function likefunk(likeid) {
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

    const data1 = await instance.get(`http://localhost:3000/session`);
    console.log(data1.data.id);
    
    let likeobj = { userID: data1.data.id };

    // const postdata  = await instance.get(`http://localhost:3000/posts`);
    // console.log(postdata);

    const instancelike = axios.create({
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

    await instancelike
      .post(`http://localhost:3000/posts/like/${likeid}`, likeobj, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then(function (response) {
        console.log(response.data.likes.length);

        if (response.status === 200) {
          console.log();
          console.log();
         
          setlikedata(response.data.likes.length);
          if (response.data.likes.includes(data1.data.id)) {
            document
              .getElementById(`${likeid}`)
              .classList.remove("material-icons-outlined");
            document
              .getElementById(`${likeid}`)
              .classList.add("material-icons");
          } else {
            document
              .getElementById(`${likeid}`)
              .classList.remove("material-icons");
            document
              .getElementById(`${likeid}`)
              .classList.add("material-icons-outlined");
          }
        }else{
          setflag(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        //setSuccess(false);
        alert("There was some error please try again");
      });
  }

  const openComments = (param) => (event) => {
    let a = "";
    if (event.target.tagName == "BUTTON") {
      a = event.target.parentNode.nextElementSibling;
    } else {
      a = event.target.parentNode.parentNode.nextElementSibling;
    }
    a.style.display = "block";
    window.setTimeout(function () {
      a.style.opacity = 1;
      a.style.transform = "scale(1)";
    }, 0);
  };

  useEffect(() => {
    async function getallcomments() {
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

      const seecomdata = await instance.get(
        `http://localhost:3000/comments/${props.mainid}`
      );
      console.log(seecomdata);
      setgetcommentsdata(seecomdata.data);
    }
    getallcomments();

    // async function fetchdata() {
    //   const instance = axios.create({
    //     baseURL: "*",
    //     timeout: 20000,
    //     withCredentials: true,
    //     headers: {
    //       "Content-Type": "application/json;charset=UTF-8",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //     validateStatus: function (status) {
    //       return status < 500; // Resolve only if the status code is less than 500
    //     },
    //   });

    //   const data1 = await instance.get(`http://localhost:3000/session`);
    //   console.log(data1.data.id);


      
    // for(let i=0;i<=commentsdata.length;i++){
    //   if(commentsdata[i].likes.includes(data1.data.id)){
    //     document
    //     .getElementById(`${data1.data.id}`)
    //     .classList.remove("material-icons-outlined");
    //   document
    //     .getElementById(`${data1.data.id}`)
    //     .classList.add("material-icons");
    //   }
    // }
    
    // }fetchdata();
  }, []);

  commentscontainer =
    getcommentsdata &&
    getcommentsdata.map((n) => {
      async function opencommentdeltemodal(idd) {
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
        console.log(n.userThatPostedComment._id);
        console.log(userdata1.data.id);
        console.log();
        if (userdata1.data.id === n.userThatPostedComment._id) {
          seteditdataid(idd);
          let myDeleteModal1 = new Modal(
            document.getElementById("commentdeleteModal")
          );
          myDeleteModal1.show();
        } else {
          alert("You cannot delete this post.");
        }
      }

      

      async function deletecomment(delid) {
        //delid = editdataid
        console.log(delid);
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

        let postid = delid;
        console.log(postid);
        console.log(delid);
        const userdata1 = await instance.get(`http://localhost:3000/session`);
        const userdata2 = await instance.get(
          `http://localhost:3000/comments/comment/${postid}`
        );
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
        if (userdata1.data.id === userdata2.data.userThatPostedComment._id) {
          const newseepostdata = await instance2
            .delete(`http://localhost:3000/comments/${postid}`)
            .then(function (response) {
              console.log(response.data);

              if (response.status === 200) {
                // let myDeleteModal1 = new Modal(document.getElementById('commentdeleteModal'));
                // myDeleteModal1.hide();
                window.location.reload();
              }
            })
            .catch(function (error) {
              console.log(error);
              //setSuccess(false);
              alert("There was some error please try again");
            });
        } else {
          alert("You cannot delete this comment.");
        }

        //   const seepostdata = await instance.get(
        //     `http://localhost:3000/posts`
        //   );
        //   console.log(seepostdata.data);
        //   setSeepost(seepostdata.data);
        //   setLoading(false);
      }

      return (
        <div>
          

          <div className="post-row">
            <div className="left-header-box align-self-center">
              <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
                <aside className="material-icons messanger-dark-color post-icon">
                  account_circle
                </aside>
              </div>
            </div>
            <div className="right-header-box flex-grow-1">
              <div className="p-2 p-lg-3 ps-lg-0 w-100">
                <div className="card facebook-light-gray-color p-3 border-25 user-comments-card">
                  <div className="d-flex justify-content-between">
                    <p className="card-title">
                      <strong>{n.userThatPostedComment.firstName}</strong>
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-danger delete-post-btn d-flex"
                      onClick={() => deletecomment(n._id)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                  <p className="card-subtitle">{n.comment}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

  // Similar to componentDidMount and componentDidUpdate:
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   if(commentsdata.likes.includes(props.mainid)){
  //     setflag(true);
  //   }
  // });



  return (
    <>
      <div className="post-row flex-row justify-content-between me-3 ms-3">
        <div className="d-flex flex-row">
        
          <span
            className="material-icons-outlined messanger-dark-color me-2 unlike-show-btn"
            id={props.mainid}
          >
            thumb_up
          </span>
          
          <p className="text-secondary">{likedata}</p>
        </div>
        <div className="d-flex flex-row">
          <p className="text-secondary me-2">{commentsdata}</p>
          <p className="text-secondary">comments</p>
        </div>
      </div>
      <hr className="m-0 mt-2 mb-0"></hr>
      <div className="post-row flex-row">
        <button
          type="button"
          className="btn btn-outline-primary d-flex flex-row align-self-center post-buttons border-0 justify-content-center"
          onClick={() => likefunk(props.mainid)}
        >
          <span className="material-icons-outlined me-2">thumb_up</span>
          <span>Like</span>
        </button>
        <button
          type="button"
          className="btn btn-outline-primary d-flex flex-row align-self-center post-buttons border-0 justify-content-center"
          onClick={(e) => openComments(1)(e)}
        >
          <span className="material-icons-outlined me-2">
            chat_bubble_outline
          </span>
          <span>Comment</span>
        </button>
      </div>
      <div className="comments-box">
        <hr className="m-0"></hr>
        <div className="post-row">
          <div className="left-header-box">
            <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
              <aside className="material-icons messanger-dark-color post-icon">
                account_circle
              </aside>
            </div>
          </div>
          <div className="right-header-box flex-grow-1">
            <div className="p-2 p-lg-3 pb-0 pb-lg-0 ps-lg-0 w-100">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (!body.value || body.value == null) {
                    alert("Please enter the comment");
                    btn.disabled = false;
                    return;
                  }
                  if (body.value.trim().length == 0) {
                    alert("White spaces are not allowed.");
                    btn.disabled = false;
                    return;
                  }

                  let btn = document.querySelector(".sendComment");
                  btn.disabled = false;
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

                  let sampleonj = {
                    firstName: userdata1.data.firstName,
                    _id: data1.data.id,
                  };

                  let formData = new FormData();
                  formData.append("comment", body.value);
                  formData.append(
                    "userThatPostedComment",
                    JSON.stringify(sampleonj)
                  );
                  let user = {
                    comment: body.value,
                    userThatPostedComment: sampleonj,
                  };

                  //console.log(formData.get('userThatPosted'));
                  const instance2 = axios.create({
                    baseURL: "*",
                    timeout: 20000,
                    withCredentials: true,
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8",
                      //;charset=UTF-8
                    },
                    validateStatus: function (status) {
                      return status < 500; // Resolve only if the status code is less than 500
                    },
                  });
                  let postid = props.mainid;
                  await instance2
                    .post(`http://localhost:3000/comments/${postid}`, user)
                    .then(function (response) {
                      console.log(response.data);

                      if (response.status === 200) {
                        async function finalcom() {
                          const numcomm = await instance.get(
                            `http://localhost:3000/posts/${postid}`
                          );

                          console.log(numcomm);
                          setcommentsdata(numcomm.data.comments.length);
                          setgetcommentsdata(numcomm.data.comments);
                          // alert("Post posted successfully!!!");
                          flag = true;
                          // window.location.reload();
                        }
                        finalcom();
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                      //setSuccess(false);
                      alert("There was some error please try again");
                    });

                  e.target.reset();
                  //btn.disabled = false;
                }}
              >
                <input
                  type="text"
                  className="form-control rounded-pill facebook-light-gray-color"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="Write Something ..."
                  ref={(node) => {
                    body = node;
                  }}
                />
                <div className="input-group mb-3 mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill sendComment"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {commentscontainer}
      </div>
    </>
  );
};
export default Like;
