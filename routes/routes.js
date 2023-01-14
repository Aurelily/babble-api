const users = require("./users.routes.js");

module.exports.router = (app) => {
  app.use("/users", users);
};
