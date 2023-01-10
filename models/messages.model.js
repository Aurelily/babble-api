const mongoose = require("mongoose");
const Users = require("./users.model");

const messageSchema = mongoose.Schema({
  contenu: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 240,
  },
  auteur: {
    type: mongoose.Types.ObjectId,
    ref: Users,
  },
  datePublie: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

// Ci dessous je mets mes methodes qui concernent la gestion des messages :

// Les propriétés statics sont accessibles directement dans la classe model
messageSchema.statics.findAllMessages = function () {
  return mongoose.model("Messages").find().populate("auteur");
};

// Les propriétés query ne seront accessibles qu'au niveau des query (les select)
messageSchema.query.findNbMessages = function (nb) {
  return mongoose.model("Messages").find().limit(nb);
};

// Les propriétés virtual crée une propriété virtuelle qui n'existe pas dans l'objet, pour par exemple afficher une des propriétés
messageSchema.virtual("afficheContenu").get(function () {
  return "Le contenu est : " + this.contenu;
});

// La methode pre() est un Middleware qui permet de réaliser une action asynchrone avant une autre (par exemple, save, update..)
messageSchema.pre("save", function (next) {
  console.log("Instruction avant enregistrement save");
  next();
});

// La methode post() est un Middleware qui permet de réaliser une action asynchrone après une autre (par exemple, save, update..)
messageSchema.post("save", function (docId, next) {
  console.log("Instruction après enregistrement save", docId._id);
  next();
});

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
