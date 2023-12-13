const express = require("express");
const companyRouter = express.Router();
const companyController = require("../controllers/companyControllers");

companyRouter.post("/add", companyController.getcompanyInfo);

module.exports = {
  companyRouter,
};
