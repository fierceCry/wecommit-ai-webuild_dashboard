require("dotenv").config();
const kakaoDao = require('../models/kakaoDao');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const getRedirectUri = async (endPoint) => {
  switch (endPoint) {
    case '/kakao-sign-in':
      return process.env.SIGN_IN_REDIRECT_URI;
    case '/kakao-sign-up':
      return process.env.SIGN_UP_REDIRECT_URI;
  }
};

const getKaKaoAccessToken = async (authCode, redirectUri) => {
  try {
    const response = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=${process.env.GRANT_TYPE}&code=${authCode}&redirect_uri=${redirectUri}&client_id=${process.env.CLIENT_ID}`
    );
    const kakaoAccessToken = await response.data.access_token;
    return kakaoAccessToken;
  } catch(error){
    console.log(error);
    const err = new Error("It's not in Kakao");
    err.statusCode = 404;
    throw err;
  }
};

const getUserInformation = async (kakaoAccessToken) => {
  try {
    const response = await axios.get(process.env.KAKAO_USERINFO_URL, {
      headers: { Authorization: `Bearer ${kakaoAccessToken}` },
    });
    const userInformation = await response.data.kakao_account;
    return userInformation;
  } catch (err) {
    const message = err.response.data.error;
    err.statusCode = err.response.status;
    err.message = message;
    throw err;
  }
};

const calculateAge = async (birthyear, birthday) => {
  const today = new Date();
  const birthMonth = birthday.slice(0, 2);
  const birthDate = birthday.slice(2, 4);
  const age =
    (birthMonth - today.getMonth >= 0) & (birthDate - today.getDate() >= 0)
      ? today.getFullYear() - birthyear
      : today.getFullYear() - birthyear - 1;
  return age;
};

const getUserByEmail = async (email) => {
  const [user] = await kakaoDao.getUserByEmail(email);
  return user;
};

const getUserType = async (email) => {
  const { userType: userType } = await kakaoDao.getUserType(email);
  return userType;
};

const createToken = async (email) => {
  const { email: mail } = await getUserByEmail(email);
  const userType = await getUserType(email);
  const grade = await getGrade(userType, email);
  const token = jwt.sign(
    { email: mail, userType: userType, grade: grade },
    process.env.JWT_SECRET,
    {
      algorithm: process.env.JWT_ALGORITHM,
    }
  );
  return token;
};

const createUser = async (email, gender, age) => {
  await kakaoDao.createUser(email, gender, age);
};

const checkDuplicateNickname = async (nickname) => {
  const result = await kakaoDao.checkDuplicateNickname(nickname);
  return result;
};

const addAdditionalInfo = async (nickname, social) => {
  await kakaoDao.addAdditionalInfo(nickname, social);
};

const getGrade = async (userType, email) => {
  const { grade: userGrade } = await kakaoDao.getGrade(userType, email);
  return userGrade;
};

module.exports = {
  getRedirectUri,
  getKaKaoAccessToken,
  getUserInformation,
  calculateAge,
  getUserByEmail,
  getUserType,
  createToken,
  createUser,
  checkDuplicateNickname,
  addAdditionalInfo,
  getGrade
};
