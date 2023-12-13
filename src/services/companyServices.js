const companyDao = require("../models/companyDao");

const createCompanyInfo = async (
  name,
  businessType,
  industryType,
  businessExperience,
  isFemale,
  revenueScale,
  location,
  numberOfEmployees,
  ageOfRepresentative
) => {
  const getcompanyInfo = await companyDao.createCompanyInfo(
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
  return getcompanyInfo;
};

module.exports = {
  createCompanyInfo,
};
