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
const About = (props) => {
console.log(props);
    return (
        <div className="row">
                    <div className="col-md-5 offset-2 offset-md-1">
                        <div className="d-flex  pt-4 pb-4">
                            <div className="d-flex align-self-center">
                                <span className="material-icons-outlined about-box-img">email</span>
                            </div>
                            <div className="d-flex flex-column m-2">
                                <span className="about-heading">{props.n.email}</span>
                                <span className="about-subheading text-secondary">Email</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 offset-2 offset-md-1">
                        <div className="d-flex  pt-4 pb-4">
                            <div className="d-flex align-self-center">
                                <span className="material-icons-outlined about-box-img">cake</span>
                            </div>
                            <div className="d-flex flex-column m-2">
                                <span className="about-heading">{props.n.dateOfBirth}</span>
                                <span className="about-subheading text-secondary">Birthday</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 offset-2 offset-md-1">
                        <div className="d-flex  pt-4 pb-4">
                            <div className="d-flex align-self-center">
                                <span className="material-icons-outlined about-box-img">boy</span>
                                {/* <span className="material-icons-outlined about-box-img">girl</span> */}
                                {/* <span className="material-icons-outlined about-box-img">transgender</span> */}
                            </div>
                            <div className="d-flex flex-column m-2">
                                <span className="about-heading">{props.n.gender}</span>
                                <span className="about-subheading text-secondary">Gender</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 offset-2 offset-md-1">
                        <div className="d-flex  pt-4 pb-4">
                            <div className="d-flex align-self-center">
                                <span className="material-icons-outlined about-box-img">favorite</span>
                            </div>
                            <div className="d-flex flex-column m-2">
                                <span className="about-heading">{props.n.relationshipStatus}</span>
                                <span className="about-subheading text-secondary">Relationship Status</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 offset-2 offset-md-1">
                        <div className="pt-4 pb-4 d-flex align-self-center">
                            <div className="d-flex align-self-center">
                                <span className="material-icons-outlined about-box-img">interests</span>
                            </div>
                            <div className="d-flex flex-column m-2">
                                <span className="about-heading">{props.n.interestedIn}</span>
                                <span className="about-subheading text-secondary">Interests</span>
                            </div>
                        </div>
                    </div>
                </div>
    );

}
export default About;