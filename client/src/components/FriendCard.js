import React, { useEffect, useState } from "react";
import maleUser from "../images/male-user.svg";
import axios from "axios";

export default function FriendCard(props) {
  console.log(props);
  const [info, setInfo] = useState({});

  useEffect(() => {
    fetchdata();
  }, []);
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
      `http://localhost:3000/userprofile/${props.receiverId}`
    );
    console.log(resp.data.data.d);
    if (resp.data.data.res) {
      setInfo(resp.data.data.d);
    } else {
      console.log("user not found");
      //set state for user profile not found
    }
  }
  async function handleAccept() {
    await instance
      .post(`http://localhost:3000/friend/addfriend`, {
        senderId: props.receiverId,
        userId: props.userId,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.status) {
          alert("Friend added");
          props.handler();
        } else {
          alert("Cannot Accept Request: Error Occurred");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Cannot Cancel Request: Error Occurred");
      });
  }
  async function handleReject() {
    await instance
      .post(`http://localhost:3000/friend/cancelRequest`, {
        sender: props.receiverId,
        receiver: props.userId,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.status) {
          props.handler();
        } else {
          alert("Cannot Cancel Request: Error Occurred");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Cannot Cancel Request: Error Occurred");
      });
  }
  return (
    <>
      <div className="col-lg-6" key={props.receiverId}>
        <div className="card align-items-center">
          <img
            //src={`http://localhost:3000${info.profileImage}`}
            src={require("/public/uploads/" + info.profileImage)}
            className="friend-list-card-img"
            alt="User Profile Pic"
          />
          <div className="card-body">
            <h5 className="card-title text-center">
              {info.firstName + " " + info.lastName}
            </h5>
            <div className="row mx-auto align-items-center">
              <div className="col-sm-5">
                <a href="#" className="btn btn-danger" onClick={handleReject}>
                  Reject
                </a>
              </div>
              <div className="col-sm-5">
                <a className="btn btn-success" onClick={handleAccept}>
                  Accept
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
