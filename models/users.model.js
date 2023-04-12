const mongoose = require("mongoose");
const checker = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    required: true,
    unique: true,
    type: String,
    validate: {
      validator: function (v) {
        return checker.isEmail(v);
      },
      message: "L'email n'est pas à un format valide",
    },
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  /*  avatar: Object, */
  avatarPath: {
    type: mongoose.Schema.Types.Mixed,
    default: "avatar-0.png",
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  token: String,
  refresh_token: String,
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a hash from plain text
userSchema.methods.createHash = async function (plainTextPassword) {
  // Hashing user's salt and password with 10 iterations,
  const saltRounds = 10;

  // Method to generate a salt and then create hash
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainTextPassword, salt);
};

// Validating the candidate password with stored hash and hash function
userSchema.methods.validatePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
