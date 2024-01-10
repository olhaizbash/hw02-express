const { HttpError } = require("../Errors");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { catchAsync, signupValidator } = require("../utils");
const multer = require("multer");
const path = require("path");

exports.checkSignupData = catchAsync(async (req, res, next) => {
  const { value, error } = signupValidator(req.body);
  if (error) throw HttpError(400, "Invalid user data");
  const userExistsWithEmail = await User.exists({
    email: value.email,
  });
  if (userExistsWithEmail) throw HttpError(409, "Email in use");
  req.body = value;
  next();
});

exports.loginData = catchAsync(async (req, res, next) => {
  const { value, error } = signupValidator(req.body);
  if (error) throw HttpError(400, "Invalid user data");
  req.body = value;
  next();
});

exports.authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};

const directory = path.join(__dirname, "../", "tmp");

const multerStorage = multer.diskStorage({
  destination: directory,
});

exports.upload = multer({ storage: multerStorage });
