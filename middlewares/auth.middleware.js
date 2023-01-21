const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  if (!req.headers["authorization"])
    return res
      .status(401)
      .send({ status: 401, error: true, message: "Unauthorized access 1." });
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  try {
    const decoded = await jwt.verifyAsync(token, process.env.JWT_SECRET);
    req.decoded = decoded;
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    console.log(token);
    return res
      .status(401)
      .send({ status: 401, error: true, message: "Unauthorized access 2." });
  }
};
