const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    autopopulate: { select: "name", maxDepth: 1, cascade: true },
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 240,
  },
  id_author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: true,
  },
  datePublished: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.plugin(autopopulate);

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
