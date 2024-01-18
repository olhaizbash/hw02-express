const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { catchAsync } = require("../utils");
const { HttpError } = require("../Errors");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../utils");

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const message = {
    to: email,
    subject: "Confirmation of registration",
    html: `<a target="_blank" href="http://localhost:3000/api//users/verify/${verificationToken}">Confirm email</a>`,
  };
  await sendEmail(message);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const { subscription } = user;

  if (!user || !user.verify) {
    throw HttpError(401, "Email or password is wrong or email is not verify");
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

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({ message: "Verification successful" });
});

exports.resendVerifyEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(400, "Missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const message = {
    to: email,
    subject: "Verification email",
    html: `<a target="_blank" href="http://localhost:3000/api//users/verify/${user.verificationToken}">Confirm email</a>`,
  };
  await sendEmail(message);

  res.json({ message: "Verification email sent" });
});
