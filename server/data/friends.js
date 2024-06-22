const mongoCollections = require("../config/mongoCollections");
const requests = mongoCollections.friendrequests;
const users = mongoCollections.users;
const conversa = mongoCollections.conversations;
let { ObjectId } = require("mongodb");
const e = require("express");

async function sendReq(sender, receiver) {
  try {
    if(!sender){
      throw "Please provide sender";
    }

    if(!receiver){
      throw "Please provide receiver";
    }

    let requestdata1 = {
      sender: sender,
      receiver: receiver,
      sent: true,
    };
    let requestdata2 = {
      sender: receiver,
      receiver: sender,
      sent: false,
    };

    let requestCollection = await requests();

    let reqData1 = await requestCollection.insertOne(requestdata1);

    if (reqData1.insertedCount === 0) {
      throw "500";
    } else {
      let reqData2 = await requestCollection.insertOne(requestdata2);
      if (reqData2.insertedCount === 0) {
        throw "500";
      }
    }
    return { request: true };
  } catch (e) {
    throw e;
  }
}
async function searchReq(logUser, visUser) {
  if(!logUser){
    throw "please provide data";
  }
  if(!logUser.trim().length === 0){
    throw "please provide data";
  }
  if(!visUser){
    throw "Please provide data";
  }
  if(!visUser.trim().length === 0){
    throw "please provide data";
  }
  let requestCollection = await requests();

  let searchdata1 = await requestCollection.findOne({
    sender: logUser,
    receiver: visUser,
    sent: true,
  });
  let searchdata2 = await requestCollection.findOne({
    sender: visUser,
    receiver: logUser,
    sent: true,
  });

  if (searchdata1 === null) {
    if (searchdata2 === null) {
      return { request: true, result: null };
    } else {
      console.log(searchdata2);
      return { request: true, result: searchdata2 };
    }
  } else {
    console.log(searchdata1);
    return { request: true, result: searchdata1 };
  }
}

async function canReq(sender, receiver) {
  if(!sender){
    throw "please provide data";
  }
  if(!sender.trim().length === 0){
    throw "please provide data";
  }
  if(!receiver){
    throw "Please provide data";
  }
  if(!receiver.trim().length === 0){
    throw "please provide data";
  }
  try {
    let requestCollection = await requests();
    const deletereq1 = await requestCollection.deleteOne({
      sender: sender,
      receiver: receiver,
    });
    if (deletereq1.deletedCount === 0) {
      return { status: false };
    } else {
      const deletereq2 = await requestCollection.deleteOne({
        sender: receiver,
        receiver: sender,
      });
      if (deletereq1.deletedCount === 0) {
        return { status: false };
      } else {
        return { status: true };
      }
    }
  } catch (e) {
    throw e;
  }
}

async function getfriendReqById(userId) {
  if (!userId.trim()) {
    throw "400";
  }

  let requestCollection = await requests();
  let searchdata1 = await requestCollection
    .find({
      receiver: userId,
      sent: true,
    })
    .toArray();
  if (searchdata1.length == 0) {
    return { status: false };
  } else {
    return { status: true, d: searchdata1 };
  }
}
async function addFriend(userId, senderId) {
  console.log(userId + "   userh");
  if (!userId.trim()) {
    throw "400";
  }
  if (!senderId.trim()) {
    throw "400";
  }
  let parsedId;
  try {
    parsedId = ObjectId(userId);
  } catch (e) {
    throw "400";
  }
  let parsedId1;
  try {
    parsedId1 = ObjectId(senderId);
  } catch (e) {
    throw "400";
  }
  let addconvo;
  const userData = await users();
  const conversationData = await conversa();
  let addfriend = await userData.updateOne(
    { _id: parsedId },
    { $push: { friends: { $each: [senderId] } } }
  );
  if (addfriend.modifiedCount === 0) {
    throw "500";
  } else {
    console.log("sec");
    let addfriend1 = await userData.updateOne(
      { _id: parsedId1 },
      { $push: { friends: { $each: [userId] } } }
    );

    if (addfriend1.modifiedCount === 0) {
      throw "500";
    }
    canReq(senderId, userId);

    // let data = await conversationData
    //   .find({ members: { $in: [userId, senderId] } })
    //   .toArray();

    let data = await conversationData.find({}).toArray();
    let flag = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].members[0] == userId || data[i].members[0] == senderId) {
        if (data[i].members[1] == userId || data[i].members[1] == senderId) {
          flag = true;
          break;
        }
      }
    }

    if (!flag) {
      addconvo = await conversationData.insertOne({
        members: [userId, senderId],
      });

      if (addconvo.insertedCount === 0) {
        throw "500";
      } else {
        return { status: true };
      }
    } else {
      return { status: true };
    }
  }
}

async function removefriend(userId, fid) {
  if (!userId.trim()) {
    throw "400";
  }
  if (!fid.trim()) {
    throw "400";
  }
  let parsedId;
  try {
    parsedId = ObjectId(userId);
  } catch (e) {
    throw e;
  }
  let parsedId1;
  try {
    parsedId1 = ObjectId(fid);
  } catch (e) {
    throw e;
  }
  console.log("2");
  const userData = await users();
  let remfriend = await userData.updateOne(
    { _id: parsedId },
    { $pull: { friends: { $in: [fid] } } }
  );
  console.log("3");
  if (remfriend.modifiedCount === 0) {
    throw "500";
  } else {
    let remfriend1 = await userData.updateOne(
      { _id: parsedId1 },
      { $pull: { friends: { $in: [userId] } } }
    );
    if (remfriend1.modifiedCount === 0) {
      throw "500";
    } else {
      return { status: true };
    }
  }
}
module.exports = {
  sendReq,
  searchReq,
  canReq,
  getfriendReqById,
  addFriend,
  removefriend,
};
