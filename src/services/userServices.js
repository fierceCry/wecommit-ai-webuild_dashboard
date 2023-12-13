require("dotenv").config();
const userDao = require("../models/userDao");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const {
  validateSignUp,
  validateChangePassword,
} = require("../utils/validator");

const transporter = nodemailer.createTransport({
  service: process.env.GMAIL_SERVICE,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const UserIdEmail = async (email, userEmail) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "wecommit 사용자 아이디 찾기 결과입니다.",
    text: `
안녕하세요, wecommit를 이용해 주셔서 감사합니다.

요청하신 아이디 찾기 결과를 안내드립니다.

아이디: ${userEmail}

보안을 위해 이메일, 비밀번호 등 개인 정보를 타인과 공유하지 마세요. 
아이디와 함께 비밀번호도 잊어버렸다면, wecommit 웹사이트에서 비밀번호 재설정 링크를 통해 변경해 주시기 바랍니다.

이 메일에 대해 문의사항이나 도움이 필요하신 경우, 고객 지원 센터로 연락해 주세요.

감사합니다.
wecommit 팀 드림.
`,
  };
  return transporter.sendMail(mailOptions);
};

const PasswordResetEmail = async (email, accessToken) => {
  if (!email) {
    throw new Error("Email address was not provided");
  }
  if (!accessToken) {
    throw new Error("Failed to send the password reset email");
  }
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "비밀번호 재설정 링크",
    text: `${process.env.FRONTEND_URL}/reset-password?token=${accessToken}`,
  };
  return transporter.sendMail(mailOptions);
};

const hashPassword = async (plaintextPassword) => {
  return await bcrypt.hash(plaintextPassword, parseInt(process.env.SALTROUNDS));
};

const getUserById = async (id) => {
  return await userDao.getUserById(id);
};

const checkEmail = async (userEmail) => {
  return await userDao.getUserByEmail(userEmail);
};

const signIn = async (userEmail, password) => {
  const user = await userDao.userById(userEmail);
  if (!user) {
    const error = new Error("INVALID_USER");
    error.statusCode = 404;
    throw error;
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    const error = new Error("INVALID_PASSWORD");
    error.statusCode = 404;
    throw error;
  }
  return jwt.sign(
    {
      id: user.id,
      userName: user.userName,
      brithday: user.brithday,
      gender: user.gender,
      userEmail: user.userEmail,
      recoveryEmail: user.recoveryEmail,
      phoneNumber: user.phoneNumber,
    },
    process.env.JWT_SECRET,
    {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const findUserId = async (recoveryEmail, phoneNumber, userName) => {
  const user = await userDao.getUserIdByNamePhoneEmail(
    userName,
    phoneNumber,
    recoveryEmail
  );
  if (!user) {
    throw new Error("User not found");
  }
  await UserIdEmail(recoveryEmail, user.userEmail);
};

const findUserPassword = async (userName, userEmail, recoveryEmail) => {
  const user = await userDao.getUserIdByNamePhonePassword(
    userName,
    userEmail,
    recoveryEmail
  );
  if (!user) {
    throw new Error("User not found");
  }
  const accessToken = jwt.sign(
    { id: user.id, userName: user.userName, password: user.password },
    process.env.JWT_SECRET,
    {
      algorithm: process.env.ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  await PasswordResetEmail(recoveryEmail, accessToken);
};

const signUp = async (
  userName,
  brithday,
  gender,
  phoneNumber,
  userEmail,
  recoveryEmail,
  password
) => {
  validateSignUp(phoneNumber, userEmail, recoveryEmail, password);

  const hashedPassword = await hashPassword(password);
  const createUser = await userDao.createUser(
    userName,
    brithday,
    gender,
    phoneNumber,
    userEmail,
    recoveryEmail,
    hashedPassword
  );
  return createUser;
};

const changePassword = async (
  userId,
  userEmail,
  userName,
  phoneNumber,
  newPassword
) => {
  validateChangePassword(newPassword);
  const check = await userDao.getUserById(userId);
  if (!check) {
    const error = new Error("INVALID_USER");
    error.statusCode = 400;
    throw error;
  }

  const user = await userDao.findUserByUsername(
    userEmail,
    userName,
    phoneNumber,
    newPassword
  );
  if (!user) {
    const error = new Error("INVALID_USER");
    error.statusCode = 400;
    throw error;
  }
  const hashedPassword = await hashPassword(newPassword);
  return await userDao.updatePassword(userId, hashedPassword);
};

module.exports = {
  signIn,
  findUserId,
  findUserPassword,
  signUp,
  checkEmail,
  getUserById,
  changePassword,
};