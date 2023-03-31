const RoomService = require("../services/rooms.services");
const UserService = require("../services/users.services");
require("dotenv").config();

//Pour utiliser les emit de socket coté serveur
const socketIO = require("../index");

//-----------------------------------------------------------------
// GET rooms/ - Retourne toutes les rooms du channel général dans une liste (User Connecté + admin)
//-----------------------------------------------------------------
exports.getRooms = async function (req, res) {
  const query = req.query.query;
  /*   console.log(query); */
  try {
    let rooms = await RoomService.getRooms(query);
    // sort rooms by creation date in descending order
    rooms.sort((a, b) => b.dateCreation - a.dateCreation);
    return res.status(200).json({
      status: 200,
      data: rooms,
      message: "Successfully Rooms Retrieved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------------------------------------
// GET rooms/details/:id - Retourne les détails d'une room : id, name, creator, messages, dateCreation (User Connecté + admin)
//-----------------------------------------------------------------
exports.getRoom = async function (req, res, next) {
  const { id } = req.params;
  try {
    let room = await RoomService.getRoom(id);
    return res.status(200).json({
      status: 200,
      data: room,
      message: "Successfully Room Retrieved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// POST rooms/post - Création d'un message dans le chat général (User connecté)
//-----------------------------------

exports.createRoom = async function (req, res) {
  try {
    let room = await RoomService.createRoom(req.body);
    let creator = await UserService.getUser(req.body.creator);
    socketIO.emit("newRoom", room);
    socketIO.emit("newCreator", creator);
    return res.status(200).json({
      status: 200,
      data: room,
      message: "Room Successfully create",
    });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//--------------------------------------
// DELETE rooms/delete/:id - Supprimer une room par son ID (params) (Utilisateur connecté et auteur)
//--------------------------------------

exports.deleteRoomById = async function (req, res) {
  try {
    const { id } = req.params;
    let room = await RoomService.deleteRoom(id);
    socketIO.emit("deleteRoom", room);
    return res
      .status(200)
      .json({ status: 200, data: room, message: "Room Successfully deleted" });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};
