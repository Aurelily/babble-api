const mongoose = require("mongoose");
const Users = require("./users.model");
const Rooms = require("./rooms.model");

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
    required: true,
    default: Date.now(),
  },
});

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
