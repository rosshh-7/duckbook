import "./conversation.css";
import img from "./logo512.png";
import React, { useState, useEffect } from "react";
import UserImage from "../UserImage";
import axios from "axios";
export default function Conversations({ conversationid, id1, id2, userid }) {
  let searchid;
  if (id1 == userid) {
    searchid = id2;
  } else {
    searchid = id1;
  }

  const [info, setInfo] = useState({});

  useEffect(() => {
    fetchdata();
  }, []);
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
      `http://localhost:3000/userprofile/${searchid}`
    );
    console.log(resp.data.data.d);

    if (resp.data.data.res) {
      setInfo(resp.data.data.d);
    } else {
      console.log("user not found");
      //set state for user profile not found
    }
  }

  return (
    <div className="conversation">
      {/* <img
        className="conversationImg"
        src={require("/public/uploads/" + info.profileImage)}
        alt="profile picture"
      ></img> */}
      <span className="conversationName">
        {info.firstName + " " + info.lastName}
      </span>
    </div>
  );
}
