const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

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
  privateCode: {
    type: String,
    default: "",
  },
});

roomSchema.plugin(autopopulate);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
