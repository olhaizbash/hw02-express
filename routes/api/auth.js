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
} = require("../../controllers");

const {
  checkSignupData,
  authenticate,
  loginData,
  upload,
} = require("../../middlewares");

router.post("/register", checkSignupData, signup);
router.post("/login", loginData, login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, currentUser);
router.patch("/", authenticate, updateSubscription);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);
module.exports = router;
