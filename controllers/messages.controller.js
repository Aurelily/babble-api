const MessageService = require("../services/messages.services");
require("dotenv").config();
const UserService = require("../services/users.services");

//Pour utiliser les emit de socket coté serveur
const socketIO = require("../index");

//-----------------------------------------------------------------
// GET messages/ - Retourne tous les messages du channel général dans une liste avec id_room, content, author et datePublished (User Connecté + admin)
//-----------------------------------------------------------------
exports.getMessages = async function (req, res, next) {
  // Validate request parameters, queries using express-validator
  const page = req.query.page ? req.query.page : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  const query = req.query.query;
  try {
    let messages = await MessageService.getMessages(query, page, limit);
    return res.status(200).json({
      status: 200,
      data: messages,
      message: "Successfully Messages Retrieved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// POST messages/create - Création d'un message dans le chat général (User connecté)
//-----------------------------------

exports.postMessage = async function (req, res) {
  try {
    let message = await MessageService.createMessage(req.body);
    let messageAuthor = await UserService.getUser(req.body.id_author);
    socketIO.emit("newMessage", message);
    socketIO.emit("newMessageAuthor", messageAuthor);
    return res.status(200).json({
      status: 200,
      data: message,
      message: "User Successfully register",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//--------------------------------------
// GET messages/:roomId - Supprimer un message par son ID (params) (Admin)
//--------------------------------------

exports.getMessagesByRoomId = async function (req, res) {
  try {
    const { id } = req.params;
    let messages = await MessageService.getMessagesByRoomId(id);
    return res.status(200).json({
      status: 200,
      data: messages,
      message: "Message Successfully retrived for this room",
    });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//--------------------------------------
// DELETE messages/delete/:id - Supprimer un message par son ID (params) (Admin)
//--------------------------------------

exports.deleteMessageById = async function (req, res) {
  try {
    const { id } = req.params;
    let user = await MessageService.deleteMessage(id);
    return res.status(200).json({
      status: 200,
      data: user,
      message: "Message Successfully deleted",
    });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};
