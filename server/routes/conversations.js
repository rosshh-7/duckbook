const express = require("express");
const router = express.Router();
const data = require("../data");
let { ObjectId } = require("mongodb");
const { convos } = require("../data");

router.get("/getconvo/:userId", async (req, res) => {
  let id = req.params.userId;
  if (req.session.user.id !== id.trim().toString()) {
    res.status(403).json("You cannot update this post");
    return;
  }
  let parsedId;
  try {
    if (!id.trim()) {
      throw "400";
    }
    parsedId = ObjectId(id);
  } catch (error) {
    if (error == 400) {
      res.status(400).json({ error: "missing id" });
    } else {
      res.status(400).json({ erroe: error });
    }
  }

  try {
    let convodata = await convos.getConvo(id);
    console.log(convodata.data);
    if (convodata.data.length != 0) {
      res.status(200).json({ data: convodata.data, result: true });
    } else {
      res.status(200).json({ result: false });
    }
  } catch (error) {
    res.status(500).json({ erroe: error });
  }
});

module.exports = router;
