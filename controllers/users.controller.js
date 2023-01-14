const User = require("../models/users.model");
const UserService = require("../services/users.services");
const {
  updateUser,
  deleteUser,
  getUser,
} = require("../services/users.services");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
require("dotenv").config();

// Import des librairies necessaire pour encrypter le mot de passe
const bcrypt = require("bcrypt");
const saltRounds = 10;

//-----------------------------------
// Enregistrement d'un utilisateur
//-----------------------------------

exports.register = async function (req, res) {
  try {
    if (!validator.isStrongPassword(req.body.password))
      return res.status(500).json({
        status: 500,
        message:
          "Your password must contains at least minimum 8 character, 1 lowercase, 1 uppercase, 1 number and 1 symbols",
      });
    let user = await UserService.createUser(req.body);
    user.token = jwt.sign(
      { user_id: user._id, email: user.email },
      config.secret,
      { expiresIn: "1d" }
    );
    user.refresh_token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
      },
      config.refreshTokenSecret,
      { expiresIn: "7d" }
    );
    await user.update({ token: user.token, refresh_token: user.refresh_token });
    return res
      .status(200)
      .json({ status: 200, data: user, message: "User Successfully register" });
  } catch (e) {
    console.log(req.body);
    console.log(e);
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// Login d'un utilisateur
//-----------------------------------

exports.login = async function (req, res) {
  try {
    let user = await UserService.getUser({ email: req.body.email });
    if (await user.comparePassword(req.body.password)) {
      // save user token
      user.token = jwt.sign(
        { user_id: user._id, email: user.email },
        config.secret,
        { expiresIn: "1d" }
      );
      user.refresh_token = jwt.sign(
        {
          user_id: user._id,
          email: user.email,
        },
        config.refreshTokenSecret,
        { expiresIn: "7d" }
      );
      user.update({ token: user.token, refresh_token: user.refresh_token });
      return res.status(200).json({
        status: 200,
        data: user,
        message: "User Successfully logged in",
      });
    }
    return res
      .status(500)
      .json({ status: 400, message: "password is incorrect" });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// Update d'un utilisateur par son ID
//-----------------------------------
exports.updateById = async function (req, res) {
  try {
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    let user = await updateUser(id, req.body);
    return res
      .status(200)
      .json({ status: 200, data: user, message: "User Successfully updated" });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//--------------------------------------
// Supprimer un utilisateur par son ID
//--------------------------------------

exports.deleteUserById = async function (req, res) {
  try {
    const { id } = req.params;
    let user = await deleteUser(query);
    return res
      .status(200)
      .json({ status: 200, data: user, message: "User Successfully deleted" });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};
