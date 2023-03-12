const express = require("express");

const cors = require("cors");
const app = express();
//Cette ligne fait bénifier de CORS à toutes les requêtes de notre serveur
app.use(cors());
//Morgan est un logger pour tracer dans la console les requetes http
const morgan = require("morgan");
require("dotenv").config();

const multer = require("multer");
const upload = multer();

const router = require("./routes/routes");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true); // Supprime le warning de deprecation

// Connection a la base de donnée
require("./config/database");

// Config de base de express pour dire que l'on utilisera du JSON pour le passage et la récup de paramètres
// et pour encoder le contenu et bien gérer les accents
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

//Import pour fonctions
const roomController = require("./controllers/rooms.controller");

//http pour socket.io
const http = require("http").Server(app);

//👇🏻 SocketIO
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://" + process.env.SERVER_IP + ":3000",
  },
});

// pour utiliser Morgan
app.use(morgan("tiny"));

//👇🏻 SOCKET.IO

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });

  socket.on("create-room", (name) => {
    console.log(`Un nouveau salon de discussion a été créé : ${name}.`);
    //👇🏻 Returns the updated chat rooms via another event
    socket.emit("roomsList", () => {
      console.log("Back : Mise à jour de la liste de rooms");
    });
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
