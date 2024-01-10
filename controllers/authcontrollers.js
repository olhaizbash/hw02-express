const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { catchAsync } = require("../utils");
const { HttpError } = require("../Errors");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const { subscription } = user;

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { email, subscription } });
});

exports.logout = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
});

exports.currentUser = catchAsync(async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});

exports.updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;

  if (!["starter", "pro", "business"].includes(subscription)) {
    throw HttpError(400, "Invalid subscription type");
  }

  const user = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  if (!user) {
    throw HttpError(404, "User not found");
  }

  res.status(200).json({ email: user.email, subscription });
};

exports.updateAvatar = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { path: directory, originalname } = req.file;

  const fileName = `${_id}_${originalname}`;
  const directoryToUpload = path.join(
    __dirname,
    "../",
    "public",
    "avatars",
    fileName
  );

  const avatar = await Jimp.read(directory);
  await avatar.resize(250, 250).writeAsync(directory);
  await fs.rename(directory, directoryToUpload);

  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
});
