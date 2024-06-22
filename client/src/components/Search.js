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
import Error from "./Error";
const Search = (props) => {
  const [SearchResults, setSearchResults] = useState([]);
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(true);
  let SearchResultsContainer,
    Errorpage = null;
  let firstName;
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

    if (localStorage.length !== 0) {
      console.log("here");
      checkSession();

      //return;
    } else {
      console.log("here in the outer if");
      setLoading(false);
      setSession(false);
    }
  }, [session]);
  SearchResultsContainer =
    SearchResults &&
    SearchResults.map((n) => {
      console.log(n);
      let finalstr = "";
      if (n.profileImage) {
        finalstr = require("/public/uploads/" + n.profileImage);
      } else if (!n.profileImage && n.gender == "male") {
        finalstr = maleUser;
      } else if (!n.profileImage && n.gender == "female") {
        finalstr = femaleUser;
      } else {
        finalstr = otherUser;
      }

      let finalurl = "";

      if (n._id) {
        finalurl = "http://localhost:4000/userprofile/" + n._id;
      }

      return (
        <div className="col-sm-4">
          <a href={finalurl} className="search-card">
            <div className="card text-center mb-5">
              <div>
                <img
                  src={finalstr}
                  className="friend-list-card-img card-img-top"
                  alt="User Profile Pic"
                  style={{ height: "174px" }}
                />
              </div>
              <div className="card-body">
                <p className="card-title text-center search-frds-title">
                  <strong> {n.firstName} </strong>
                </p>
              </div>
            </div>
          </a>
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
        <div>
          <Navigation></Navigation>
          <Form
            className="signupForm"
            onSubmit={async (e) => {
              e.preventDefault();

              let btn = document.getElementById("sub");
              btn.disabled = false;
              if (!firstName.value) {
                alert("Please enter first name");
                btn.disabled = false;
                return;
              }

              if (firstName.value.trim().length == 0) {
                alert("White spaces are not allowed.");
                btn.disabled = false;
                return;
              }
              let counter = 0;
              for (let i = 0; i <= firstName.value.length; i++) {
                if (firstName.value.charAt(i) == " ") {
                  counter++;
                }
              }
              if (counter > 0) {
                alert(
                  "Please enter only one word for searching with no spaces." +
                    "\n" +
                    "For Example:- Akshay"
                );
              }

              let user = {
                firstName: firstName.value,
              };
              // let temp = JSON.parse(user);
              let flag = false;
              //let url = 'http:/localhost:3000/updateprofile'
              console.log(user);
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
              //setAbout([user]);
              console.log(user);

              await instance
                .get(`http://localhost:3000/getallusers/${user.firstName}`)
                .then(function (response) {
                  console.log(response.data.data);

                  if (response.status === 200) {
                    if (response.data.data.length == 0) {
                      alert("404 : No user found with that name");
                    } else {
                      setSearchResults(response.data.data);
                      flag = true;
                    }
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
            <Row className="mb-4">
              <Form.Group as={Col}>
                <FloatingLabel
                  controlId="firstName"
                  label="First Name"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    className="textform"
                    ref={(node) => {
                      firstName = node;
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
            </Row>

            <Button id="sub" variant="primary" type="submit" className="submit">
              Search
            </Button>
          </Form>
          <div>
            <div className="row">{SearchResultsContainer}</div>
          </div>
        </div>
      );
    }
  }
};

export default Search;
