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

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });

  /* socket.on("findRoom", (id) => {
    //👇🏻 Filters the array by the ID
    let result = chatRooms.filter((room) => room.id == id);
    console.log(result);
    //👇🏻 Sends the messages to the app
    if (result[0].messages) {
      socket.emit("foundRoom", result[0].messages);
      console.log("Messages Form", result[0].messages);
    } 
  }); */

  /*   socket.on("newMessage", (data) => {
    console.log("coucou3");
    //👇🏻 Destructures the property from the object
    const { room_id, message, user, timestamp } = data;

    //👇🏻 Finds the room where the message was sent
    let result = chatRooms.filter((room) => room.id == room_id);
    console.log(result);
    //👇🏻 Create the data structure for the message
    const newMessage = {
      id: generateID(),
      content: message,
      user,
      datePublished: `${timestamp.hour}:${timestamp.mins}`,
    };
    console.log("New Message", newMessage);
    //👇🏻 Updates the chatroom messages
    socket.to(result[0].name).emit("roomMessage", newMessage);
    result[0].messages.push(newMessage);

    //👇🏻 Trigger the events to reflect the new changes
    socket.emit("roomsList", chatRooms);
    socket.emit("foundRoom", result[0].messages);
  }); */
});

// Router

router.router(app);

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { socketIO };
