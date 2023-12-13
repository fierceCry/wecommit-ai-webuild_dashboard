require("dotenv").config();

const googleService = require("../services/googleServices");
const axios = require("axios");
const { catchAsync } = require("../utils/error");
const jwt = require("jsonwebtoken");

const {
  GOOGLE_ID,
  GOOGLE_SIGNUP_CALLBACK_URL,
  GOOGLE_SIGNIN_CALLBACK_URL,
  GOOGLE_SECRET_KEY,
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
} = process.env;

const googleSignUp = catchAsync(async (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_ID}`;
  url += `&redirect_uri=${GOOGLE_SIGNUP_CALLBACK_URL}`;
  url += "&response_type=code";
  url += "&scope=email profile";
  res.redirect(url);
});

const googleSignupCallback = catchAsync(async (req, res) => {
  const { code } = req.query;

  const tokenRes = await axios.post(GOOGLE_TOKEN_URL, {
    code,
    client_id: GOOGLE_ID,
    client_secret: GOOGLE_SECRET_KEY,
    redirect_uri: GOOGLE_SIGNUP_CALLBACK_URL,
    grant_type: "authorization_code",
  });

  const googleAccessToken = tokenRes.data.access_token;

  const userRes = await axios.get(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${googleAccessToken}`,
    },
  });

  const user = userRes.data;
  const { id, name, email } = user;
  const social = "google";

  // dev_test
  await googleService.createUser(id, social, name, email);
  res.status(201).json({
    message:
      "Registration successful! You're all set to explore and enjoy our services",
  });

  // 실제 사용될 코드(중복된 아이디 check하는 내용 추가)
  // const checkEmail = await googleService.getUserByEmail(email, social);
  // if (!checkEmail.Email) {
  //   await googleService.createUser(id, social, name, email);
  //   res.status(201).json({
  //     message:
  //       "Registration successful! You're all set to explore and enjoy our services",
  //   });
  // } else if (checkEmail.Email == email) {
  //   const error = new Error("This email address is already registered");
  //   error.statusCode = 400;

  //   throw error;
  // }
});

const googleLogin = catchAsync(async (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_LOGIN_REDIRECT_URI}`;
  url += "&response_type=code";
  url += "&scope=email profile";
  res.redirect(url);
});

const googleLoginCallback = async (req, res) => {
  const { code } = req.query;

  const tokenRes = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_ID,
      client_secret: GOOGLE_SECRET_KEY,
      redirect_uri: GOOGLE_SIGNIN_CALLBACK_URL,
      grant_type: "authorization_code",
  });

  const decodedToken = jwt.decode(tokenRes.data.id_token);
  const googleAccessToken = tokenRes.data.access_token
  const { sub, email } = decodedToken;
  const user = await googleService.gooGlesignIn(sub, email, googleAccessToken);
  res.status(200).json({
      message: "Successful Google login",
      user: user
  });
};

module.exports = {
  googleSignUp,
  googleSignupCallback,
  googleLogin,
  googleLoginCallback
};