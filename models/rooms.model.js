const mongoose = require("mongoose");
const Users = require("./users.model");

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: Users,
  },

  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
