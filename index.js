const express = require("express");
const cors = require("cors");
const app = express();
//Cette ligne fait bénifier de CORS à toutes les requêtes de notre serveur
app.use(cors());
const multer = require("multer");
const upload = multer();

const router = require("./routes/routes");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true); // Supprime le warning de deprecation

// Connection a la base de donnée
require("./config/database");

// Config de base de express pour dire que l'on utilisera du JSON pour le passage et la récup de paramètres
// et pour encoder le contenu et bien gérer les accents
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

// Router

router.router(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
