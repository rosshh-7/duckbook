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
import ReactModal from "react-modal";
const EditPost = (props) => {
  console.log(props);
  //const loading
  const [showModal, setShowModal] = useState(props.isOpen);
  const [about, setAbout] = useState(undefined);
  let title,
    body = null;
  let temp = null;

  const handleCloseModal = () => {
    $(".editmodal").on("hidden.bs.modal", function () {
      $(this).data("bs.modal", null);
    });

    setShowModal(true);
    props.handleClose(false);
  };

  if (props.modal === "editpost") {
    temp = (
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            let btn = document.getElementById("sub1");
            btn.disabled = false;

            if (!title.value) {
              console.log(title.value);
              alert("Please enter post title");
              btn.disabled = false;
              return;
            }

            if (title.value.trim().length == 0) {
              alert("Only white spaces are not allowed.");
              btn.disabled = false;
              return;
            }

            if (!body.value) {
              alert("Please enter first post description");
              btn.disabled = false;
              return;
            }
            if (body.value.trim().length == 0) {
              alert("Only white spaces are not allowed.");
              btn.disabled = false;
              return;
            }

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

            let postid = props.n._id;

            const clickedpost = await instance.get(
              `http://localhost:3000/posts/${postid}`
            );

            // props.n.title = clickedpost.data.title;
            // props.n.body = clickedpost.data.body;

            const data1 = await instance.get(`http://localhost:3000/session`);
            console.log(data1.data);

            const userdata1 = await instance.get(
              `http://localhost:3000/getUserData`
            );
            console.log(userdata1.data);

            console.log(document.getElementById("title").value);
            let user = {
              id: postid,
              title: title.value,
              body: body.value,
              isPublic: true,
            };
            console.log(user);

            // let formData1 = new FormData();
            //         formData1.append("id",postid);
            //         formData1.append("title",title.value);
            //         formData1.append("body" , body.value);
            //         formData1.append("isPublic", true);

            // console.log("yE HAI AASLI"+formData1.get('title'));

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

            await instance2
              .patch(`http://localhost:3000/posts/${postid}`, user)
              .then(function (response) {
                console.log(response.data);

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
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              aria-describedby="emailHelp"
              defaultValue={props.n.title}
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
              defaultValue={props.n.body}
              ref={(node) => {
                body = node;
              }}
            ></textarea>
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-secondary me-3"
              data-bs-dismiss="modal"
              onClick={handleCloseModal}
            >
              Close
            </button>

            <button type="submit" className="btn btn-primary" id="sub1">
              Publish
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="App-body pt-5 mt-5">
      <ReactModal
        class="editmodal"
        name="editPost"
        isOpen={showModal}
        contentLabel="Edit Post"
        style={{
          overlay: {
            marginTop: "50px",
            marginLeft: "50px",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
          content: {
            marginLeft: "400px",
            width: "500px",
            height: "410px",
            position: "relative",
            top: "30px",
            left: "30px",
            right: "30px",
            bottom: "30px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
      >
        <h4></h4>
        {temp}
      </ReactModal>
    </div>
  );
};

export default EditPost;
