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

// TODO : Pour l'upload d'images
const multer = require("multer");
const upload = multer();

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

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

// to use Morgan in tiny version
app.use(morgan("tiny"));

// SOCKET.IO

const activeSockets = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  activeSockets.push(socket.id);
  socket.emit("user connected", activeSockets);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
    const index = activeSockets.indexOf(socket.id);
    if (index !== -1) {
      activeSockets.splice(index, 1);
      socket.emit("user disconnected", activeSockets);
    }
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
});

// Router

router.router(app);

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { socketIO };
