const express = require("express");
const googleRouter = express.Router();
const googleController = require("../controllers/googleControllers");

googleRouter.get("/google-signup", googleController.googleSignUp);
googleRouter.get(
  "/google-signup/callback",
  googleController.googleSignupCallback
);
googleRouter.get("/google-signin", googleController.googleLogin);
googleRouter.get("/google-signin/callback", googleController.googleLoginCallback);

module.exports = {
  googleRouter
};