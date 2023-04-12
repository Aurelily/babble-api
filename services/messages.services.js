const Message = require("../models/messages.model");

exports.createMessage = async function (message) {
  try {
    return await Message.create(message);
  } catch (e) {
    // Log Errors
    throw Error("Erreur à la création d'un message: " + e);
  }
};

exports.getMessages = async function (req, res, next) {
  // Validate request parameters, queries using express-validator
  const page = req.query.page ? req.query.page : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  const query = req.query.query;
  try {
    let messages = await Message.find(query)
      .select("id_room content id_author datePublished")
      .populate({
        path: "id_author",
        select: "firstname",
        model: "User",
      })
      .populate({
        path: "id_room",
        model: "Room",
      })
      .limit(limit)
      .skip(limit * page);
    return res.status(200).json({
      status: 200,
      data: messages,
      message: "Messages récéupérés avec succès.",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getMessagesByRoomId = async function (param) {
  try {
    return await Message.find({ id_room: param })
      .select("content id_author datePublished")
      .populate({
        path: "id_author",
        select: "firstname",
        model: "User",
      });
  } catch (e) {
    // Log Errors
    throw Error("Erreur à la récupération des messages de ce salon.");
  }
};

exports.getMessage = async function (query) {
  try {
    return await Message.findOne({ _id: query })
      .select("id_room content id_author datePublished")
      .populate({
        path: "id_author",
        select: "firstname",
        model: "User",
      });
  } catch (e) {
    // Log Errors
    throw Error("Erreur à la récupération de ce message.");
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
    throw Error("Erreur à la mise à jour du message.");
  }
};
