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
import About from "./About";
import EditProfile from "./EditProfile";
import Friends from "./Friends";

//import {}
const Userprofile = (props) => {
  let firstName;
  let lastName;
  let email;
  let pswd;
  let confirmPswd;
  let dob;
  let gender;
  let relationStatus;
  let interests;
  //let id;
  let userProfileData,
    editProfileData = null;

  const [about, setAbout] = useState({});
  const [fndData, setFndData] = useState([]);
  const [aboutedit, setAboutEdit] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  //let bytes = cryptojs.AES.decrypt(ReactSession.get('user'), 'MySecretKey');
  /*if (
    localStorage.getItem("user") &&
    localStorage.getItem("user") !== "undefined"
  ) {
    id = cryptojs.AES.decrypt(
      localStorage.getItem("userSession"),
      "MySecretKey"
    );

    id = JSON.parse(id.toString(cryptojs.enc.Utf8));
    console.log(id);
  }*/
  let paramId = useParams();

  const [friend, setAlreadyFriend] = useState(false);
  const [request, setRequest] = useState(false);
  const [id, setId] = useState("");
  const [visitedsent, setVisitedSent] = useState(false);
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

    if (localStorage.length !== 0) {
      console.log("here");
      checkSession();
      if (session) {
        fetchdata();
        fetchRequestData();
        setLoading(false);
      }
      //return;
    } else {
      console.log("here in the outer if");
      setLoading(false);
      setSession(false);
    }
  }, [session]);

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
      `http://localhost:3000/userprofile/${paramId.id}`
    );
    console.log(resp.data.data.d);
    if (resp.data.data.res) {
      setAbout(resp.data.data.d);
      console.log(about);

      let frnds = resp.data.data.d.friends;
      setFndData(frnds);
      //setLoading(false);
      if (paramId.id != id) {
        for (let i = 0; i < frnds.length; i++) {
          if (frnds[i] == id) {
            setAlreadyFriend(true);
            break;
          }
        }
      }
    } else {
      console.log("user not found");
      //set state for user profile not found
      setErr(true);
    }
  }
  async function fetchRequestData() {
    console.log(id);

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
      .post(`http://localhost:3000/friend/searchrequest`, {
        loggedIn: id,
        Visited: paramId.id,
      })
      .then(function (response) {
        console.log(response.data.data);
        let res = response.data.data;
        if (response.data.requestSent === 200) {
          if (res != null) {
            //setRequest(true);
            if (res.sender == id) {
              setRequest(true);
            } else if (res.receiver == id) {
              setVisitedSent(true);
            }
          } else {
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        setRequest(false);
        alert("There was some error please try again");
      });
  }
  async function sendRequest() {
    if (paramId.id != id) {
      await instance
        .post(`http://localhost:3000/friend/sendRequest`, {
          sender: id,
          receiver: paramId.id,
        })
        .then(function (response) {
          console.log(response.data);
          if (response.data.requestSent === 200) {
            setRequest(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          setRequest(false);
          alert("There was some error please try again");
        });
    }
  }

  async function cancelRequest() {
    if (paramId.id != id) {
      await instance
        .post(`http://localhost:3000/friend/cancelRequest`, {
          sender: id,
          receiver: paramId.id,
        })
        .then(function (response) {
          console.log(response);
          if (response.data.status) {
            setRequest(false);
          } else {
            alert("Cannot Cancel Request: Error Occurred");
          }
        })
        .catch(function (error) {
          console.log(error);
          alert("Cannot Cancel Request: Error Occurred");
        });
    }
  }

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
      if (err) {
        return (
          <div>
            <Navigation></Navigation>
            <h1>No user found</h1>
          </div>
        );
      } else {
        console.log(id);
        console.log(paramId.id);
        let imgpath = `../../../server/uploads/${about.profileImage}`;
        return (
          <>
            <Navigation></Navigation>
            {/* // ---------- Start of User Profile Section ---------- //  */}
            <section className="user-profile-section">
              <div className="user-profile-box">
                {about.profileImage ? (
                  <img
                    // src={require("../public/uploads/" + about.profileImage}
                    src={require("/public/uploads/" + about.profileImage)}
                    className="user-profile-pic"
                    alt="User Profile Pic"
                  />
                ) : about.gender == "male" ? (
                  <img
                    src={maleUser}
                    className="user-profile-pic"
                    alt="User Profile Pic"
                  />
                ) : about.gender == "female" ? (
                  <img
                    src={femaleUser}
                    className="user-profile-pic"
                    alt="User Profile Pic"
                  />
                ) : about.gender == "other" ? (
                  <img
                    src={otherUser}
                    className="user-profile-pic"
                    alt="User Profile Pic"
                  />
                ) : (
                  <img
                    src={otherUser}
                    className="user-profile-pic"
                    alt="User Profile Pic"
                  />
                )}
              </div>
              <div>
                {id && id == paramId.id ? null : friend ? (
                  <Button variant="primary">Friends</Button>
                ) : request ? (
                  <Button variant="primary" onClick={cancelRequest}>
                    Request Sent
                  </Button>
                ) : visitedsent ? (
                  <Button variant="primary" disabled>
                    Request Received
                  </Button>
                ) : (
                  <Button variant="primary" onClick={sendRequest}>
                    Add Friend
                  </Button>
                )}
              </div>
            </section>
            {/* // ---------- End of User Profile Section ---------- //  */}

            {/* // ---------- Start of User profiel Tabs Section ---------- //  */}

            <section className="user-profiel-tabs-section">
              <ul
                className="nav nav-tabs justify-content-center"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link w-100 active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    About
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link w-100"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#profile"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    Friends
                  </button>
                </li>
                {paramId.id == id ? (
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link w-100"
                      id="contact-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#contact"
                      type="button"
                      role="tab"
                      aria-controls="contact"
                      aria-selected="false"
                    >
                      Edit Profile
                    </button>
                  </li>
                ) : null}
              </ul>
              <div
                className="tab-content border border-top-0"
                id="myTabContent"
              >
                <div
                  className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <About n={about}></About>
                </div>
                <div
                  className="tab-pane fade pt-4 friends-tab"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <div className="container">
                    <div className="row">
                      {fndData.length > 0 ? (
                        fndData.map((d, index) => {
                          return (
                            <Friends
                              key={index}
                              fid={d}
                              userId={id}
                              param={paramId.id}
                            ></Friends>
                          );
                        })
                      ) : (
                        <h3>No Friends</h3>
                      )}
                    </div>
                  </div>
                </div>
                <EditProfile about={about}></EditProfile>
              </div>
            </section>

            {/* // ---------- End of User profiel Tabs Section ---------- //  */}
          </>
        );
      }
    }
  }
};

export default Userprofile;
