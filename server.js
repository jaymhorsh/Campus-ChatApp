const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./Backend/models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const formatMessage = require("./Backend/utils/messages");
const config = require("./Backend/config");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./Backend/utils/users");

// Connecting to mongodb
mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to mongodb"); //startup your backend server to see the success case message if it successful or the error case message if it is not successful
  })
  .catch((error) => {
    console.log(error.message);
  });
// // login
const app = express();
app.use(bodyParser.json());
app.use(express.json());

// Set static folder
app.use("/", express.static(path.join(__dirname, "public")));

//Set ejs views
app.set("views", "./views");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/chat", (req, res) => {
  res.render("chat");
});

//Register and Login Api
// const authRoute = require("./routers/auth");
// app.use("/api/register", authRoute);
// app.use("/api/login", authRoute);
app.post("/api/register", async (req, res) => {
  const {
    firstName,
    lastName,
    matricNum,
    birthDate,
    deptValue,
    email,
    username,
    password: hashedPassword,
  } = req.body;

  let minPass = 6;
  let maxPass = 20;

  const password = await bcrypt.hash(hashedPassword, 10);

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }
  if (!matricNum || matricNum.toString().length !== 9) {
    return res.json({
      status: "error",
      error: "Invalid matric number. Must be equal to 9 digits",
    });
  }
  if (hashedPassword.length < minPass || hashedPassword.length > maxPass) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  // console.log("From the frontend",req.body)
  // console.log(password)
  try {
    const response = await User.create({
      firstName,
      lastName,
      matricNum,
      birthDate,
      deptValue,
      email,
      username,
      password,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Matric already exist" });
    }
    res.status(400).send(error);
    throw error.message;
  }
  res.json({ status: "ok" });
});
app.post("/api/login", async (req, res) => {
  const { username, deptValue, password } = req.body;
  const user = await User.findOne({ username }).lean();
  if (!user) {
    return res.json({ status: "error", error: "Username does not exist" });
  }
  if (
    user.deptValue === deptValue &&
    (await bcrypt.compare(password, user.password))
  ) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        deptValue: user.deptValue,
      },
      config.JWT_SECRET
    );
    return res.json({ status: "ok", data: token });
  }
  res.json({ status: "error", error: "Incorrect Department/Password " });
});

const server = http.createServer(app);
const io = socketio(server);

const botName = "Admin";
// Run when client connects
io.on("connection", (socket) => {
  console.log("new WS connection");
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit(
      "message",
      formatMessage(botName, `Welcome to ${room} Department `)
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen to chatMessage from main.js
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Emit message when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(3000, () => {
  console.log("serve at http://localhost:3000");
});
