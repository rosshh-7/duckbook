const usersData = require("./users");
const commentData = require("./comments");
const postData = require("./posts");
const errorhandlerData = require("./errorhandlers");
const friendData = require("./friends");
const convoData = require("./conversations");
const msgData = require("./messages");
module.exports = {
  posts: postData,
  errorhandlers: errorhandlerData,
  comments: commentData,
  users: usersData,
  friends: friendData,
  convos: convoData,
  message: msgData,
};
