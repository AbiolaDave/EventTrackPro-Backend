// List of imports
const express = require("express");
const router = express.Router();
const {
  displayWelcome,
  registerUser,
  signInUser,
  getDashboard,
  goDashboard,
  sendMail,
} = require("../controllers/user.controller");

// Routes
router.get("/welcome", displayWelcome);
router.post("/register", registerUser);
router.post("/login", signInUser);
router.post("/", getDashboard);
router.get("/dashboard", goDashboard);
router.get("/sendemail", sendMail);

module.exports = router;
