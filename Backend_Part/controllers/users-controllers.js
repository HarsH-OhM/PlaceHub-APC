const HttpError = require("../models/http-errors");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs"); //for hashing passwoord.
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); //get all the details except password
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed,please try again later",
      500
    );
    return next(error);
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
    status: 200,
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid input passed, please check your data",
      422
    );

    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      404
    );

    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "user is already exists, please login insted",
      422
    ); //invalid user input errorcode=422
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //12 is length of hashed password
  } catch (err) {
    const error = new HttpError(
      "Could not create the user, please try again",
      500
    );

    return next(error);
  }

  let createdUser = new User({
    name, //name: name
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save(); //save  is a method in mongoose which save the data in database
    console.log("signup success!");
  } catch (err) {
    const error = new HttpError("signing up faild,please try again", 500);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY, //private key
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up Failed,Please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    // user: createdUser.toObject({ getters: true }),
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
    message: "signup successfull",
    status: 200,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later",
      500
    );

    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid Credentials, could not log you in",
      403
    ); //invalid user input errorcode=422
    return next(error);
  }
  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in!, please check your credentials and try again.",
      500
    );

    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      403
    );

    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY, //it should be dsame as signup
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up Failed,Please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    message: "logged in!",
    // user: existingUser.toObject({ getters: true }),
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    status: 200,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
