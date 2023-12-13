const { AppDataSource } = require("./dataSource");

const createGoogleUser = async (hashedGoogleId, social, name, email) => {
  try {
    const result = await AppDataSource.query(
      `INSERT INTO users
        (
            password,
            socialName,
            userName,
            Email
        )VALUES (
          ?,?,?,?
          )
          `,
      [hashedGoogleId, social, name, email]
    );
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;

    throw error;
  }
};

const getUserByEmail = async (email, social) => {
  try {
    const [getEmail] = await AppDataSource.query(
      `SELECT id,Email
      FROM users
      WHERE
      Email = ? AND
      socialName = ?
            `,
      [email, social]
    );
    return getEmail;
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;
    throw error;
  }
};

const createUser = async (email) => {
  try {
    const [result] = await AppDataSource.query(
      `
      SELECT
      id,
      userName,
      brithday,
      gender,
      phoneNumber,
      userEmail,
      password,
      Email,
      socialName
      FROM users
      WHERE Email = ?
      `,
      [email]
    );
    return result;
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  createGoogleUser,
  getUserByEmail,
  createUser
};
