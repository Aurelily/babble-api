const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/update/:id", userController.updateById);
router.put("/delete/:id", userController.deleteUserById);

module.exports = router;
