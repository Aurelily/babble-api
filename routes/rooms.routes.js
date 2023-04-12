const express = require("express");
const router = express.Router();
const roomController = require("../controllers/rooms.controller");
const auth = require("../middlewares/auth.middleware");

// /rooms - Routes accessibles seulement aux users connectés + admins
router.get("/", auth, roomController.getRooms);
router.get("/details/:id", auth, roomController.getRoom);
router.post("/post", auth, roomController.createRoom);
router.delete("/delete/:id", auth, roomController.deleteRoomById);

// /rooms - Routes accessibles seulement aux admins

module.exports = router;
