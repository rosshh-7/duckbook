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
import { useNavigate, Navigate } from "react-router-dom";
import cryptojs from "crypto-js";
import UserImage from "./UserImage";

const Memories = (props) => {
  const [getmemoriesdata, setgetmemoriesdata] = useState([]);
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const openComments = (param) => (event) => {
    let a = "";
    if (event.target.tagName == "SPAN") {
      a = event.target.parentNode.parentNode.parentNode.nextElementSibling;
    }
    a.style.display = "block";
    window.setTimeout(function () {
      a.style.opacity = 1;
      a.style.transform = "scale(1)";
    }, 0);
  };

  let memoriescontainer,
    memcomcontainer,
    memoriescontainer1,
    memcomcontainer1,
    memoriescontainer2,
    memcomcontainer2 = null;

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
          //setLoading(false);
          // return;
        } else {
          let bytes1 = cryptojs.AES.decrypt(data._id, "MySecretKey");
          console.log(bytes1);
          let tempid = JSON.parse(bytes1.toString(cryptojs.enc.Utf8));

          let tempid1 = localStorage.getItem("userSession");
          let bytes = cryptojs.AES.decrypt(tempid1, "MySecretKey");
          console.log(bytes);
          // let decid = JSON.parse(temp);
          let decid = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

          if (tempid === decid.toString()) {
            setId(decid);
            console.log("here");
            console.log("works");
            setSession(true);
          } else {
            setSession(false);
            //setLoading(false);
          }
          // return;
        }
      } catch (e) {
        console.log(e);
      }
    }

    async function getallmemories() {
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
      console.log(userdata1.data.id);

      const seecomdata = await instance.get(
        `http://localhost:3000/posts/memories/${userdata1.data.id}`
      );
      console.log(seecomdata.data[0]);
      setgetmemoriesdata(seecomdata.data[0]);
    }

    if (localStorage.length !== 0) {
      console.log("here");
      checkSession();
      if (session) {
        getallmemories();
        setLoading(false);
      }
      //return;
    } else {
      console.log("here in the outer if");
      setLoading(false);
      setSession(false);
    }
  }, [session]);

  memcomcontainer =
    getmemoriesdata.today &&
    getmemoriesdata.today.map((n) => {
      return (
        <div className="post-row">
          <div className="left-header-box align-self-center">
            <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
              <UserImage id={n.userThatPosted._id}></UserImage>
            </div>
          </div>
          <div className="right-header-box flex-grow-1">
            <div className="p-2 p-lg-3 ps-lg-0 w-100">
              <div className="card facebook-light-gray-color p-3 border-25">
                <div className="d-flex justify-content-between">
                  <p className="card-title">
                    <strong>{n.userThatPosted.firstName}</strong>
                  </p>
                </div>
                <p className="card-subtitle">{n.comments.comment}</p>
              </div>
            </div>
          </div>
        </div>
      );
    });

  memoriescontainer =
    getmemoriesdata.today &&
    getmemoriesdata.today.map((n) => {
      let imgstr = "";
      if (n.imagePath) {
        imgstr = "http://localhost:3000" + n.imagePath;
      }
      return (
        <div>
          <div className="card post-card align-self-center mb-3">
            <div className="post-row">
              <div className="left-header-box">
                <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
                  <aside className="material-icons messanger-dark-color post-icon">
                    account_circle
                  </aside>
                </div>
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
                <img className="img-fluid" src={imgstr} alt="post image" />
              )}
            </div>
            <hr className="m-0 mb-2"></hr>
            <div className="post-row flex-row justify-content-between me-3 ms-3">
              <div className="d-flex flex-row">
                <span className="material-icons-outlined messanger-dark-color me-2">
                  thumb_up
                </span>
                <p className="text-secondary">{n.likes.length}</p>
              </div>
              <div className="d-flex flex-row">
                <a
                  className="memories-comments-button"
                  type="button"
                  onClick={(e) => openComments(1)(e)}
                >
                  <span className="text-secondary me-2">
                    {n.comments.length}
                  </span>
                  <span className="text-secondary">comments</span>
                </a>
              </div>
            </div>

            <div className="comments-box">
              <hr className="m-0"></hr>
              {memcomcontainer}
            </div>
          </div>
        </div>
      );
    });

  memcomcontainer1 =
    getmemoriesdata.week &&
    getmemoriesdata.week.map((n) => {
      return (
        <div className="post-row">
          <div className="left-header-box align-self-center">
            <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
              <UserImage id={n.userThatPosted._id}></UserImage>
            </div>
          </div>
          <div className="right-header-box flex-grow-1">
            <div className="p-2 p-lg-3 ps-lg-0 w-100">
              <div className="card facebook-light-gray-color p-3 border-25">
                <div className="d-flex justify-content-between">
                  <p className="card-title">
                    <strong>{n.userThatPosted.firstName}</strong>
                  </p>
                </div>
                <p className="card-subtitle">{n.comments.comment}</p>
              </div>
            </div>
          </div>
        </div>
      );
    });

  memoriescontainer1 =
    getmemoriesdata.week &&
    getmemoriesdata.week.map((n) => {
      let imgstr = "";
      if (n.imagePath) {
        imgstr = "http://localhost:3000" + n.imagePath;
      }
      return (
        <div>
          <div className="card post-card align-self-center mb-3">
            <div className="post-row">
              <div className="left-header-box">
                <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
                  <UserImage id={n.userThatPosted._id}></UserImage>
                </div>
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
                <img className="img-fluid" src={imgstr} alt="post image" />
              )}
            </div>
            <hr className="m-0 mb-2"></hr>
            <div className="post-row flex-row justify-content-between me-3 ms-3">
              <div className="d-flex flex-row">
                <span className="material-icons-outlined messanger-dark-color me-2">
                  thumb_up
                </span>
                <p className="text-secondary">{n.likes.length}</p>
              </div>
              <div className="d-flex flex-row">
                <a
                  className="memories-comments-button"
                  type="button"
                  onClick={(e) => openComments(1)(e)}
                >
                  <span className="text-secondary me-2">
                    {n.comments.length}
                  </span>
                  <span className="text-secondary">comments</span>
                </a>
              </div>
            </div>

            <div className="comments-box">
              <hr className="m-0"></hr>
              {memcomcontainer1}
            </div>
          </div>
        </div>
      );
    });

  memcomcontainer2 =
    getmemoriesdata.month &&
    getmemoriesdata.month.map((n) => {
      return (
        <div className="post-row">
          <div className="left-header-box align-self-center">
            <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
              <UserImage id={n.userThatPosted._id}></UserImage>
            </div>
          </div>
          <div className="right-header-box flex-grow-1">
            <div className="p-2 p-lg-3 ps-lg-0 w-100">
              <div className="card facebook-light-gray-color p-3 border-25">
                <div className="d-flex justify-content-between">
                  <p className="card-title">
                    <strong>{n.userThatPosted.firstName}</strong>
                  </p>
                </div>
                <p className="card-subtitle">{n.comments.comment}</p>
              </div>
            </div>
          </div>
        </div>
      );
    });

  memoriescontainer2 =
    getmemoriesdata.month &&
    getmemoriesdata.month.map((n) => {
      let imgstr = "";
      if (n.imagePath) {
        imgstr = "http://localhost:3000" + n.imagePath;
      }
      return (
        <div>
          <div className="card post-card align-self-center mb-3">
            <div className="post-row">
              <div className="left-header-box">
                <div className="p-2 p-lg-3 pb-0 pb-lg-0 text-center">
                  <UserImage id={n.userThatPosted._id}></UserImage>
                </div>
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
                <img className="img-fluid" src={imgstr} alt="post image" />
              )}
            </div>
            <hr className="m-0 mb-2"></hr>
            <div className="post-row flex-row justify-content-between me-3 ms-3">
              <div className="d-flex flex-row">
                <span className="material-icons-outlined messanger-dark-color me-2">
                  thumb_up
                </span>
                <p className="text-secondary">{n.likes.length}</p>
              </div>
              <div className="d-flex flex-row">
                <a
                  className="memories-comments-button"
                  type="button"
                  onClick={(e) => openComments(1)(e)}
                >
                  <span className="text-secondary me-2">
                    {n.comments.length}
                  </span>
                  <span className="text-secondary">comments</span>
                </a>
              </div>
            </div>

            <div className="comments-box">
              <hr className="m-0"></hr>
              {memcomcontainer2}
            </div>
          </div>
        </div>
      );
    });
  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
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
                  <div className="read-post-section mb-5">
                    <div className="card-header memories-card-heading border-0">
                      <strong>Today</strong>
                    </div>
                    {memoriescontainer}
                  </div>
                  <div className="read-post-section mb-5">
                    <div className="card-header memories-card-heading border-0">
                      <strong>A Week Ago</strong>
                    </div>
                    {memoriescontainer1}
                  </div>
                  <div className="read-post-section mb-5">
                    <div className="card-header memories-card-heading border-0">
                      <strong>A Month Ago</strong>
                    </div>
                    {memoriescontainer2}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
    }
  }
};

export default Memories;
