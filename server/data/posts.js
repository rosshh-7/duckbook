const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const comments = mongoCollections.comments;
const errorhandle = require("./errorhandlers.js");
let { ObjectId } = require("mongodb");
const moment = require("moment");

module.exports = {
  async create(title, body, userThatPosted, isPublic, imagePath) {
    errorhandle.checkProperString(imagePath, "ImagePath");
    errorhandle.checkProperString(title, "Title");
    errorhandle.checkProperString(body, "Body");
    errorhandle.checkProperObject(userThatPosted);
    errorhandle.checkProperString(userThatPosted.firstName, "User Name");
    errorhandle.checkProperBoolean(isPublic, "isPublic");

    let userID = errorhandle.checkAndGetID(userThatPosted._id);

    userThatPosted._id = userID;

    const postCollection = await posts();
    let newPost = {
      title: title,
      body: body,
      dateOfPost: moment().toISOString(),
      isPublic: isPublic,
      userThatPosted: userThatPosted,
      imagePath: imagePath,
      comments: [],
      likes: [],
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0) throw "Could not create a Post";

    const newId = insertInfo.insertedId.toString();
    const post = await this.get(newId);
    return post;
  },

  async get(id) {
    let ID = errorhandle.checkAndGetID(id, "Post ID");

    const postCollection = await posts();

    const post = await postCollection.findOne({ _id: ID });
    if (post === null) {
      throw "Error: No post with that id";
    }
    post._id = post._id.toString();
    post.dateOfPost = moment(post.dateOfPost).format("DD/MM/YYYY HH:mm:ss");
    return post;
  },
  async ISODATEget(id) {
    let ID = errorhandle.checkAndGetID(id, "Post ID");

    const postCollection = await posts();

    const post = await postCollection.findOne({ _id: ID });
    if (post === null) {
      throw "Error: No post with that id";
    }
    post._id = post._id.toString();
    // post.dateOfPost = moment(post.dateOfPost).format("DD/MM/YYYY HH:mm:ss");
    return post;
  },

  async getAll() {
    const postCollection = await posts();

    const postList = await postCollection
      .find({})
      .sort({ dateOfPost: -1 })
      .toArray();
    const pstList = [];
    postList.forEach((item) => {
      let obj = item;
      obj._id = item._id.toString();
      obj.dateOfPost = moment(obj.dateOfPost).format("DD/MM/YYYY HH:mm:ss");
      // obj.name = item.name;
      pstList.push(obj);
    });

    return pstList;
  },

  async remove(id) {
    errorhandle.checkProperString(id, "Post ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);

    const postCollection = await posts();

    const deletionInfo = await postCollection.deleteOne({ _id: ID });

    if (deletionInfo.deletedCount === 0) {
      throw `Error: Could not delete post with id of ${ID}`;
    }
    const commentCollection = await comments();
    const updatecInfo = await commentCollection.deleteMany({ postId: ID });
    if (!updatecInfo.deletedCount === 0)
      throw "Error: Update failed while removing comment from post";

    return { postId: id, deleted: true };
  },

  async update(id, title, body, isPublic) {
    errorhandle.checkProperString(id, "Post ID");
    if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(id);
    errorhandle.checkProperString(title, "Title");
    errorhandle.checkProperString(body, "Body");
    errorhandle.checkProperBoolean(isPublic, "isPublic");

    const post = await this.ISODATEget(id);

    let updatedPost = {
      title: title,
      body: body,
      isPublic: isPublic,
      userThatPosted: post.userThatPosted,
      comments: post.comments,
      dateOfPost: post.dateOfPost,
    };

    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne(
      { _id: ID },
      { $set: updatedPost }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    const postn = await this.get(id);

    return postn;
  },
  async addLikes(id, userID) {
    let ID = errorhandle.checkAndGetID(id, "Post ID");
    let uID = errorhandle.checkAndGetID(userID, "User ID");

    const post = await this.get(id);
    newLikes = post.likes;
    if (newLikes.includes(userID)) {
      let index = newLikes.indexOf(userID);
      if (index !== -1) {
        newLikes.splice(index, 1);
      }
    } else {
      newLikes.push(userID);
    }

    let updatedPost = {
      title: post.title,
      body: post.body,
      isPublic: post.isPublic,
      userThatPosted: post.userThatPosted,
      comments: post.comments,
      likes: newLikes,
      dateOfPost: post.dateOfPost,
    };

    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne(
      { _id: ID },
      { $set: updatedPost }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    const postn = await this.get(id);

    return postn;
  },

  async addCommentToPost(postId, commentId, commentobj) {
    if (!ObjectId.isValid(postId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(postId);

    if (!ObjectId.isValid(commentId)) throw "Error: Not a valid ObjectId";
    let commentID = ObjectId(commentId);

    // let currentPost = await this.get(postId);
    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne(
      { _id: ID },
      {
        $push: {
          comments: {
            _id: commentID,
            userThatPostedComment: commentobj.userThatPostedComment,
            comment: commentobj.comment,
            dateOfCommment: commentobj.dateOfCommment,
          },
        },
      }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed at adding comment to post";

    return await this.get(postId);
  },

  async removeCommentFromPost(postId, commentId) {
    if (!ObjectId.isValid(postId)) throw "Error: Not a valid ObjectId";
    let ID = ObjectId(postId);

    if (!ObjectId.isValid(commentId)) throw "Error: Not a valid ObjectId";
    let commentID = ObjectId(commentId);

    // let currentPost = await this.get(postId);

    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne(
      { _id: ID },
      { $pull: { comments: { _id: commentID } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Error: Update failed while removing comment from post";

    return await this.get(postId);
  },

  async memories(userID) {
    let USERID = errorhandle.checkAndGetID(userID, "Post ID");
    const postCollection = await posts();
    // console.log(USERID);
    //For last months post
    const monthList = await postCollection
      .find({
        "userThatPosted._id": USERID,
        dateOfPost: {
          $gt: moment().subtract(1, "month").startOf("month").toISOString(),

          $lte: moment().subtract(1, "month").endOf("month").toISOString(),
        },
      })
      .sort({ dateOfPost: -1 })
      .toArray();
    // console.log(monthList);
    const monList = [];
    monthList.forEach((item) => {
      let obj = item;
      obj._id = item._id.toString();
      obj.dateOfPost = moment(obj.dateOfPost).format("DD/MM/YYYY HH:mm:ss");
      // obj.name = item.name;
      monList.push(obj);
    });

    //for last weeks posts
    const weekList = await postCollection
      .find({
        "userThatPosted._id": USERID,
        dateOfPost: {
          $gt: moment().subtract(1, "week").startOf("week").toISOString(),
          $lte: moment().subtract(1, "week").endOf("week").toISOString(),
        },
      })
      .sort({ dateOfPost: -1 })
      .toArray();
    // console.log(weekList);
    const wekList = [];
    weekList.forEach((item) => {
      let obj = item;
      obj._id = item._id.toString();
      obj.dateOfPost = moment(obj.dateOfPost).format("DD/MM/YYYY HH:mm:ss");
      // obj.name = item.name;
      wekList.push(obj);
    });

    //For todays post

    const todayList = await postCollection
      .find({
        "userThatPosted._id": USERID,
        dateOfPost: {
          $gt: moment().startOf("day").toISOString(),

          $lte: moment().endOf("day").toISOString(),
        },
      })
      .sort({ dateOfPost: -1 })
      .toArray();
    // console.log(todayList);
    const todList = [];
    todayList.forEach((item) => {
      let obj = item;
      obj._id = item._id.toString();
      obj.dateOfPost = moment(obj.dateOfPost).format("DD/MM/YYYY HH:mm:ss");
      todList.push(obj);
    });
    console.log("In data");
    console.log({
      today: todList,
      week: wekList,
      month: monList,
    });
    return [
      {
        today: todList,
        week: wekList,
        month: monList,
      },
    ];
  },
};

// console.log(
//   typeof new Date() +
//     typeof new Date(moment().subtract(1, "week").startOf("week").format())
//   // moment().subtract(1, "week").endOf("week").format("DD/MM/YYYY HH:mm:ss")
// );
