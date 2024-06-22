const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

let users = [];

const addUser = (userId, socketId) => {
  console.log("dsds");
  if (userId) {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

//when connect
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("addUser", (userId) => {
    console.log(userId);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send msg nd get
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log(receiverId + "hello");
    const user = getUser(receiverId);
    console.log(user);
    //if (user) {
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      message,
      status: true,
    });
    // } else {
    //   io.emit("getMessage", {
    //     senderId,
    //     message,
    //     status: false,
    //   });
    // }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("discon");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
