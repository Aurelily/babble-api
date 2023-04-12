const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages.controller");
const auth = require("../middlewares/auth.middleware");
const authAdmin = require("../middlewares/auth.admin.middleware");

// /messages - Routes accessibles seulement aux users connectés + admins
router.get("/", auth, messageController.getMessages);
router.get("/room/:id", auth, messageController.getMessagesByRoomId);
router.post("/post", auth, messageController.postMessage);

// /messages - Routes accessibles seulement aux admins
router.delete("/delete/:id", authAdmin, messageController.deleteMessageById);

module.exports = router;
