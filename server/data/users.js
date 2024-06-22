const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require("bcryptjs");
const saltRounds = 16;
//const crypto = require('crypto')
const redis = require("redis");
const client = redis.createClient();
const bluebird = require("bluebird");
const { use } = require("../routes/users");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let { ObjectId } = require("mongodb");

function signUpCheck(
  firstName,
  lastName,
  email,
  password,
  dateOfBirth,
  gender,
  interestedIn,
  relationshipStatus,
  imagePath
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
    } else if (/^([a-zA-Z0-9]{2,})*$/.test(firstName) == false) {
      throw "firstName should be at least two characters";
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
    } else if (/^([a-zA-Z0-9]{2,})*$/.test(lastName) == false) {
      throw "lastName should be at least two characters";
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
    console.log(gender);
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
      throw "Please enter a valid gender married, single, inarelation, nodisclosure";
    }
  }

  if (imagePath.length !== 0) {
    if (!isString(imagePath)) {
      throw "not a valid image path";
    } else if (check_for_spaces(imagePath)) {
      throw "not a valid imagepath";
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

  // if (dateOfBirth) {
  //   if (!isString(dateOfBirth)) {
  //     throw "Enter dateOfBirth as string";
  //   } else if (check_for_spaces(dateOfBirth)) {
  //     throw "Enter dateOfBirth without spaces";
  //   } else if (!isDate(dateOfBirth)) {
  //     throw "Please enter a correct DOB in the format mm/dd/yyyy";
  //   }

  //   let age = dateOfBirthCheck(dateOfBirth);

  //   if (!(age > 13 && age < 120)) {
  //     throw "Sorry your age is not appropriate";
  //   }
  // }

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
  if(year>currentYear)
  {
    throw "Invalid year"
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

function check_for_spaces(string) {
  //common code for strings
  string = string.trim();
  if (string.length > 0) {
    return false;
  } else {
    return true;
  }
}

async function getUser(id) {
  const userData = await users();
  const user = await userData.findOne({ _id: id });
  return user;
}

async function findUser(email) {
  const userCollection = await users();

  const userCollectionArray = await userCollection.find({}).toArray();

  for (let i = 0; i < userCollectionArray.length; i++) {
    if (email.toLowerCase() == userCollectionArray[i].email.toLowerCase()) {
      return userCollectionArray[i];
    }
  }

  return null;
}

async function signUp(
  firstName,
  lastName,
  email,
  password,
  dateOfBirth,
  gender,
  interestedIn,
  relationshipStatus,
  imagePath
) {
  console.log("in signup");
  signUpCheck(
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    gender,
    interestedIn,
    relationshipStatus,
    imagePath
  );

  const userinfo = await findUser(email);
  if (userinfo != null) {
    throw "email already exists";
  }

  const hash = await bcrypt.hash(password, saltRounds);

  let lowerEmail = email.toLowerCase();

  let userdata = {
    firstName,
    lastName,
    email: lowerEmail,
    password: hash,
    dateOfBirth,
    gender,
    friends: [],
    interestedIn,
    relationshipStatus,
    profileImage: imagePath.toString(),
  };

  let userCollection = await users();
  console.log("before insert");
  let userData = await userCollection.insertOne(userdata);

  let user_id = userData.insertedId;
  console.log("after insert");
  let user = await getUser(user_id);

  user._id = user._id.toString();

  return user;
}

function isString(x) {
  //common code for strings
  return Object.prototype.toString.call(x) === "[object String]";
}

async function login(email, password) {
  loginCheck(email, password);

  const userinfo = await findUser(email);

  if (userinfo == null) {
    throw "Either the username or password is invalid";
  }

  storedPassword = userinfo.password;

  let compare = await bcrypt.compare(password, storedPassword);

  userinfo._id = userinfo._id.toString();

  if (compare) {
    let userdata = {
      firstName: userinfo.firstName,
      lastName: userinfo.lastName,
      email: userinfo.email,
      dateOfBirth: userinfo.dateOfBirth,
      gender: userinfo.gender,
      interestedIn: userinfo.interestedIn,
      relationshipStatus: userinfo.relationshipStatus,
    };

    let stringUserData = JSON.stringify(userdata);

    await client.hsetAsync("userList", userinfo._id, stringUserData);

    return userinfo;
  } else {
    throw "Either the username or password is invalid";
  }
}

async function logout(id) {
  let { ObjectId } = require("mongodb");

  let parsedId = ObjectId(id);

  const userinfo = await getUser(parsedId);

  userinfo._id = userinfo._id.toString();

  await client.delAsync("userList");
}

async function updateProfile(
  id,
  firstName,
  lastName,
  email,
  password,
  gender,
  interestedIn,
  relationshipStatus
) {
  updateProfileCheck(
    firstName,
    lastName,
    email,
    password,
    gender,
    interestedIn,
    relationshipStatus
  );

  let update = await updateData(
    id,
    firstName,
    lastName,
    email,
    password,
    gender,
    interestedIn,
    relationshipStatus
  );

  const user = await users();

  let { ObjectId } = require("mongodb");

  let parsedId = ObjectId(id);

  await user.updateOne(
    { _id: parsedId },
    {
      $set: /* {
    
            "firstName": updateData.firstName,
            "lastName": updateData.lastName,
            "email": updateData.email,
            "dateOfBirth": updateData.dateOfBirth,
            "gender": updateData.gender,
            "interestedIn": updateData.interestedIn,
            "relationshipStatus": updateData.relationshipStatus
        } */ update,
    }
  );

  const userinfo = await getUser(parsedId);

  userinfo._id = userinfo._id.toString();

  let userdata = {
    firstName: userinfo.firstName,
    lastName: userinfo.lastName,
    email: userinfo.email,
    dateOfBirth: userinfo.dateOfBirth,
    gender: userinfo.gender,
    interestedIn: userinfo.interestedIn,
    relationshipStatus: userinfo.relationshipStatus,
  };

  await client.hsetAsync("userList", userinfo._id, JSON.stringify(userdata));
}

async function updateData(
  id,
  firstName,
  lastName,
  email,
  password,
  gender,
  interestedIn,
  relationshipStatus
) {
  let updateData = {};

  let { ObjectId } = require("mongodb");

  let parsedId = ObjectId(id);

  let object = await getUser(parsedId);

  if (firstName && firstName != object.firstName) {
    updateData.firstName = firstName;
  }
  else if (firstName && firstName == object.firstName)
  {
    throw "Please enter new first name"
  }

  if (lastName && lastName != object.lastName) {
    updateData.lastName = lastName;
  }
  else if (lastName && lastName == object.lastName)
  {
    throw "Please enter new last name"
  }

  if (email && email.toLowerCase() != object.email) {

    const userinfo = await findUser(email);

  if (userinfo != null) {
    throw "User already exists with this email";
  }

    updateData.email = email.toLowerCase();
  }

  else if (email && email.toLowerCase() == object.email)
  {
    throw "Please enter new email"
  }

  if (password) {
    storedPassword = object.password;

    let compare = await bcrypt.compare(password, storedPassword);

    if (!compare) {
      const hash = await bcrypt.hash(password, saltRounds);

      updateData.password = hash;
    }
    else{
      throw "Please enter new password"
    }
  }

  /* if (dateOfBirth && dateOfBirth != object.dateOfBirth) {
    updateData.dateOfBirth = dateOfBirth;
  }
  else if (dateOfBirth && dateOfBirth == object.dateOfBirth)
  {
    throw "Please enter different date of birth"
  } */
  if (gender && gender != object.gender) {
    updateData.gender = gender;
  }
  else if (gender && gender == object.gender)
  {
    throw "Please enter new gender"
  }

  if (interestedIn && interestedIn != object.interestedIn) {
    updateData.interestedIn = interestedIn;
  }
  else if (interestedIn && interestedIn == object.interestedIn)
  {
    throw "Please enter new interested in"
  }

  if (relationshipStatus && relationshipStatus != object.relationshipStatus) {
    updateData.relationshipStatus = relationshipStatus;
  }
  else if (relationshipStatus && relationshipStatus == object.relationshipStatus)
  {
    throw "Please enter new relationship status"
  }

  return updateData;
}

async function getUserData(id) {
  let cacheData = await client.hgetAsync("userList", id);

  cacheData = JSON.parse(cacheData);

  return cacheData;
}
async function getUserById(id) {
  let parsedId;
  try {
    parsedId = ObjectId(id);
  } catch (error) {
    console.log(error);
  }

  const userData = await users();
  let user = await userData.findOne({ _id: parsedId });
  console.log()
  if (user === null) {
    console.log("nnnnnnnnnnnnnnnoooooooooooo");
    return { res: false };
  } else {
    return { res: true, d: user };
  }
}

async function searchData(term) {
  console.log(term);
  const userCollection = await users();
  const findresult = await userCollection
    .find({
      firstName: { $regex: term, $options: "$i" },
    })
    .toArray();
  if (findresult.length == 0) {
    return findresult;
  } else {
    return findresult;
  }
}

module.exports = {
  signUp,
  login,
  logout,
  updateProfile,
  getUserData,
  getUserById,
  searchData,
};
