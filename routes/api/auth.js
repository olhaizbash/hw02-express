const express = require("express");

const router = express.Router();

const app = express();

app.use(express.json());

const { signup, login, logout, currentUser } = require("../../controllers");

const {
  checkSignupData,
  authenticate,
  loginData,
} = require("../../middlewares");

router.post("/register", checkSignupData, signup);
router.post("/login", loginData, login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, currentUser);
module.exports = router;
