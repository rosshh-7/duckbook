const mongoCollections = require("../config/mongoCollections");
const requests = mongoCollections.friendrequests;
const users = mongoCollections.users;
const conversa = mongoCollections.conversations;
const messages = mongoCollections.messages;
const cryptojs = require("crypto-js");

let { ObjectId } = require("mongodb");
const e = require("express");

async function addmessage(conversationId, sender, message) {
  if (!sender.trim()) {
    throw "400";
  }
  if (!message.trim()) {
    throw "400";
  }

  let messageCollection = await messages();
  message = cryptojs.AES.encrypt(
    JSON.stringify(message),
    "MySecretKey"
  ).toString();
  let newMessage = {
    conversationId: conversationId,
    senderId: sender,
    message: message,
    createdAt: new Date(),
  };
  let newmsg = await messageCollection.insertOne(newMessage);

  if (newmsg.insertedCount === 0) {
    throw "500";
  } else {
    return { newMessage };
  }
}
async function getmessage(convoID) {
  if (!convoID.trim()) {
    throw "ID not found";
  }
  convoID = convoID.trim();
  let messageCollection = await messages();
  let allmsg = await messageCollection
    .find({ conversationId: convoID })
    .toArray();

  return allmsg;
}
module.exports = {
  addmessage,
  getmessage,
};
