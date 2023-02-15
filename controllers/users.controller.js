const UserService = require("../services/users.services");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//-----------------------------------------------------------------
// GET users/ - Retourne tous les utilisateur dans une liste avec nom et prénom (User Connecté + admin)
//-----------------------------------------------------------------
exports.getUsers = async function (req, res, next) {
  // Validate request parameters, queries using express-validator
  const page = req.query.page ? req.query.page : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  const query = req.query.query;
  try {
    let users = await UserService.getUsers(query, page, limit);
    return res.status(200).json({
      status: 200,
      data: users,
      message: "Successfully Users Retrieved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------------------------------------
// GET users/details/:id - Retourne les détails d'un utilisateur : nom, prénom, email (User Connecté + admin)
//-----------------------------------------------------------------
exports.getUser = async function (req, res, next) {
  const { id } = req.params;
  try {
    let user = await UserService.getUser(id);
    return res.status(200).json({
      status: 200,
      data: user,
      message: "Successfully User Retrieved",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// POST users/upload - Upload de l'avatar d'un utilisateur sur Cloudinary (User non connecté)
//-----------------------------------

exports.upload = async function (req, res) {
  /* console.log(req); */
  /* console.log(req.file); */
  console.log(req.body);
  const img = req.body.avatarPath;
  if (!img) {
    console.log("no image");
  }

  res.send({ congrats: "data recieved CONT" });
};

//-----------------------------------
// POST users/register - Enregistrement d'un utilisateur (User non connecté)
//-----------------------------------

exports.register = async function (req, res) {
  try {
    let userTest = await UserService.getUserByEmail(req.body.email);
    if (userTest) {
      return res.status(409).json({
        status: 409,
        message: "This email already has an account.",
      });
    }

    if (!validator.isStrongPassword(req.body.password))
      return res.status(500).json({
        status: 500,
        message:
          "Your password must contains at least minimum 8 character, 1 lowercase, 1 uppercase, 1 number and 1 symbols",
      });

    if (!validator.isEmail(req.body.email))
      return res.status(500).json({
        status: 500,
        message: "Email is not a valid format !",
      });
    let user = await UserService.createUser(req.body);

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
// POST users/login - Login d'un utilisateur (User non connecté)
//-----------------------------------

exports.login = async function (req, res) {
  try {
    let user = await UserService.getUserByEmail(req.body.email);
    console.log(user);
    if (await user.comparePassword(req.body.password)) {
      // save user token
      user.token = jwt.sign(
        { userId: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      user.refresh_token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "7d" }
      );
      user.update({ token: user.token, refresh_token: user.refresh_token });
      return res.status(200).json({
        status: 200,
        data: user,
        message: "User Successfully logged in",
      });
    } else if (user.comparePassword(req.body.password) == null) {
      return res.status(400).json({
        status: 400,
        message: "Login or password incorrect",
      });
    }
    return res
      .status(500)
      .json({ status: 400, message: "password is incorrect" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// PUT users/update/:id - Update d'un utilisateur par son ID (params) (Admin)
//-----------------------------------
exports.updateById = async function (req, res) {
  try {
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    let user = await UserService.updateUser(id, req.body);
    return res
      .status(200)
      .json({ status: 200, data: user, message: "User Successfully updated" });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//--------------------------------------
// DELETE users/delete/:id - Supprimer un utilisateur par son ID (params) (Admin)
//--------------------------------------

exports.deleteUserById = async function (req, res) {
  try {
    const { id } = req.params;
    let user = await UserService.deleteUser(id);
    return res
      .status(200)
      .json({ status: 200, data: user, message: "User Successfully deleted" });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// PUT users/update/profil/ - Update de son profil connecté (via JWT) (Utilisateur connecté)
//-----------------------------------
exports.updateProfil = async function (req, res) {
  try {
    if (!req.body)
      return res.status(400).json({ status: 400, message: "Invalid request" });

    const token = req.headers.authorization;
    const bearer = token.replace("Bearer ", "");
    console.log(bearer);
    const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { firstname, lastname, email } = req.body;
    let user = await UserService.updateUser(userId, req.body);
    return res
      .status(200)
      .json({ status: 200, data: user, message: "User Successfully updated" });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};
