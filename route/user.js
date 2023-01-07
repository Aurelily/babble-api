const express = require("express");
const {
  addUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} = require("../controller/user");
const router = express.Router();

router.route("/users").post(addUser);
router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getOneUser);
router.route("/users/:id").put(updateOneUser);
router.route("/users/:id").delete(deleteOneUser);

module.exports = router;
