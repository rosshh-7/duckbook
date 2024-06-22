const mongoCollections = require("../config/mongoCollections");
const postFunctions = require("./posts.js");
const posts = mongoCollections.posts;
const comments = mongoCollections.comments;
const errorhandle = require("./errorhandlers");
let { ObjectId } = require("mongodb");
const moment = require("moment");

module.exports = {
  async create(postId, userThatPostedComment, comment, dateOfCommment) {
    errorhandle.checkProperObject(
      userThatPostedComment,
      "user That Posted Comment"
    );
    errorhandle.checkProperString(userThatPostedComment.firstName, "firstName");
    const userID = errorhandle.checkAndGetID(userThatPostedComment._id, "ID");

    errorhandle.checkProperString(comment, "comment");

    let ID = errorhandle.checkAndGetID(postId);
    userThatPostedComment._id = userID;

    const post = await postFunctions.get(postId);
    if (!post) {
      throw "Error: No post with that id";
    }

    const commentCollection = await comments();
    let newComment = {
      userThatPostedComment: userThatPostedComment,
      postId: ID,
      comment: comment,
      dateOfCommment: moment().format("DD/MM/YYYY HH:mm:ss"),
    };

    const insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo.insertedCount === 0) throw "Could not create a Comment";

    const newId = insertInfo.insertedId.toString();

    const commentobj = await this.get(newId);
    await postFunctions.addCommentToPost(postId, newId, commentobj);

    return commentobj;
  },

  async getAll(postId) {
    errorhandle.checkProperString(postId, "Post ID");
    if (!ObjectId.isValid(postId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(postId);

    const post = await postFunctions.get(postId);
    const comments = post.comments;

    return comments;
  },

  async get(id) {
    errorhandle.checkProperString(id, "Comment ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    const commentCollection = await comments();

    const comment = await commentCollection.findOne({ _id: ID });
    if (comment === null) {
      throw "Error: No comment with that id";
    }
    comment._id = comment._id.toString();
    return comment;
  },

  async remove(id) {
    let ID = errorhandle.checkAndGetID(id, "Comment ID");

    const commentCollection = await comments();

    const postCollection = await posts();
    const pst = await postCollection.findOne({
      comments: { $elemMatch: { _id: ID } },
    });
    const pstID = pst._id.toString();

    const deletionInfo = await commentCollection.deleteOne({ _id: ID });
    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete comment with id of ${ID}`;
    }

    await postFunctions.removeCommentFromPost(pstID, ID);

    return { commentId: id, deleted: true };
  },
};
