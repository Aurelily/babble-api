const express = require("express");
const cors = require("cors");
const app = express();

// Server
const http = require("http").Server(app);

// SocketIO
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://" + process.env.SERVER_IP + ":3000",
  },
});

module.exports = socketIO;

// This line benefits from "Cors" to all the requests of our server
app.use(cors());

// Morgan is a logger to trace the http requests in the console
const morgan = require("morgan");

// Environment variables
require("dotenv").config();

const router = require("./routes/routes");
const mongoose = require("mongoose");
// Removes the Deprecation warning
mongoose.set("strictQuery", true);

// Database connection
require("./config/database");

// Express basic config to say that we will use JSON for passage and parameter recovery
// ... and for encoding content and management of accents
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to use Morgan in tiny version
app.use(morgan("tiny"));

// Users online list
const userOnlineList = [];

// SOCKET.IO

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log(`⚡: ${socket.id} user just disconnected!`);
  });

  //:JOIN:Client Supplied Room
  socket.on("subscribe", function (room) {
    try {
      console.log([socket.id], "join room :", room);
      socket.join(room);
      socket.to(room).emit("user joined", socket.id);
    } catch (e) {
      console.log("[error]", "join room :", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });
  //:LEAVE:Client Supplied Room
  socket.on("unsubscribe", function (room) {
    try {
      console.log([socket.id], "leave room :", room);
      socket.leave(room);
      socket.to(room).emit("user left", socket.id);
    } catch (e) {
      console.log([socket.id], "leave room :", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });
  //:USER ID CONNECTED:
  socket.on("newUserConnected", function (userId) {
    try {
      console.log("l'id connecté est : " + userId);
      let userIndex = userOnlineList.indexOf(userId);
      if (userIndex === -1) {
        userOnlineList.push(userId);
      }
      console.log("API list users connect : " + userOnlineList);
      socket.emit("userOnlineList", userOnlineList);
    } catch (e) {
      console.log(e.message);
    }
  });
  //:USER ID LOGOUT:
  socket.on("userLogout", function (userId) {
    try {
      console.log("l'id logout est : " + userId);
      let userIndex = userOnlineList.indexOf(userId);
      if (userIndex !== -1) {
        userOnlineList.splice(userIndex, 1);
      }
      console.log("API list users connect : " + userOnlineList);
      socket.emit("userOnlineList", userOnlineList);
    } catch (e) {
      console.log(e.message);
    }
  });
});

// Router

router.router(app);

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { socketIO };
