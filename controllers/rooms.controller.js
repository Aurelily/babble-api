const RoomService = require("../services/rooms.services");
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
    rooms.sort((a, b) => b._id - a._id);
    return res.status(200).json({
      status: 200,
      data: rooms,
      message: "Successfully Rooms Retrieved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// POST rooms/create - Création d'un message dans le chat général (User connecté)
//-----------------------------------

exports.createRoom = async function (req, res) {
  try {
    let room = await RoomService.createRoom(req.body);
    socketIO.emit("newRoom", room);
    return res.status(200).json({
      status: 200,
      data: room,
      message: "Room Successfully create",
    });
  } catch (e) {
    console.log(req.body);
    console.log(e);
    return res.status(500).json({ status: 400, message: e.message });
  }
};
