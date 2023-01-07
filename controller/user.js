const { User } = require("../model/User");
const client = require("../bd/connect");
const { ObjectID } = require("bson");

const addUser = async (req, res) => {
  try {
    let user = new User(
      req.body.email,
      req.body.password,
      req.body.firstname,
      req.body.lastname
    );
    let result = await client.db().collection("users").insertOne(user);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    // La methode ci dessous retourne ce qu'on appele un Curseur
    let cursor = client.db().collection("users").find();
    // Je transforme ensuite le résuktat en tableau avec toArray
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ msg: "No user found" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getOneUser = async (req, res) => {
  try {
    // J'ai besoin de l'id du document à récupérer grâce à la classe ObjectID et le params id qui sera passé dans l'URL
    let id = new ObjectID(req.params.id);
    let cursor = client.db().collection("users").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ msg: "This user doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const updateOneUser = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    // On définie tous les champs de modification dans le body de la requête
    let newEmail = req.body.email;
    let newPassword = req.body.password;
    let newFirstname = req.body.firstname;
    let newLastname = req.body.lastname;

    // Pour updateOne, le 1er parametre est la condition et le deuxième l'opérateur atomique de mongoDB : $set
    let result = await client
      .db()
      .collection("users")
      .updateOne(
        { _id: id },
        {
          $set: {
            email: newEmail,
            password: newPassword,
            firstname: newFirstname,
            lastname: newLastname,
          },
        }
      );

    // Je rajoute un test ici : modifiedCount est une propriété qui est retourné quand on fait updateOne et si elle est = 1, la modification est réussie
    if (result.modifiedCount == 1) {
      res.status(200).json({ msg: "Update user OK !" });
    } else {
      res.status(404).json({ msg: "This user doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const deleteOneUser = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);

    // Pour deleteOne, 1 seule parametre est la condition
    let result = await client.db().collection("users").deleteOne({ _id: id });
    // Je rajoute un test ici : deleteCount est une propriété qui est retourné quand on fait deleteOne et si elle est = 1, la suppression est réussie
    if (result.deletedCount == 1) {
      res.status(200).json({ msg: "Delete user OK !" });
    } else {
      res.status(404).json({ msg: "This user doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};
module.exports = {
  addUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
};
