const Rooms = require("../models/rooms.model");
const Messages = require("../models/messages.model");

exports.createRoom = async function (room) {
  try {
    return await Rooms.create(room);
  } catch (e) {
    // Log Errors
    throw Error("Erreur à la création du salon: " + e);
  }
};

exports.getRooms = async function (query) {
  try {
    return await Rooms.find(query)
      .select("name creator dateCreation privateCode")
      .populate({
        path: "creator",
        select: "firstname",
        model: "User",
      });
  } catch (e) {
    // Log Errors
    console.log(e);
    throw Error("Erreur à la récupération de la liste de salons.");
  }
};

exports.getRoom = async function (query) {
  try {
    return await Rooms.findOne({ _id: query })
      .select("_id name creator dateCreation privateCode")
      .populate({
        path: "creator",
        select: "firstname",
        model: "User",
      });
  } catch (e) {
    // Log Errors
    throw Error("Erreur à la récupération des informations du salon.");
  }
};

exports.deleteRoom = async function (param) {
  try {
    await Messages.deleteMany({ id_room: param });
    return await Rooms.findByIdAndDelete({ _id: param });
  } catch (e) {
    // Log Errors
    throw Error(e);
  }
};
