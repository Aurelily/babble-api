const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages.controller");
const auth = require("../middlewares/auth.middleware");

// /messages - Routes accessibles seulement aux users connectés + admins
router.get("/", messageController.getMessages);
router.get("/room/:id", messageController.getMessagesByRoomId);
router.post("/post", messageController.postMessage);

// /messages - Routes accessibles seulement aux admins
router.delete("/delete/:id", messageController.deleteMessageById);

module.exports = router;
