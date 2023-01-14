const express = require("express");
const app = express();
const router = require("./routes/routes");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true); // Supprime le warning de deprecation

// Connection a la base de donnée
require("./config/database");

// Config de base de express pour dire que l'on utilisera du JSON pour le passage et la récup de paramètres
// et pour encoder le contenu et bien gérer les accents
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router

router.router(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
