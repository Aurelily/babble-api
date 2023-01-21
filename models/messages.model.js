const mongoose = require("mongoose");
const Users = require("./users.model");

const messageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 240,
  },
  author: {
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
