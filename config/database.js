const mongoose = require("mongoose");

mongoose.connect("mongodb://LocalHost/babble", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log(`Connected MongoDB ${db.name} à ${db.host}:${db.port}`);
});

db.on("error", (err) => {
  console.error(`Error in MongoDb connection: ${err}`);
  process.exit();
});
