const express = require("express");

const router = express.Router();

const app = express();

app.use(express.json());

const {
  signup,
  login,
  logout,
  currentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers");

const {
  checkSignupData,
  authenticate,
  loginData,
  upload,
  emailData,
} = require("../../middlewares");

router.post("/register", checkSignupData, signup);
router.post("/login", loginData, login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, currentUser);
router.patch("/", authenticate, updateSubscription);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", emailData, resendVerifyEmail);
module.exports = router;
