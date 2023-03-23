const Rooms = require("../models/rooms.model");

exports.createRoom = async function (room) {
  try {
    return await Rooms.create(room);
  } catch (e) {
    // Log Errors
    throw Error("Error while creating room: " + e);
  }
};

exports.getRooms = async function (query) {
  try {
    return await Rooms.find(query)
      .select("name creator dateCreation")
      .populate("creator", "firstname");
  } catch (e) {
    // Log Errors
    console.log(e);
    throw Error("Error while Paginating rooms");
  }
};

exports.getRoom = async function (query) {
  try {
    return await Rooms.findOne({ _id: query })
      .select("_id name creator messages dateCreation")
      .populate("creator", "firstname");
  } catch (e) {
    // Log Errors
    throw Error("Error while getting room infos");
  }
};
