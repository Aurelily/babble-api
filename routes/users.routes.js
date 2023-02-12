const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const auth = require("../middlewares/auth.middleware");
const authAdmin = require("../middlewares/auth.admin.middleware");

// /users - Routes accessibles aux users non connectés
router.post("/register", userController.register);
router.post("/registertest", userController.registertest);
router.post("/upload", userController.upload);
router.post("/login", userController.login);

// /users - Routes accessibles seulement aux users connectés + admins
router.get("/", auth, userController.getUsers);
router.get("/details/:id", auth, userController.getUser);
router.put("/update/profil", auth, userController.updateProfil);

// /users - Routes accessibles seulement aux admins
router.put("/update/:id", authAdmin, userController.updateById);
router.delete("/delete/:id", authAdmin, userController.deleteUserById);

module.exports = router;
