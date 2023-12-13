const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userControllers");
const { loginRequired } = require("../utils/auth");

userRouter.post("/signin", userController.signIn);
userRouter.post("/retrieve-id", userController.retrieveUserId);
userRouter.post("/retrieve-password", userController.retrieveUserPassword);
userRouter.post("/signup", userController.signUp);
userRouter.post("/password", loginRequired, userController.changePassword);

module.exports = { userRouter };
