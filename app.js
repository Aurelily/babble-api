const express = require("express");
const { dbConnect } = require("./bd/connect");
const usersRoutes = require("./route/user");
const app = express();

// Middleware utilisé pour encoder le body des requetes des controllers
app.use(express.urlencoded({ extended: true }));

// On trabsforme ensuite la réponse en JSON
app.use(express.json());

app.use("/api/v1", usersRoutes);

const url = "mongodb://LocalHost/babble";

dbConnect(url, (error) => {
  if (error) {
    console.log("Database connexion error");
    process.exit(-1);
  } else {
    console.log("Database connexion OK !");
    app.listen(3000);
    console.log("Server running on port 3000 !");
  }
});
