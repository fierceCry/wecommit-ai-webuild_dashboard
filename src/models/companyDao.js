const { AppDataSource } = require("./dataSource");

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
  try {
    const result = await AppDataSource.query(
      `
        INSERT INTO company_info
        (
            name,
            businessType,
            industryType,
            businessExperience,
            isFemale,
            revenueScale,
            location,
            numberOfEmployees,
            ageOfRepresentative

        )VALUES(
            ?,?,?,?,?,?,?,?,?
        )`,
      [
        name,
        businessType,
        industryType,
        businessExperience,
        isFemale,
        revenueScale,
        location,
        numberOfEmployees,
        ageOfRepresentative,
      ]
    );
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;

    throw error;
  }
};

module.exports = {
  createCompanyInfo,
};
