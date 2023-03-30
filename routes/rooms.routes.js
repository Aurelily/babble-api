const express = require("express");
const router = express.Router();
const roomController = require("../controllers/rooms.controller");
const auth = require("../middlewares/auth.middleware");

// /rooms - Routes accessibles seulement aux users connectés + admins
router.get("/", roomController.getRooms);
router.get("/details/:id", roomController.getRoom);
router.post("/post", roomController.createRoom);
router.delete("/delete/:id", roomController.deleteRoomById);

// /rooms - Routes accessibles seulement aux admins

module.exports = router;
