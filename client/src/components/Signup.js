import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import { makeStyles, TextField, Button, Radio, RadioGroup } from '@material-ui/core';
//import { FormControlLabel, FormLabel } from "@material-ui/core";
import {
  Form,
  FloatingLabel,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import FormData from "form-data";
import "../App.css";
import axios from "axios";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    border: "1px solid #28547a",
    borderRadius: "4px",
    overflow: "scroll",
  },
};

const Signup = (props) => {
 
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState([]);

  const [showModal, setShowModal] = useState(props.isOpen);
  let firstName;
  let lastName;
  let email;
  let pswd;
  let confirmPswd;
  let dob;
  let gender;
  let relationStatus = "";
  let interests = "";

  const handleCloseModal = () => {
    setShowModal(true);
    props.handleClose(false);
  };

  const fileSelected1 = (e) => {
    const temp = e.target.files[0];

    setFile(temp);

  };

 
  let body = null;

  if (props.modal === "signup") {
    body = (
      <Form
        className="signupForm"
        onSubmit={async (e) => {
          e.preventDefault();
       
          let btn = document.getElementById("sub");
          btn.disabled = true;
          if (!firstName.value) {
            alert("Please enter first name");
            btn.disabled = false;
            return;
          }

          let regf = /^([a-zA-Z]{2,})*$/;
          if (!regf.test(firstName.value)) {
            alert("Please enter valid first name");
            btn.disabled = false;
            return;
          }

          if (!lastName.value) {
            alert("Please enter last name");
            btn.disabled = false;
            return;
          }

          let regl = /^([a-zA-Z]{2,})*$/;
          if (!regl.test(lastName.value)) {
            alert("Please enter valid first name");
            btn.disabled = false;
            return;
          }

          if (!email.value) {
            alert("Please enter email");
            btn.disabled = false;
            return;
          }

          //let regE = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
          let regE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (!regE.test(email.value.toLowerCase())) {
            alert("Please enter a valid email");
            btn.disabled = false;
            return;
          }

          if (!pswd.value) {
            alert("Please enter password");
            btn.disabled = false;
            return;
          }

          let regP = /^([a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]{6,})*$/;
          if (!regP.test(pswd.value)) {
            alert(
              "Password is invalid - should contain at least one digit,should contain at least one lower case, should contain at least one upper case, should contain at least 8 from the mentioned characters"
            );
            btn.disabled = false;
            return;
          }

          if (!confirmPswd.value) {
            alert("Please enter confirm password");
            btn.disabled = false;
            return;
          }

          if (pswd.value !== confirmPswd.value) {
            alert("Passwords don't match");
            btn.disabled = false;
            return;
          }

          if (!dob.value) {
            alert("Please provide your date of birth");
            btn.disabled = false;
            return;
          }

          if (dob.value) {
            let birth = new Date(dob.value);
            var month_diff = Date.now() - birth.getTime();

            let age_dt = new Date(month_diff);

            //extract year from date
            let year = age_dt.getUTCFullYear();
            let y = birth.getFullYear();
            let currentYear = new Date().getFullYear();
           
            if (y > currentYear) {
              alert("Invalid Year");
              dob.value = "";
              btn.disabled = false;
              return;
            }
            //now calculate the age of the user
            let age = Math.abs(year - 1970);
    

            if (!(age > 13 && age < 120)) {
              alert("Should be between age 13 and 120");
              dob.value = "";
              btn.disabled = false;
              return;
            }
          }
          let dateOfBirth = new Date(dob.value + " EST");

          dateOfBirth =
            String(dateOfBirth.getMonth() + 1).padStart(2, "0") +
            "/" +
            String(dateOfBirth.getDate()).padStart(2, "0") +
            "/" +
            dateOfBirth.getFullYear();

          if (!gender.value) {
            alert("Please provide gender");
            btn.disabled = false;
            return;
          }
          const genders = ["male", "female", "others", "nodisclosure"];

          if (!genders.includes(gender.value)) {
            alert("Please provide valid gender");
            btn.disabled = false;
            return;
          }
          
          const relationship = [
            "married",
            "single",
            "inarelation",
            "nodisclosure",
          ];
         
          if (relationStatus.value) {
            
            if (!relationship.includes(relationStatus.value)) {
              alert("Please provide valid relation status");
              btn.disabled = false;
              return;
            }
          }

        
          let user = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: pswd.value,
            dateOfBirth: dateOfBirth,
            gender: gender.value,
            relationshipStatus: relationStatus.value,
            interestedIn: interests.value,
          };
          let formData = new FormData();
          formData.append("firstName", firstName.value);
          formData.append("lastName", lastName.value);
          formData.append("email", email.value);
          formData.append("password", pswd.value);
          formData.append("dateOfBirth", dateOfBirth);
          formData.append("gender", gender.value);
          formData.append("relationshipStatus", relationStatus.value);
          formData.append("interestedIn", interests.value);
    

          formData.append("file", file);
          
          let flag = false;
          let url = "http:/localhost:3000/signup";
         
          const { data } = await axios.post(
            `http://localhost:3000/signup`,
            formData,
            {
              validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500
              },
              headers: {
                "Content-Type":
                  "multipart/form-data; boundary=${form._boundary}",
              },
            }
          );
          
          
          if (!("error" in data)) {
            alert("User registered");
            flag = true;
          } else {
            btn.disabled = false;
            alert(data.error);
          }
          e.target.reset();
          btn.disabled = false;
          if (flag) {
            setShowModal(true);
            props.handleClose(false);
          }
        }}
      >
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Default file input example</Form.Label>
          <Form.Control
            onChange={fileSelected1}
            name="file"
            type="file"
            accept="image/*"
          />
        </Form.Group>
        
        <Row className="mb-4">
          <Form.Group as={Col}>
            <FloatingLabel
              controlId="firstName"
              label="First Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="First Name"
                className="textform"
                ref={(node) => {
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
              <Form.Control
                required
                type="text"
                placeholder="Last Name"
                className="textform"
                ref={(node) => {
                  lastName = node;
                }}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Form.Group>
          <FloatingLabel controlId="email" label="Email" className="mb-3">
            <Form.Control
              required
              type="email"
              placeholder="name@example.com"
              className="textform"
              ref={(node) => {
                email = node;
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control
              required
              type="password"
              placeholder="Password"
              className="textform"
              ref={(node) => {
                pswd = node;
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingCPassword"
            label="Confirm Password"
            className="mb-3"
          >
            <Form.Control
              required
              type="password"
              placeholder="Confirm Password"
              className="textform"
              ref={(node) => {
                confirmPswd = node;
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="date"
            label="Date of Birth"
            className="mb-3"
          >
            <Form.Control
              required
              type="date"
              placeholder="Date of Birth"
              className="textform"
              ref={(node) => {
                dob = node;
              }}
            />
          </FloatingLabel>

          <Form.Label className="select">
            Gender
            <Form.Select
              required
              aria-label="Gender"
              size="lg"
              className="textform"
              ref={(node) => {
                gender = node;
              }}
            >
              <option></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
              <option value="nodisclosure">Prefer not to disclose</option>
            </Form.Select>
          </Form.Label>

          <Form.Label className="select">
            Relationship Status
            <Form.Select
              aria-label="relationship status"
              className="textform"
              size="lg"
              ref={(node) => {
                relationStatus = node;
              }}
            >
              <option></option>
              <option value="married">Married</option>
              <option value="single">Single</option>
              <option value="inarelation">In a Relationship</option>
              <option value="nodisclosure">Prefer not to disclose</option>
            </Form.Select>
          </Form.Label>

          <FloatingLabel
            controlId="floatingtextarea"
            label="Interests"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              rows={10}
              placeholder="Interests"
              className="textarea"
              ref={(node) => {
                interests = node;
              }}
            />
          </FloatingLabel>
        </Form.Group>
        <Button id="sub" variant="primary" type="submit" className="submit">
          Submit
        </Button>
      </Form>
    );
  }

  return (
    <div className="App-body pt-5 mt-5">
      <ReactModal
        name="signupModal"
        isOpen={showModal}
        contentLabel="Signup Modal"
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },
          content: {
            marginLeft: "400px",
            width: "500px",
            height: "410px",
            position: "relative",
            top: "30px",
            left: "30px",
            right: "30px",
            bottom: "30px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
      >
        <p className="display-6"><strong>Signup Form</strong></p>
        <Container>
          <Row>{body}</Row>
          <Row>
            <Button
              variant="danger"
              className="button cancel-button"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </Row>
        </Container>
      </ReactModal>
    </div>
  );
};

export default Signup;
