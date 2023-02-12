const multer = require("multer");

module.exports = async (req, res) => {
  const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
      cb(null, "SomeImage" + "." + file.originalname.split(".").pop());
    },
  });

  const diskStorage = multer({ storage: storage });
  diskStorage.single("avatarPath");
  try {
    console.log(req.file); // File which is uploaded in /uploads folder.
    console.log(req.body); // Body
    res.send({ congrats: "data recieved MULTER" });
  } catch (error) {
    res.status(500).send("Error");
  }
};
