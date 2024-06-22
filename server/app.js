const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");

const configRoutes = require("./routes");

//app.use(cors);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/session", async (req, res, next) => {
  console.log(req.session.cookie);
  console.log(req.session.user);
  if (!req.session.user) {
    res.status(404).json({ error: "error" });
    return;
  }
  next();
});

app.get("/logout", async (req, res, next) => {
  //console.log(Window.localStorage);
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.patch("/updateprofile", async (req, res, next) => {
  console.log(req.session.user);
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.post("/login", async (req, res, next) => {
  if (req.session.user) {
    res.status(403).json({ user: "User is already logged in" });
  } else {
    next();
  }
});

app.post("/signup", async (req, res, next) => {
  if (req.session.user) {
    res.status(403).json({ user: "User is already logged in" });
  } else {
    next();
  }
});

app.get("/getUserData", async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.get("/getallusers", async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.get("/getImage", async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.use("/posts", async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.use("/comments", async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.use("/conversation", async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.use("/friend", async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

app.use("/message", async (req, res, next) => {
  if (!req.session.user) {
    res.status(403).json({ user: "User is not logged in" });
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
