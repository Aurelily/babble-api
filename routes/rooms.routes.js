const express = require("express");
const router = express.Router();
const roomController = require("../controllers/rooms.controller");
const auth = require("../middlewares/auth.middleware");

// /rooms - Routes accessibles seulement aux users connectés + admins
router.get("/", roomController.getRooms);
router.post("/post", roomController.createRoom);

/* // /rooms - Routes accessibles seulement aux admins
router.delete("/delete/:id", roomController.deleteRoomById); */

module.exports = router;
