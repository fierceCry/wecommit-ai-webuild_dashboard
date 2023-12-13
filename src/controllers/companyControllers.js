const companyService = require("../services/companyServices");
const { catchAsync } = require("../utils/error");

const getcompanyInfo = catchAsync(async (req, res) => {
  const {
    name,
    businessType,
    industryType,
    businessExperience,
    isFemale,
    revenueScale,
    location,
    numberOfEmployees,
    ageOfRepresentative,
  } = req.body;
  if (
    !name ||
    !businessType ||
    !industryType ||
    !businessExperience ||
    !isFemale ||
    !revenueScale
  ) {
    const error = new Error("KEY_ERROR");
    error.statusCode = 400;

    throw error;
  }

  await companyService.createCompanyInfo(
    name,
    businessType,
    industryType,
    businessExperience,
    isFemale,
    revenueScale,
    location,
    numberOfEmployees,
    ageOfRepresentative
  );

  res.status(200).json({ message: "Successful Saved Your Company Info Data" });
});
module.exports = {
  getcompanyInfo,
};
