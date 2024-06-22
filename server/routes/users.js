const express = require("express");
const router = express.Router();
const data = require("../data");
const errorhandle = data.errorhandlers;
const Cryptr = require("cryptr");
const cryptr = new Cryptr("MySecretKey");
const bcrypt = require("bcryptjs");
var cryptojs = require("crypto-js");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, uploadUserFile, getFileStream } = require("../helpers/s3");
const saltRounds = 16;
const usersData = data.users;
const path = require("path");
const im = require("imagemagick");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload1 = multer({
  storage: storage,
});
function signUpCheck(
  firstName,
  lastName,
  email,
  password,
  dateOfBirth,
  gender,
  interestedIn,
  relationshipStatus
) {
  const genders = ["male", "female", "others", "nodisclosure"];

  const relationship = ["married", "single", "inarelation", "nodisclosure"];

  if (!firstName) {
    //firstName check
    throw "please enter firstName";
  } else if (firstName) {
    if (!isString(firstName)) {
      throw "Enter firstName as string";
    } else if (check_for_spaces(firstName)) {
      throw "Enter firstName without spaces";
    } else if (/^([a-zA-Z]{2,})*$/.test(firstName) == false) {
      throw "firstName should be at least two characters without spaces";
    }
  }

  if (!lastName) {
    //lastName check
    throw "please enter lastName";
  } else if (lastName) {
    if (!isString(lastName)) {
      throw "Enter lastName as string";
    } else if (check_for_spaces(lastName)) {
      throw "Enter lastName without spaces";
    } else if (/^([a-zA-Z]{2,})*$/.test(lastName) == false) {
      throw "lastName should be at least two characters without spaces";
    }
  }

  if (!password) {
    //password check
    throw "please enter password";
  } else if (password) {
    if (!isString(password)) {
      throw "Enter password as string";
    } else if (check_for_spaces(password)) {
      throw "Enter password without spaces";
    } else if (
      /^([a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]{6,})*$/.test(password) ==
      false
    ) {
      throw "password should be at least six characters without spaces";
    }
  }

  if (!email) {
    //email check
    throw "please enter email";
  } else if (email) {
    if (!isString(email)) {
      throw "Enter email as string";
    } else if (check_for_spaces(email)) {
      throw "Enter email without spaces";
    } else if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email.toLowerCase()
      ) == false
    ) {
      throw "Email is in wrong format, please check";
    }
  }

  if (!dateOfBirth) {
    //dateOfBirth check
    throw "please enter dateOfBirth";
  } else if (dateOfBirth) {
    if (!isString(dateOfBirth)) {
      throw "Enter dateOfBirth as string";
    } else if (check_for_spaces(dateOfBirth)) {
      throw "Enter dateOfBirth without spaces";
    } else if (!isDate(dateOfBirth)) {
      throw "Please enter a correct DOB in the format mm/dd/yyyy";
    }

    let age = dateOfBirthCheck(dateOfBirth);

    if (!(age > 13 && age < 120)) {
      throw "Sorry your age is not appropriate";
    }
  }

  if (!gender) {
    //gender check
    throw "please enter gender";
  } else if (gender) {
    if (!isString(gender)) {
      throw "Enter gender as string";
    } else if (check_for_spaces(gender)) {
      throw "Enter gender without spaces";
    } else if (!genders.includes(gender)) {
      throw "Please enter a valid gender male, female , others, nodisclosure";
    }
  }

  if (interestedIn) {
    //interestedIn check
    if (!isString(interestedIn)) {
      throw "Enter interestedIn as string";
    } else if (check_for_spaces(interestedIn)) {
      throw "Enter interestedIn without spaces";
    }
  }

  if (relationshipStatus) {
    //relationshipStatus check
    if (!isString(relationshipStatus)) {
      throw "Enter relationshipStatus as string";
    } else if (check_for_spaces(relationshipStatus)) {
      throw "Enter relationshipStatus without spaces";
    } else if (!relationship.includes(relationshipStatus)) {
      throw "Please enter a valid relationshipStatus married, single, inarelation, nodisclosure";
    }
  }
}

function loginCheck(email, password) {
  if (!email) {
    //email check
    throw "please enter email";
  } else if (email) {
    if (!isString(email)) {
      throw "Enter email as string";
    } else if (check_for_spaces(email)) {
      throw "Enter email without spaces";
    } else if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email.toLowerCase()
      ) == false
    ) {
      throw "Email is in wrong format, please check";
    }
  }

  if (!password) {
    //password check
    throw "please enter password";
  } else if (password) {
    if (!isString(password)) {
      throw "Enter password as string";
    } else if (check_for_spaces(password)) {
      throw "Enter password without spaces";
    } else if (
      /^([a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]{6,})*$/.test(password) ==
      false
    ) {
      throw "password should be at least six characters";
    }
  }
}

function updateProfileCheck(
  firstName,
  lastName,
  email,
  password,
  gender,
  interestedIn,
  relationshipStatus
) {
  const genders = ["male", "female", "others", "nodisclosure"];

  const relationship = ["married", "single", "inarelation", "nodisclosure"];

  if (firstName) {
    if (!isString(firstName)) {
      throw "Enter firstName as string";
    } else if (check_for_spaces(firstName)) {
      throw "Enter firstName without spaces";
    } else if (/^([a-zA-Z]{2,})*$/.test(firstName) == false) {
      throw "firstName should be at least two characters without spaces";
    }
  }

  if (lastName) {
    if (!isString(lastName)) {
      throw "Enter lastName as string";
    } else if (check_for_spaces(lastName)) {
      throw "Enter lastName without spaces";
    } else if (/^([a-zA-Z]{2,})*$/.test(lastName) == false) {
      throw "lastName should be at least two characters without spaces";
    }
  }

  if (email) {
    if (!isString(email)) {
      throw "Enter email as string";
    } else if (check_for_spaces(email)) {
      throw "Enter email without spaces";
    } else if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email.toLowerCase()
      ) == false
    ) {
      throw "Email is in wrong format, please check";
    }
  }

  if (password) {
    if (!isString(password)) {
      throw "Enter password as string";
    } else if (check_for_spaces(password)) {
      throw "Enter password without spaces";
    } else if (
      /^([a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]{6,})*$/.test(password) ==
      false
    ) {
      throw "password should be at least six characters without spaces";
    }
  }

  /* if (dateOfBirth) {
    if (!isString(dateOfBirth)) {
      throw "Enter dateOfBirth as string";
    } else if (check_for_spaces(dateOfBirth)) {
      throw "Enter dateOfBirth without spaces";
    } else if (!isDate(dateOfBirth)) {
      throw "Please enter a correct DOB in the format mm/dd/yyyy";
    }

    let age = dateOfBirthCheck(dateOfBirth);

    if (!(age > 13 && age < 120)) {
      throw "Sorry your age is not appropriate";
    }
  } */

  if (gender) {
    if (!isString(gender)) {
      throw "Enter gender as string";
    } else if (check_for_spaces(gender)) {
      throw "Enter gender without spaces";
    } else if (!genders.includes(gender)) {
      throw "Please enter a valid gender male, female , others, nodisclosure";
    }
  }

  if (interestedIn) {
    //interestedIn check
    if (!isString(interestedIn)) {
      throw "Enter interestedIn as string";
    } else if (check_for_spaces(interestedIn)) {
      throw "Enter interestedIn without spaces";
    }
  }

  if (relationshipStatus) {
    //relationshipStatus check
    if (!isString(relationshipStatus)) {
      throw "Enter relationshipStatus as string";
    } else if (check_for_spaces(relationshipStatus)) {
      throw "Enter relationshipStatus without spaces";
    } else if (!relationship.includes(relationshipStatus)) {
      throw "Please enter a valid relationshipStatus married, single, inarelation, nodisclosure";
    }
  }
}

function dateOfBirthCheck(dateOfBirth) {
  var dob = new Date(dateOfBirth);
  //calculate month difference from current date in time
  var month_diff = Date.now() - dob.getTime();

  //convert the calculated difference in date format
  var age_dt = new Date(month_diff);

  //extract year from date
  var year = age_dt.getUTCFullYear();

  //now calculate the age of the user
  var age = Math.abs(year - 1970);

  return age;
}

function isDate(ExpiryDate) {
  var objDate, mSeconds, day, month, year;
  if (ExpiryDate.length !== 10) {
    return false;
  }
  if (
    ExpiryDate.substring(2, 3) !== "/" ||
    ExpiryDate.substring(5, 6) !== "/"
  ) {
    return false;
  }
  month = ExpiryDate.substring(0, 2) - 1;
  day = ExpiryDate.substring(3, 5) - 0;
  year = ExpiryDate.substring(6, 10) - 0;

  if (year < 1000 || year > 3000) {
    return false;
  }

  let currentYear = new Date().getFullYear();
  if (year > currentYear) {
    throw "Invalid year";
  }

  mSeconds = new Date(year, month, day).getTime();
  objDate = new Date();
  objDate.setTime(mSeconds);

  if (
    objDate.getFullYear() !== year ||
    objDate.getMonth() !== month ||
    objDate.getDate() !== day
  ) {
    return false;
  }

  return true;
}

function isString(x) {
  //common code for strings
  return Object.prototype.toString.call(x) === "[object String]";
}

router.get("/session", async (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(404).json({ error: "not logged in" });
  }
});
router.post("/signup", upload1.single("file"), async (req, res) => {
  console.log(req.file);

  let imagePath = "";
  let coverPath;
  let profile;
  let cover;

  let img = [];
  //console.log(req.file);
  /*req.files.map((f)=>{
    console.log(f);
})*/

  try {
    signUpCheck(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      req.body.dateOfBirth,
      req.body.gender,
      req.body.interestedIn,
      req.body.relationshipStatus
    );
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  try {
    if (errorhandle.checkImage(req.file)) {
      errorhandle.checkProperImage(req.file);
      console.log("before func");
      const result = await uploadUserFile(req.file);
      console.log("after func");
      console.log(result + " route");
      // await unlinkFile(req.file.path);
      imagePath = `${req.file.filename}`;
    }
  } catch (e) {
    console.log("image ka" + e);
    res.status(500).json({ error: "Something wrong with the image" });
    return;
  }
  /*
try{
    const result = await uploadFile(img[1]);
    await unlinkFile(img[1].path);
    console.log(result);
    coverPath = `/cover/${result.Key}`;
}catch(e){
    res.status(500).json({error:"Something wrong with the image"}) ;
    return;
}
*/
  try {
    // const result = await uploadFile(req.file);
    //await unlinkFile(req.file.path);
    //console.log(result);
    //imagePath = `/users/images/${result.Key}`;
    //console.log(imagePath);
    //console.log("here");
    let user = await usersData.signUp(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      req.body.dateOfBirth,
      req.body.gender,
      req.body.interestedIn,
      req.body.relationshipStatus,
      imagePath
    );

    res.json({ signup: "Successful" }).status(200);
  } catch (e) {
    console.log("data ka error");
    if (e == "email already exists") res.status(400).json({ error: e });
    else res.status(500).json({ error: "Some issue with the server" });
  }
});

router.get("/images/:key", (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

router.get("/cover/:key", (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
    loginCheck(email, password);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  try {
    const login = await usersData.login(req.body.email, req.body.password);
    console.log("here");

    let name = login.firstName + " " + login.lastName;
    let id = login._id;
    const nameHash = cryptojs.AES.encrypt(
      JSON.stringify(name),
      "MySecretKey"
    ).toString();
    const idHash = cryptojs.AES.encrypt(
      JSON.stringify(id),
      "MySecretKey"
    ).toString();
    req.session.user = { name: nameHash, _id: idHash, id: login._id };
    console.log(nameHash);
    res.status(200).json({ name: nameHash, _id: idHash });
  } catch (e) {
    if (e == "Either the username or password is invalid")
      res.status(403).json({ error: e });
    else res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/logout", async (req, res) => {
  if (req.session.user) {
    try {
      usersData.logout(req.session.user.id);

      res.clearCookie("AuthCookie").status(200).json({ user: "logged out" });

      req.session.destroy();
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.patch("/updateprofile", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    gender,
    interestedIn,
    relationshipStatus,
  } = req.body;

  try {
    if (Object.keys(req.body).length == 0) {
      throw "Please enter data to be changed";
    }

    updateProfileCheck(
      firstName,
      lastName,
      email,
      password,
      gender,
      interestedIn,
      relationshipStatus
    );
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  try {
    await usersData.updateProfile(
      req.session.user.id,
      firstName,
      lastName,
      email,
      password,
      gender,
      interestedIn,
      relationshipStatus
    );

    res.json({ updateprofile: "Successful" }).status(200);
  } catch (e) {
    if (e) {
      res.status(400).json({ error: e });

      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getUserData", async (req, res) => {
  try {
    /* let bytes = cryptojs.AES.decrypt(req.session.user._id, 'MySecretKey');

            let decid = JSON.parse(bytes.toString(cryptojs.enc.Utf8)) */ let userData =
      await usersData.getUserData(req.session.user.id);

    res.status(200).json(userData);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
///this is the conflict part now..............................

function check_for_spaces(string) {
  //common code for strings
  string = string.trim();
  if (string.length > 0) {
    return false;
  } else {
    return true;
  }
}

router.get("/userprofile/:Id", async (req, res) => {
  try {
    console.log("dsds");
    let userId = req.params.Id;
    console.log(userId);
    let datas = await usersData.getUserById(userId);

    res.status(200).json({ status: true, data: datas });
  } catch (error) {
    res.status(500).json({ status: false });
  }
});

router.post("/userprofile/sendRequest", async (req, res) => {
  try {
    let loginUserId = req.body.userId;
    let sentReqTo = red.body.sendUserId;
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/getallusers/:search", async (req, res) => {
  try {
    console.log("reached in routes");
    let search = req.params.search;
    console.log(search);
    let serdata = await usersData.searchData(search);
    res.status(200).json({ status: true, data: serdata });
  } catch (error) {
    res.status(500).json({ status: false });
  }
});

router.get("/getImage/:id", async (req, res) => {
  console.log(req.params.id);
  let user = await usersData.getUserById(req.params.id);
  console.log(user);
  if (user) {
    if (user.d.profileImage != "") {
      res.status(200).json({ profileImage: user.d.profileImage });
    }
  } else {
    res.status(404).json({ error: "NoImage" });
  }
});

module.exports = router;
