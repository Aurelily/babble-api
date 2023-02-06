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
  avatar: Object,
  avatarPath: {
    type: mongoose.Schema.Types.Mixed,
    default: "./images/avatar-default.jpg",
  },
  token: String,
  refresh_token: String,

  // Le isOnline sera géré via le web socket
  /*   isOnline: {
    type: Boolean,
    required: true,
    default: false,
  }, */
});

userSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
