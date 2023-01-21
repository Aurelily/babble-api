const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const auth = require("../middlewares/auth.middleware");

// /users - Routes accessibles aux users non connectés
router.post("/register", userController.register);
router.post("/login", userController.login);

// /users - Routes accessibles seulement aux users connectés + admins
router.get("/", userController.getUsers);
router.get("/details/:id", userController.getUser);
router.put("/update/profil", userController.updateProfil);

// /users - Routes accessibles seulement aux admins
router.put("/update/:id", userController.updateById);
router.delete("/delete/:id", userController.deleteUserById);

module.exports = router;
