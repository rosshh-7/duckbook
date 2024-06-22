import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import FriendCard from "./FriendCard";
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

export default function ViewRequests() {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const [reqData, setReqData] = useState([]);

  const [session, setSession] = useState(false);
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
      if (session) {
        fetchdata();
      }
      //return;
    } else {
      console.log("here in the outer if");
      setLoading(false);
      setSession(false);
    }
  }, [session]);

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

    const resp = await instance.get(
      `http://localhost:3000/friend/findFriend/${id}`
    );
    console.log(resp);
    if (resp.data.status) {
      setReqData(resp.data.data);
    } else {
      setReqData([]);
    }
  }

  function Update() {
    fetchdata();
  }
  console.log(reqData);
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
        <>
          <Navigation />
          <div className="text-center">
            <h2>Friend Requests</h2>
          </div>
          <div className="container">
            <div className="row">
              {reqData.length != 0 ? (
                reqData.map((d) => {
                  return (
                    <FriendCard
                      receiverId={d.sender}
                      userId={id}
                      handler={Update}
                    />
                  );
                })
              ) : (
                <h3 className="text-center mt-5">No request Received</h3>
              )}
            </div>
          </div>
        </>
      );
    }
  }
}
