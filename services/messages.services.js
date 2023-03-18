const Message = require("../models/messages.model");

exports.createMessage = async function (message) {
  try {
    return await Message.create(message);
  } catch (e) {
    // Log Errors
    throw Error("Error while creating message: " + e);
  }
};

exports.getMessages = async function (query, page, limit) {
  try {
    return await Message.find(query)
      .select("id_room content id_author datePublished")
      .populate("id_author")
      .limit(limit)
      .skip(limit * page);
  } catch (e) {
    // Log Errors
    console.log(e);
    throw Error("Error while Paginating messages");
  }
};

exports.getMessagesByRoomId = async function (param) {
  try {
    return await Message.find({ id_room: param })
      .select("content id_author datePublished")
      .populate("id_author");
  } catch (e) {
    // Log Errors
    throw Error("Error while getting messages for this room");
  }
};

exports.getMessage = async function (query) {
  try {
    return await Message.findOne({ _id: query })
      .select("id_room content id_author datePublished")
      .populate("id_author");
  } catch (e) {
    // Log Errors
    throw Error("Error while getting user");
  }
};

exports.deleteMessage = async function (param) {
  try {
    return await Message.findByIdAndDelete({ _id: param });
  } catch (e) {
    // Log Errors
    throw Error(e);
  }
};

exports.updateMessage = async function (query, body) {
  try {
    return await Message.findOneAndUpdate({ _id: query }, body, { new: true });
  } catch (e) {
    // Log Errors
    throw Error("Error while updating user");
  }
};
