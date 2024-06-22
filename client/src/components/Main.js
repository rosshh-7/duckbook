import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
//import { makeStyles, TextField, Button, Radio, RadioGroup } from '@material-ui/core';
//import { FormControlLabel, FormLabel } from "@material-ui/core";
import {Form, FloatingLabel, Button, Row, Col}from 'react-bootstrap';
import logoImg from '../images/logo.gif';
import '../App.css';
import Signup from "./Signup";
import Login from "./Login";
import axios from 'axios';
import { ReactSession } from 'react-client-session';
import { useNavigate, Navigate } from "react-router-dom";
const Main = (props) =>{

    const [showModal , setShowModal] = useState(false);
    const [session , setSession] = useState(true);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function checkSession(){
            try{
                const instance = axios.create({
                   // baseURL: '*',
                    timeout: 20000,
                  withCredentials: true,
                  headers: {
                      'Content-Type': 'application/json',
                  
                    },
                  validateStatus: function (status) {
                      return status < 500; // Resolve only if the status code is less than 500
                    }
                });
    
                const { data } = await instance.get(`http://localhost:3000/session`);
                console.log(data);
                if('error' in data){
                    setSession(false);
                    setLoading(false);
                    return;
                }
                else{
                    console.log("here");
                    setSession(true);
                    setLoading(false);
                    return;
                }
            }
            catch(e){
                console.log(e);
            }
        }
    
        if(localStorage.length !== 0){
            checkSession();
            //return;
        }
        else{
            console.log("here in the outer if");
            setLoading(false);
            setSession(false);
        }
    
    },[]);
    
       
    const handleOpenModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

   
    
if(loading){
    return(
        <div>
            <span>Loading....</span>
        </div>
    );
}
else{
    if(session){
        return (
            <Navigate to="/posts" replace />
            );
    }
    else{
    return(
        <div className="FormContent">
            <img className="responsive-img frontImg logo-img" src={logoImg} alt="img" />
            <Login></Login>
            
            <Button  className='button signup-btn' onClick={handleOpenModal}>Signup</Button>

            {showModal && showModal && (
          <Signup
            isOpen={showModal}
            handleClose={handleCloseModal}
            modal='signup'
          />
        )}
        </div>
    );
            }
        }
}

export default Main;