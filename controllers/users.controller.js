const UserService = require("../services/users.services");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// To emit socket
const socketIO = require("../index");

//-----------------------------------------------------------------
// GET users/ - Returns all registered users in database
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
      message: "Liste des utilisateurs récupérée.",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------------------------------------
// GET users/details/:id - Return one user detail : firstname, lastname, email, avatarPath
//-----------------------------------------------------------------
exports.getUser = async function (req, res, next) {
  const { id } = req.params;
  try {
    let user = await UserService.getUser(id);
    return res.status(200).json({
      status: 200,
      data: user,
      message: "Informations utilisateur récupérée.",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// POST users/register - register a user
//-----------------------------------

exports.register = async function (req, res) {
  try {
    let userTest = await UserService.getUserByEmail(req.body.email);
    if (userTest) {
      return res.status(409).json({
        status: 409,
        message: "Ce mail possède déjà un compte Babble !",
      });
    }

    if (!validator.isStrongPassword(req.body.password))
      return res.status(500).json({
        status: 500,
        message:
          "Votre mot de passe doit contenir au moins 8 caractères, 1 minuscule, 1 majuscule, 1 chiffre et un caractère spécial.",
      });

    if (!validator.isEmail(req.body.email))
      return res.status(500).json({
        status: 500,
        message: "Cet email n'a pas un format valide!",
      });

    let user = await UserService.createUser(req.body);

    return res.status(200).json({
      status: 200,
      data: user,
      message: "Vous êtes bien enregistré sur Babble.",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// POST users/login - Login a user
//-----------------------------------

exports.login = async function (req, res) {
  try {
    let user = await UserService.getUserByEmail(req.body.email);
    if (await user.comparePassword(req.body.password)) {
      // save user token
      user.token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      user.refresh_token = jwt.sign(
        {
          userId: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "7d" }
      );

      user.update({ token: user.token, refresh_token: user.refresh_token });

      return res.status(200).json({
        status: 200,
        data: user,
        message: "Vous êtes bien connecté à Babble.",
      });
    } else if (user.comparePassword(req.body.password) == null) {
      return res.status(400).json({
        status: 400,
        message: "L'email ou le mot de passe est incorrect.",
      });
    }
    return res.status(500).json({
      status: 400,
      message: "L'email ou le mot de passe est incorrect.",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// PUT users/update/:id - Update information from a user
//-----------------------------------
exports.updateById = async function (req, res) {
  try {
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    let user = await UserService.updateUser(id, req.body);
    return res.status(200).json({
      status: 200,
      data: user,
      message: "Vos informations sont bien mises à jour.",
    });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//--------------------------------------
// DELETE users/delete/:id - Delete a user
//--------------------------------------

exports.deleteUserById = async function (req, res) {
  try {
    const { id } = req.params;
    let user = await UserService.deleteUser(id);
    socketIO.emit("deleteUser", user);
    return res.status(200).json({
      status: 200,
      data: user,
      message: "L'utilisateur est bien supprimé.",
    });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};

//-----------------------------------
// PUT users/update/profil/ - Update connected user profil with JWT
//-----------------------------------
exports.updateProfil = async function (req, res) {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: 400, message: "Requête invalide." });

    let userConnected = await UserService.getUser(req.body._id);
    let userTest = await UserService.getUserByEmail(req.body.email);

    if (userTest && req.body.email !== userConnected.email) {
      return res.status(409).json({
        status: 409,
        message: "Cet email possède déjà un compte.",
      });
    }

    if (!validator.isStrongPassword(req.body.password))
      return res.status(500).json({
        status: 500,
        message:
          "Votre mot de passe doit contenir au moins 8 caractères, 1 minuscule, 1 majuscule, 1 chiffre et un caractère spécial.",
      });

    if (!validator.isEmail(req.body.email))
      return res.status(500).json({
        status: 500,
        message: "Cet email n'a pas un format valide!",
      });

    let user = await UserService.updateUser(userConnected._id, req.body);

    return res.status(200).json({
      status: 200,
      data: user,
      message: "Vos informations sont mises à jour.",
    });
  } catch (e) {
    return res.status(500).json({ status: 400, message: e.message });
  }
};
