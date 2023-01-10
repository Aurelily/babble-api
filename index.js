const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true); // Supprime le warning de deprecation

// Connection a la base de donnée
require("./config/database");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", require("./routes/users.routes"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
