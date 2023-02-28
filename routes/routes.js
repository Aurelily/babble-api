const users = require("./users.routes.js");
const messages = require("./messages.routes.js");
const rooms = require("./rooms.routes");

module.exports.router = (app) => {
  app.use("/users", users);
  app.use("/messages", messages);
  app.use("/rooms", rooms);
};
