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
const EditProfile = (props) => {
    const [about , setAbout] = useState(undefined);
    let firstName;
  let lastName;
  let email;
  let pswd,password;
  let confirmPswd;
  let dob;
  let gender;
  let relationStatus;
  let interests,interestedIn;
  

return(
    <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                <Form className='signupForm' onSubmit={
                async (e)=>{
                    e.preventDefault();
                   
    
                    
                   let btn = document.getElementById("sub");
                  btn.disabled = false;
                   if(!firstName.value){
                       alert("Please enter first name");
                       btn.disabled = false;
                       return;
                   }
    
                   let regf = /^([a-zA-Z]{2,})*$/;
                   if(!regf.test(firstName.value)){
                        alert("Please enter valid first name");
                        btn.disabled = false;
                        return;
                   }
    
                   if(!lastName.value){
                       alert("Please enter last name");
                       btn.disabled = false;
                       return;
                   }
    
                   let regl = /^([a-zA-Z]{2,})*$/;
                   if(!regl.test(lastName.value)){
                        alert("Please enter valid first name");
                        btn.disabled = false;
                        return;
                   }
    
    
                   if(!email.value){
                       alert("Please enter email");
                       btn.disabled = false;
                       return;
                   }
    
                   //let regE = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
                   let regE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if(!regE.test(email.value.toLowerCase())){
                    alert("Please enter a valid email");
                    btn.disabled = false;
                    return;
                }
    
         
    
                   let regP = /^([a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]{6,})*$/
                if((pswd.value != '') && (!regP.test(pswd.value))){
                    alert("Password is invalid - should contain at least one digit,should contain at least one lower case, should contain at least one upper case, should contain at least 8 from the mentioned characters");
                    btn.disabled = false;
                    return;
                }
    
        
    
                   if(pswd.value !== confirmPswd.value){
                       alert("Passwords don't match");
                       btn.disabled = false;
                       return;
                   }
 
                   if(!gender.value){
                       alert("Please provide gender");
                       btn.disabled = false;
                       return;
                   }
                   const genders=["male","female","others","nodisclosure"];
    
                   if(!genders.includes(gender.value)){
                    alert("Please provide valid gender");
                    btn.disabled = false;
                    return;
                   }

                   if(!relationStatus.value){
                       alert("Please provide relationship status");
                       btn.disabled = false;
                       return;
                   }
                  
                    const relationship=["married", "single", "inarelation", "nodisclosure"]
                    console.log(relationStatus.value);
                    if(relationStatus.value){
                        console.log(relationStatus.value);
                        if(!relationship.includes(relationStatus.value)){
                            alert("Please provide valid relation status");
                            btn.disabled = false;
                            return;
                        }
                    }

                    if(interests.value.trim().length == 0){
                        interests.value = "Prefer not to disclose";
                    }

                    let relstat = "";

                    if(firstName.value == props.about.firstName){
                        firstName.value = "";
                    }
                    if(lastName.value == props.about.lastName){
                        lastName.value = "";
                    }
                    if(email.value == props.about.email){
                        email.value = "";
                    }
                    if(gender.value == props.about.gender){
                        gender.value = "";
                    }
                    console.log(relationStatus.value)
                    console.log(props.about)
                    if(relationStatus.value == props.about.relationshipStatus){
                       
                        relationStatus.value = "";
                    }
                    if(interests.value == props.about.interests){
                        interests.value = "";
                    }

    
                    let user = {
                        firstName: firstName.value,
                        lastName : lastName.value,
                        email: email.value,
                        password: pswd.value,
                        // dateOfBirth:props.about.dateOfBirth,
                        gender: gender.value,
                        relationshipStatus: relationStatus.value,
                        interestedIn : interests.value
                    }
                   // let temp = JSON.parse(user);
                   let flag = false;
                   let url = 'http:/localhost:3000/updateprofile'
                    console.log(user);
                    //let msg = await axios.post('http:/localhost:3000/signup', user);

                    const instance = axios.create({
                baseURL: '*',
                timeout: 20000,
                withCredentials: true,
              headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  "Access-Control-Allow-Origin": "*",
                },
              validateStatus: function (status) {
                  return status < 500; // Resolve only if the status code is less than 500
                }
            });
            setAbout([user]);
            console.log(user);

            await instance.patch(`http://localhost:3000/updateprofile`, user)
                      .then(function (response) {
                        console.log(response);
                        if(response.status === 200){
                            alert("Your profile is updated !!!");
                            flag = true;
                            window.location.reload();
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                        //setSuccess(false);
                        alert("There was some error please try again");
                       
                      });
                    
                      e.target.reset();
                      //btn.disabled = false;
                       if(flag){
                        
                        props.handleClose(false);
                       }            
                }
            }>
               
               <Row className="mb-4">
               <Form.Group as={Col}>
               <FloatingLabel
                controlId="firstName"
                label="First Name"
                className="mb-3"
                >
                    <Form.Control  type="text" placeholder="First Name" defaultValue={props.about.firstName}
                        className="textform"
                        ref={(node)=>{
                            firstName = node;
                        }}
                    />
                </FloatingLabel>
                </Form.Group>
                <Form.Group as={Col}>
                    <FloatingLabel
                        controlId="lastName"
                        label="Last Name"
                        className="mb-3"
                        
                    >
                    <Form.Control  type="text" placeholder="Last Name" defaultValue={props.about.lastName}
                        className="textform"
                        ref={(node)=>{
                            lastName = node;
                        }}
                    />
                    </FloatingLabel>
                </Form.Group>
                </Row>
    
                <Form.Group>
                    <FloatingLabel
                        controlId="email"
                        label="Email"
                        className="mb-3"
                       
                    >
                    <Form.Control  type="email" placeholder="name@example.com"
                        className="textform"  defaultValue={props.about.email}
                        ref={(node)=>{
                            email = node;
                        }}
                    />
                </FloatingLabel>
    
    
                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                    <Form.Control  type="password" placeholder="Password" 
                        className="textform"
                        ref={(node)=>{
                            pswd = node;
                        }}
                    />
                </FloatingLabel>
    
                <FloatingLabel controlId="floatingCPassword" label="Confirm Password" className="mb-3">
                    <Form.Control  type="password" placeholder="Confirm Password"
                        className="textform"
                        ref={(node)=>{
                            confirmPswd = node;
                        }}
                    />
                </FloatingLabel>
    
                {/* <FloatingLabel controlId="date" label="Date of Birth" className="mb-3" >
                    <Form.Control  type="date" placeholder="Date of Birth" disabled
                        
                        className="textform" defaultValue={about[0].dateOfBirth} 
                        ref={(node)=>{
                            dob = node;
                        }}
                    />
                </FloatingLabel> */}
    
    
                <Form.Label className="select" >
                Gender
                {props.about.gender && props.about.gender == "male" ?
                (<Form.Select  aria-label="Gender" size='lg'
                 className="textform"
                 ref={(node)=>{
                     gender = node;
                 }}>

            {/* {props.about.gender && props.about.gender == "male" ?  (<option value="male" selected>Male</option>) : props.about.gender == "female" ? (<option value="female" selected>Female</option>) : props.about.gender == "others" ? (<option value="others" selected>Others</option>) : (<option value="nodisclosure" selected>Prefer not to disclose</option>) } */}
                    
                    <option value="male" selected>Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                    <option value="nodisclosure">Prefer not to disclose</option>
                </Form.Select>):
                props.about.gender == "female" ?
                (<Form.Select  aria-label="Gender" size='lg'
                 className="textform"
                 ref={(node)=>{
                     gender = node;
                 }}>

            {/* {props.about.gender && props.about.gender == "male" ?  (<option value="male" selected>Male</option>) : props.about.gender == "female" ? (<option value="female" selected>Female</option>) : props.about.gender == "others" ? (<option value="others" selected>Others</option>) : (<option value="nodisclosure" selected>Prefer not to disclose</option>) } */}
                    
                    <option value="male">Male</option>
                    <option value="female" selected>Female</option>
                    <option value="others">Others</option>
                    <option value="nodisclosure">Prefer not to disclose</option>
                </Form.Select>):
                props.about.gender == "others" ?
                (<Form.Select  aria-label="Gender" size='lg'
                 className="textform"
                 ref={(node)=>{
                     gender = node;
                 }}>

            {/* {props.about.gender && props.about.gender == "male" ?  (<option value="male" selected>Male</option>) : props.about.gender == "female" ? (<option value="female" selected>Female</option>) : props.about.gender == "others" ? (<option value="others" selected>Others</option>) : (<option value="nodisclosure" selected>Prefer not to disclose</option>) } */}
                    
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others" selected>Others</option>
                    <option value="nodisclosure">Prefer not to disclose</option>
                </Form.Select>):
                (<Form.Select  aria-label="Gender" size='lg'
                 className="textform"
                 ref={(node)=>{
                     gender = node;
                 }}>

            {/* {props.about.gender && props.about.gender == "male" ?  (<option value="male" selected>Male</option>) : props.about.gender == "female" ? (<option value="female" selected>Female</option>) : props.about.gender == "others" ? (<option value="others" selected>Others</option>) : (<option value="nodisclosure" selected>Prefer not to disclose</option>) } */}
                    
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                    <option value="nodisclosure" selected>Prefer not to disclose</option>
                </Form.Select>)
                }
                </Form.Label>
    
                <Form.Label  className="select" >
                Relationship Status

                {props.about.relationshipStatus && props.about.relationshipStatus == "married" ? 
                (<Form.Select aria-label="relationship status"
                 className="textform" size='lg'
                 ref={(node)=>{
                     relationStatus = node;
                 }}>
                
                <option value="married" selected>Married</option>
                <option value="single">Single</option>
                <option value="inarelation">In a Relationship</option>
                <option value="nodisclosure">Prefer not to disclose</option>
                </Form.Select>):

                props.about.relationshipStatus == "single" ? 
                (<Form.Select aria-label="relationship status"
                 className="textform" size='lg'
                 ref={(node)=>{
                     relationStatus = node;
                 }}>
                
                <option value="married">Married</option>
                <option value="single" selected>Single</option>
                <option value="inarelation">In a Relationship</option>
                <option value="nodisclosure">Prefer not to disclose</option>
                </Form.Select>):

                props.about.relationshipStatus == "inarelation" ? 
                (<Form.Select aria-label="relationship status"
                 className="textform" size='lg'
                 ref={(node)=>{
                     relationStatus = node;
                 }}>
                
                <option value="married">Married</option>
                <option value="single">Single</option>
                <option value="inarelation" selected>In a Relationship</option>
                <option value="nodisclosure">Prefer not to disclose</option>
                </Form.Select>):

                (<Form.Select aria-label="relationship status"
                 className="textform" size='lg'
                 ref={(node)=>{
                     relationStatus = node;
                 }}>
                
                <option value="married">Married</option>
                <option value="single">Single</option>
                <option value="inarelation">In a Relationship</option>
                <option value="nodisclosure" selected>Prefer not to disclose</option>
                </Form.Select>)}

                </Form.Label>
    
    
                <FloatingLabel controlId="floatingtextarea" label="Interests" className="mb-3" >
                    <Form.Control as="textarea" rows={10} placeholder="Interests"
                    className="textarea" defaultValue={props.about.interestedIn}
                    ref={(node)=>{
                        interests = node;
                    }}
                />
                </FloatingLabel>
    
                </Form.Group>
                <Button id="sub" variant="primary" type="submit" className="submit">
    Submit
                </Button>
                </Form>
                </div>
);

}

export default EditProfile;