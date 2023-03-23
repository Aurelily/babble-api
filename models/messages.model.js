const mongoose = require("mongoose");
const Users = require("./users.model");
const Rooms = require("./rooms.model");

const hour =
  new Date().getHours() < 10
    ? `0${new Date().getHours()}`
    : `${new Date().getHours()}`;

const mins =
  new Date().getMinutes() < 10
    ? `0${new Date().getMinutes()}`
    : `${new Date().getMinutes()}`;

const secs =
  new Date().getSeconds() < 10
    ? `0${new Date().getSeconds()}`
    : `${new Date().getSeconds()}`;

const messageSchema = mongoose.Schema({
  id_room: {
    type: mongoose.Types.ObjectId,
    ref: Rooms,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 240,
  },
  id_author: {
    type: mongoose.Types.ObjectId,
    ref: Users,
  },
  datePublished: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
