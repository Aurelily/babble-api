const RoomService = require("../services/rooms.services");
const UserService = require("../services/users.services");

require("dotenv").config();

// To emit socket
const socketIO = require("../index");

//-----------------------------------------------------------------
// GET rooms/ - Return rooms list
//-----------------------------------------------------------------
exports.getRooms = async function (req, res) {
  const query = req.query.query;
  try {
    let rooms = await RoomService.getRooms(query);
    // sort rooms by creation date in descending order
    rooms.sort((a, b) => b.dateCreation - a.dateCreation);
    return res.status(200).json({
      status: 200,
      data: rooms,
      message: "Liste des salons récupérée avec succès.",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------------------------------------
// GET rooms/details/:id - Return a room details :
//-----------------------------------------------------------------
exports.getRoom = async function (req, res, next) {
  const { id } = req.params;
  try {
    let room = await RoomService.getRoom(id);
    return res.status(200).json({
      status: 200,
      data: room,
      message: "Informations sur le salon récupérées avec succès.",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// POST rooms/post - Create a room
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
      message: "Salon crée avec succès.",
    });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//--------------------------------------
// DELETE rooms/delete/:id - Delete a room
//--------------------------------------

exports.deleteRoomById = async function (req, res) {
  try {
    const { id } = req.params;
    let room = await RoomService.deleteRoom(id);
    socketIO.emit("deleteRoom", room);
    return res
      .status(200)
      .json({ status: 200, data: room, message: "Salon supprimé." });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};
