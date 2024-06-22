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
import About from "./About";
import EditProfile from "./EditProfile";

const Friends = ({ fid, userId, param }) => {
  const [loading, setLoading] = useState(true);
  console.log(fid);
  const [info, setInfo] = useState(undefined);
  useEffect(async () => {
    await fetchdata();

    setLoading(false);
  }, []);
  async function fetchdata() {
    const instance = axios.create({
      baseURL: "*",

      withCredentials: true,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      },
    });

    const resp = await instance.get(`http://localhost:3000/userprofile/${fid}`);
    console.log(resp.data.data.d);
    if (resp.data.data.res) {
      setInfo(resp.data.data.d);
    } else {
      console.log("user not found");
      //set state for user profile not found
    }
  }
  const instance = axios.create({
    baseURL: "*",
    timeout: 20000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      keys: userId,
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  async function handleRemove(user, fid) {
    await instance
      .post(`http://localhost:3000/friend/removefriend`, {
        userId: user,
        fId: fid,
      })
      .then(function (response) {
        if (response.data.status) {
          alert("Friend deleted");
        } else {
          alert("Error in Deletion!");
        }
      })
      .catch(function (error) {});
  }

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="col-sm-4">
        <div className="card text-center">
          <aside className="material-icons messanger-dark-color post-icon">
            account_circle
          </aside>

          <div className="card-body">
            <h5 className="card-title text-center">
              {info.firstName + " " + info.lastName}
            </h5>
            {param == userId ? (
              <a
                className="btn btn-primary"
                onClick={() => handleRemove(userId, fid)}
              >
                Remove
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
};

export default Friends;
