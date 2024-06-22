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

const UserImage = (props) => {
  console.log(props);
  const [loading, setLoading] = useState(true);
  const [uimg, setuimg] = useState(true);

  useEffect(() => {
    async function getuserimg(id) {
      console.log("reached");
      const instance = axios.create({
        baseURL: "*",
        //timeout: 20000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      });

      const resp = await instance.get(`http://localhost:3000/getImage/${id}`);
      console.log(resp);
      if (resp.status === 200) {
        console.log(resp.data.profileImage);
        //if(resp.data.profileImage){
        console.log(resp.data.profileImage);
        setuimg(resp.data.profileImage);
        setLoading(false);
        //}
      } else {
        setLoading(true);
      }
    }
    getuserimg(props.id);
  }, []);

  if (loading) {
    return (
      <aside className="material-icons messanger-dark-color post-icon">
        account_circle
      </aside>
    );
  } else {
    return (
      <img
        className="img-fluid user-posted-img rounded-circle"
        src={require("/public/uploads/" + uimg)}
        alt="post image"
      />
    );
  }
};
export default UserImage;
