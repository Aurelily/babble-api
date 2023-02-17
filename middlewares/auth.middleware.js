const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  console.log(req.headers);
  if (!req.headers["authorization"])
    return res
      .status(403)
      .send({ status: 403, error: true, message: "Unauthorized access 1." });

  const token = req.headers.authorization;
  const bearer = token.replace("Bearer ", "");
  console.log("Ici");
  try {
    const decoded = await jwt.verify(bearer, process.env.JWT_SECRET);
    req.decoded = decoded;
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.isAdmin = false;
    next();
  } catch (error) {
    console.log("Test2222");
    return res
      .status(403)
      .send({ status: 403, error: true, message: "Unauthorized access 2." });
  }
};
