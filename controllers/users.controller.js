const User = require("../models/users.model");

// Import des librairies necessaire pour encrypter le mot de passe
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Enregistrement d'un utilisateur
exports.register = async (req, res) => {
  try {
    // Récupération des données de formulaire
    const { firstname, lastname, email, password } = req.body;

    // Vérification des données
    if (!firstname || !lastname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérifier que l'email n'est pas déjà enregistré
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "Cet email est déjà enregistré" });
    }

    // Encryption du mot de passe
    const hash = await bcrypt.hash(password, saltRounds);

    // Création de l'utilisateur
    const user = new User({
      firstname,
      lastname,
      email,
      password: hash,
    });

    // Enregistrement de l'utilisateur
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
