import Navigation from "../Navigation";
import Conversations from "./Conversations";
import Message from "./Message";
import "./messenger.css";
import { useNavigate, Navigate } from "react-router-dom";
import cryptojs from "crypto-js";
import React, { useState, useEffect, useRef } from "react";

import "../../App.css";

import axios from "axios";

import { io } from "socket.io-client";
import { data } from "jquery";

export default function Messenger() {
  const [loading, setLoading] = useState(true);
  const [convoData, setConvoData] = useState([]);
  const [currrentChat, setCurrrentChat] = useState(null);
  const [currrentChat1, setCurrrentChat1] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newmessages, setNewMessages] = useState("");
  const [arrivalMessage, setArrivalMessages] = useState(null);
  const socket = useRef(io("ws://localhost:8900"));
  const [id, setId] = useState("");
  const [session, setSession] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [fnd, setFnd] = useState([]);
  const [offline, setOffline] = useState(false);

  const scrollRef = useRef();
  let idd;

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
          console.log(decid);
          if (tempid === decid.toString()) {
            setId(decid);
            console.log("here");
            console.log("works");
            setSession(true);
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
        setLoading(false);
      }
      //return;
    } else {
      console.log("here in the outer if");
      setLoading(false);
      setSession(false);
    }
  }, [session]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      // if (data.status) {
      setArrivalMessages({
        senderId: data.senderId,
        message: data.message,
        createdAt: Date.now(),
      });
      // } else {
      //   setOffline(true);
      // }
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currrentChat1?.members.includes(arrivalMessage.senderId) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currrentChat1]);

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
      `http://localhost:3000/conversation/getconvo/${id}`
    );

    console.log(resp);
    if (resp.data.result) {
      setConvoData(resp.data.data);
    } else {
      console.log("user not found");
      //set state for user profile not found
    }
  }

  useEffect(() => {
    async function fetchMesgData() {
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

        const resp = await instance.get(
          `http://localhost:3000/message/getmessage/${currrentChat}`
        );

        setMessages(resp.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMesgData();
  }, [currrentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.current.emit("addUser", id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newMessage = {
      sender: id,
      conversationId: currrentChat,
      message: newmessages,
    };
    //if (!offline) {
    const recId = currrentChat1.members.find((member) => member != id);
    console.log(recId);
    let encpmsg = cryptojs.AES.encrypt(
      JSON.stringify(newmessages),
      "MySecretKey"
    ).toString();
    socket.current.emit("sendMessage", {
      senderId: id,
      receiverId: recId,
      message: encpmsg,
    });
    // }
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
    await instance
      .post(`http://localhost:3000/message/addmessage`, newMessage)
      .then(function (response) {
        setMessages([...messages, response.data.newMessage]);
        setNewMessages("");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
          <Navigation></Navigation>
          <div className="messenger">
            <div className="chatMenu">
              <div className="chatMenuWrapper">
                {convoData.length > 0 ? (
                  convoData.map((d) => {
                    return (
                      <div
                        key={d._id}
                        onClick={() => {
                          setCurrrentChat(d._id);
                          setCurrrentChat1(d);
                        }}
                      >
                        <Conversations
                          conversationid={d._id}
                          id1={d.members[0]}
                          id2={d.members[1]}
                          userid={id}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p>no friends to show</p>
                )}
              </div>
            </div>
            <div className="chatBox">
              <div className="chatBoxWrapper">
                {currrentChat ? (
                  <>
                    <div className="chatBoxTop">
                      {messages.map((m) => (
                        <div ref={scrollRef}>
                          <Message
                            message={m}
                            own={m.senderId == id}
                            id1={currrentChat1.members[0]}
                            id2={currrentChat1.members[1]}
                            userid={id}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="chatBoxBottom">
                      <textarea
                        className="chatMessageInput"
                        placeholder="write your message here..."
                        onChange={(e) => setNewMessages(e.target.value)}
                        value={newmessages}
                      ></textarea>
                      <button
                        className="chatSubmitButton"
                        onClick={handleSubmit}
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <span>OPen a conversation to chat</span>
                )}
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}
