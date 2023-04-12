const User = require("../models/users.model");

exports.UploadAvatar = async function (req, res) {
  try {
    return await User.create(user);
  } catch (e) {
    // Log Errors
    throw Error("Erreur à la création d'un utilisateur: " + e);
  }
};

exports.createUser = async function (user) {
  try {
    let newUser = new User({ user });
    let hashedPassword = await newUser.createHash(user.password);
    user.password = hashedPassword;

    return await User.create(user);
  } catch (e) {
    // Log Errors
    throw Error("Erreur à la création d'un utilisateur:" + e);
  }
};

exports.getUsers = async function (query, page, limit) {
  try {
    return await User.find(query)
      .select("firstname lastname email avatarPath")
      .limit(limit)
      .skip(limit * page);
  } catch (e) {
    // Log Errors
    console.log(e).message;
    throw Error("Erreur dans la récupération de la liste d'utilisateurs.");
  }
};

exports.getUser = async function (query) {
  try {
    return await User.findOne({ _id: query }).select(
      "firstname lastname email avatarPath"
    );
  } catch (e) {
    // Log Errors
    throw Error(
      "Erreur dans la récupération des informations de l'utilisateur."
    );
  }
};

exports.getUserByEmail = async function (filter) {
  try {
    return await User.findOne({ email: filter }).select(
      "firstname lastname email password isAdmin"
    );
  } catch (e) {
    // Log Errors
    throw Error(e);
  }
};

exports.deleteUser = async function (param) {
  try {
    return await User.findByIdAndDelete({ _id: param });
  } catch (e) {
    // Log Errors
    throw Error(e);
  }
};

exports.updateUser = async function (query, body) {
  try {
    let newUser = new User({ body });
    let hashedPassword = await newUser.createHash(body.password);
    body.password = hashedPassword;

    return await User.findOneAndUpdate({ _id: query }, body, { new: true });
  } catch (e) {
    // Log Errors
    throw Error(e);
  }
};
