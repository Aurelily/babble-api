const users = require("./users.routes.js");
const messages = require("./messages.routes.js");

module.exports.router = (app) => {
  app.use("/users", users);
  app.use("/messages", messages);
};
