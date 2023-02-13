const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/avatars/");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");

/* module.exports = async (req, res, next) => {
  try {
    const storage = multer.diskStorage({
      destination: "./public/avatars/",
      filename: function (req, file, cb) {
        cb(null, "SomeImage" + "." + file.originalname.split(".").pop());
      },
    });

    const diskStorage = multer({ storage: storage });
    diskStorage.single("image");

    console.log(req.file); // File which is uploaded in /uploads folder.
    console.log(req.body); // Body
    next();
    /*  res.send({ congrats: "data recieved MULTER" }); 
  } catch (error) {
    res.status(500).send("Error");
  }
}; */
