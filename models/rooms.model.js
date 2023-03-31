const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const Users = require("./users.model");

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    autopopulate: true,
  },

  dateCreation: {
    type: Date,
    default: Date.now,
  },
  private: {
    type: Boolean,
    default: false,
  },
  signal: {
    type: Number,
    default: 0,
  },
});

roomSchema.plugin(autopopulate);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
