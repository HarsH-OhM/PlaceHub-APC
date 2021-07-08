const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-errors");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    //options request to continue
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization : 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication Failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY); //taking jwt key from config file
    req.userData = { userId: decodedToken.userId };
    next(); //to continue the proceess.
  } catch (err) {
    const error = new HttpError("Authentication Failed!", 403);
    return next(error);
  }
};
