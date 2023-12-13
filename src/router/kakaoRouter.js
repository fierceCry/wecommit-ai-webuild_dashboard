const express = require('express');
const kakaoController = require('../controllers/kakaoController');

const kakaoRouter = express.Router();

kakaoRouter.get('/kakao-sign-in', kakaoController.kakaoSignIn);
kakaoRouter.get('/kakao-sign-up', kakaoController.kakaoSignUp);
module.exports = { kakaoRouter };
