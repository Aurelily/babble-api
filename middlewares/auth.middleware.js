const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  /*   console.log(req.headers); */
  // Get the JWT token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // If the token is not provided, return a 401 Unauthorized error
  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user object to the request object
    req.userId = decoded.userId;
    /* req.email = decoded.email; */
    req.isAdmin = false;
    next(); // Move to the next middleware
  } catch (error) {
    // If the token is invalid or has expired, return a 403 Forbidden error
    return res
      .status(403)
      .json({ message: "Invalid or expired authentication token" });
  }
};
