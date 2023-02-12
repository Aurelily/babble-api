const User = require("../models/users.model");
require("dotenv").config();

// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log the configuration
console.log(cloudinary.config());

exports.uploadAvatar = async function (file) {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(file, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

exports.createUser = async function (user) {
  try {
    return await User.create(user);
  } catch (e) {
    // Log Errors
    throw Error("Error while creating user: " + e);
  }
};

exports.getUsers = async function (query, page, limit) {
  try {
    return await User.find(query)
      .select("firstname lastname")
      .limit(limit)
      .skip(limit * page);
  } catch (e) {
    // Log Errors
    console.log(e);
    throw Error("Error while Paginating Users");
  }
};

exports.getUser = async function (query) {
  try {
    return await User.findOne({ _id: query }).select(
      "firstname lastname email"
    );
  } catch (e) {
    // Log Errors
    throw Error("Error while getting user");
  }
};

exports.getUserByEmail = async function (filter) {
  try {
    return await User.findOne({ email: filter }).select(
      "firstname lastname email password isAdmin"
    );
  } catch (e) {
    // Log Errors
    throw Error("Error while getting user");
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
    return await User.findOneAndUpdate({ _id: query }, body, { new: true });
  } catch (e) {
    // Log Errors
    throw Error("Error while updating user");
  }
};
