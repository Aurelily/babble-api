const mongoose = require("mongoose");
const Users = require("./users.model");
const Messages = require("./messages.model");

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  messages: {
    type: String,
    required: true,
    trim: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
