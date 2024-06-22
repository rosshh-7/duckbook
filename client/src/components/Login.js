import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {Form, FloatingLabel, Button, Row, Col}from 'react-bootstrap'
import '../App.css';
import Signup from "./Signup";
import axios from "axios";
import {ReactSession} from "react-client-session";
import { useNavigate } from "react-router-dom";

const Login = (props) => {

  ReactSession.setStoreType("localStorage");
    const [state, setState] = useState(undefined);

    const navigate = useNavigate();
    let loginEmail;
    let loginPswd; 

    return(
      
        <div className="log">
            <p className="display-6"><strong>Login Form</strong></p>
            <Form className='loginForm' onSubmit={
                async (e) =>{
                    let btn = document.getElementById("subb");
                    btn.disabled = true;
                e.preventDefault();
                console.log(loginEmail.value);
                console.log(loginPswd.value);

                if(!loginEmail.value){
                    alert("Please enter Email");
                    loginEmail.value = "";
                    loginPswd.value = "";
                    btn.disabled = false;
                    return;
                }

                if(!loginPswd.value){
                    alert("Please enter Password");
                    loginEmail.value = "";
                    loginPswd.value = "";
                    btn.disabled = false;
                    return;
                }

                let regE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                if(!regE.test(loginEmail.value.toLowerCase())){
                    alert("Either email or password are invalid");
                    loginEmail.value = "";
                    loginPswd.value = "";
                    btn.disabled = false;
                    return;
                }

                let regP = /^([a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]{6,})*$/
                if(!regP.test(loginPswd.value)){
                    alert("Either email or password are invalid");
                    loginEmail.value = "";
                    loginPswd.value = "";
                    btn.disabled = false;
                    return;
                }

                let user = {
                    email: loginEmail.value,
                    password: loginPswd.value
                }

              const instance = axios.create({
                  baseURL: '*',
                  timeout: 20000,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
               
                  },
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                  }
              });

              const { data } = await instance.post(`http://localhost:3000/login`,user);  
              console.log(data);
               
                if(!('error' in data)){
                    localStorage.setItem("user",data.name);
                   localStorage.setItem("userSession", data._id);
                   
                   btn.disabled = false;
                   navigate('/posts');
               }
               else{
                btn.disabled = false;
                alert(data.error);
               }
               
               e.target.reset();
               btn.disabled = false;
                 
            }}>
            
                <Form.Group>
                <FloatingLabel
    controlId="floatingInput"
    label="Email address"
    className="mb-3"
  >
    <Form.Control  type="email"
     className="textform" placeholder="name@example.com"
      ref={(node)=> {
          loginEmail = node;
      }} />
  </FloatingLabel>
  <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
    <Form.Control required type="password" className="textform" 
    placeholder="Password" ref={(node)=> {
        loginPswd = node;
    }} />
  </FloatingLabel>
                </Form.Group>
                <Button id="subb" variant="primary" type="submit" className="submit">
    Submit
                </Button>
            </Form>

        </div>

    
    );
}

export default Login;