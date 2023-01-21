const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  if (!req.headers["authorization"])
    return res
      .status(401)
      .send({ status: 401, error: true, message: "Unauthorized access 1." });

  const token = req.headers.authorization;
  const bearer = token.replace("Bearer ", "");

  try {
    const decoded = await jwt.verify(bearer, process.env.JWT_SECRET);
    req.decoded = decoded;
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.isAdmin = true;
    next();
  } catch (error) {
    console.log(bearer);
    return res
      .status(401)
      .send({ status: 401, error: true, message: "Unauthorized access 2." });
  }
};
