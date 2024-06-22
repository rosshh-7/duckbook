import React, { useEffect, useState } from "react";
import img from "./logo512.png";
import "./message.css";
import { format } from "timeago.js";
import axios from "axios";
import cryptojs from "crypto-js";
export default function Message({ own, message, userid, id1, id2 }) {
  let searchid;
  if (id1 == userid) {
    searchid = id2;
  } else {
    searchid = id1;
  }
  let tempmsg = message.message;
  console.log(message.message);
  let bytes1 = cryptojs.AES.decrypt(tempmsg, "MySecretKey");
  console.log(bytes1);
  let decpmsg = JSON.parse(bytes1.toString(cryptojs.enc.Utf8));

  const [info, setInfo] = useState({});
  const [info1, setInfo1] = useState({});

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
    const resp1 = await instance.get(
      `http://localhost:3000/userprofile/${userid}`
    );
    console.log(resp.data.data.d);

    if (resp.data.data.res) {
      setInfo(resp.data.data.d);
      setInfo1(resp1.data.data.d);
    } else {
      console.log("user not found");
      //set state for user profile not found
    }
  }
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img className="messageImg" src={img} alt="profile picture"></img>
        <p className="messageText">{decpmsg}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
