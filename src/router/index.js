const express = require("express");
const routes = express.Router();

const { userRouter } = require("./userRouter");
const { googleRouter } = require("./googleRouter");
const { kakaoRouter } = require("./kakaoRouter");
const { companyRouter } = require("./companyRouter");

routes.use("/users", userRouter);
routes.use("/users", googleRouter);
routes.use("/users", kakaoRouter);
routes.use("/company", companyRouter);

module.exports = { routes };
