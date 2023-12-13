require("dotenv").config();
const ssoDao = require("../models/ssoDao");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, GOOGLE_TOKEN_URL, GOOGLE_USERINFO_URL } = process.env;

const exchangeCodeForToken = async (code) => {
  try {
    const resp = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_SECRET_KEY,
      redirect_uri: GOOGLE_SIGNUP_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

const hashGoogleId = async (plaintextToken) => {
  return await bcrypt.hash(plaintextToken, parseInt(process.env.SALTROUNDS));
};

const getUserByEmail = async (email, social) => {
  return await ssoDao.getUserByEmail(email, social);
};

const createUser = async (id, social, name, email) => {
  const hashedGoogleId = await hashGoogleId(id);
  const createGoogleUser = await ssoDao.createGoogleUser(
    hashedGoogleId,
    social,
    name,
    email
  );

  return createGoogleUser;
};

const gooGlesignIn = async (sub, email, googleAccessToken) => {
  const user = await ssoDao.createUser(email);
  if(!user){
    const error = new Error("INVALID_USER")
    error.statusCode = 404;
    throw error
  }
  const gooGle = await bcrypt.compare(sub, user.password);
  if(!gooGle){
    const error = new Error("INVALID_PASSWORD");
    error.statusCode = 404;
    throw error;
  }
  const userInfo = await getUserInfoFromGoogle(googleAccessToken);
  if(!userInfo){
    const error = new Error("Request to Google failed");
    error.statusCode = 404;
    throw error;
  }

  return jwt.sign(
    {
      id: user.id,
      userName: userInfo.name,
      brithday: user.brithday,
      gender: user.gender,
      userEmail: user.userEmail,
      email: user.Email,
      phoneNumber: user.phoneNumber
    },
    process.env.JWT_SECRET,
    {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const getUserInfoFromGoogle = async (token) => {
  try {
      const response = await axios.get(GOOGLE_USERINFO_URL, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      return response.data;
  } catch{
      const error = new Error("ERROR");
      error.statusCode = 404;
      throw error;
  }
}
module.exports = {
    exchangeCodeForToken,
    createUser,
    gooGlesignIn,
    getUserInfoFromGoogle,
    getUserByEmail
}
