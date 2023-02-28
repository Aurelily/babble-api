const RoomService = require("../services/rooms.services");
require("dotenv").config();

//-----------------------------------------------------------------
// GET rooms/ - Retourne toutes les rooms du channel général dans une liste (User Connecté + admin)
//-----------------------------------------------------------------
exports.getRooms = async function (req, res, next) {
  // Validate request parameters, queries using express-validator
  const query = req.query.query;
  try {
    let messages = await RoomService.getRooms(query);
    return res.status(200).json({
      status: 200,
      data: messages,
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
