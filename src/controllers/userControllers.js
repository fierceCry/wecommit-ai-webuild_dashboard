const userService = require("../services/userServices");
const passport = require("passport");
const { catchAsync } = require("../utils/error");

const signIn = catchAsync(async (req, res) => {
  const { userEmail, password } = req.body;
  if (!userEmail || !password) {
    const error = new Error("KEY ERROR");
    error.stautsCode = 400;
    throw error;
  }

  const accessToken = await userService.signIn(userEmail, password);

  res.status(201).json({ accessToken });
});

const retrieveUserId = catchAsync(async (req, res) => {
  const { recoveryEmail, phoneNumber, userName } = req.body;
  if (!recoveryEmail || !phoneNumber || !userName) {
    const error = new Error("KEY ERROR");
    error.statusCode = 400;
    throw error;
  }
  await userService.findUserId(recoveryEmail, phoneNumber, userName);
  res.status(201).json({ message: "I sent it to you via email" });
});

const retrieveUserPassword = catchAsync(async (req, res) => {
  const { userName, userEmail, recoveryEmail } = req.body;
  if (!userName || !userEmail || !recoveryEmail) {
    const error = new Error("KEY ERROR");
    error.statusCode = 400;
    throw error;
  }
  await userService.findUserPassword(userName, userEmail, recoveryEmail);
  res.status(201).json({ message: "I sent it to you via password" });
});

const signUp = catchAsync(async (req, res) => {
  const {
    userName,
    brithday,
    gender,
    phoneNumber,
    userEmail,
    Email,
    password,
  } = req.body;
  if (
    !userName ||
    !brithday ||
    !gender ||
    !phoneNumber ||
    !userEmail ||
    !Email ||
    !password
  ) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  const checkEmail = await userService.checkEmail(userEmail);
  if (!checkEmail) {
    const createUser = await userService.signUp(
      userName,
      brithday,
      gender,
      phoneNumber,
      userEmail,
      Email,
      password
    );

    res.status(201).json({
      message:
        "Registration successful! You're all set to explore and enjoy our services",
    });
  } else if (checkEmail.userEmail == userEmail) {
    const error = new Error("This email address is already registered");
    error.statusCode = 400;

    throw error;
  }
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { userEmail, userName, newPassword, phoneNumber } = req.body;
  if (!userId || !userName || !newPassword || !phoneNumber || !userEmail) {
    const error = new Error("KEY ERROR");
    error.stauts = 400;
    throw error;
  }
  await userService.changePassword(
    userId,
    userEmail,
    userName,
    phoneNumber,
    newPassword
  );

  res.status(201).json({ message: "changePassword" });
});


module.exports = {
  signIn,
  retrieveUserId,
  retrieveUserPassword,
  changePassword,
  signUp,
};
