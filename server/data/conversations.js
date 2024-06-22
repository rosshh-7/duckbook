const mongoCollections = require("../config/mongoCollections");
const requests = mongoCollections.friendrequests;
const users = mongoCollections.users;
const conversa = mongoCollections.conversations;
let { ObjectId } = require("mongodb");
const e = require("express");

async function getConvo(userId) {
  console.log(userId);
  if (!userId.trim()) {
    throw "missing ID";
  }
  let convoCollections = await conversa();

  let data = await convoCollections
    .find({ members: { $in: [userId] } })
    .toArray();
  console.log(data);
  return { data };
}
module.exports = {
  getConvo,
};
