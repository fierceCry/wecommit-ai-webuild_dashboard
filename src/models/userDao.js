const { AppDataSource } = require("./dataSource");

const userById = async (userEmail) => {
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
          Email,
          password
          FROM users
        WHERE userEmail = ?
      `,
      [userEmail]
    );
    return result;
  } catch{
    const error = new Error("dataSource Error");
    error.statusCode = 400;
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const [result] = await AppDataSource.query(
      `
        SELECT 
          id,
          userName,
          phoneNumber,
          password
          FROM users
          WHERE id = ?
      `,
      [id]
    );
    return result;
  } catch {
    const error = new Error("dataSource id Error");
    error.statusCode = 400;
    throw error;
  }
};

const getUserIdByNamePhoneEmail = async (userName, phoneNumber) => {
  try {
    const [result] = await AppDataSource.query(
      `
        SELECT 
        id,
        userName,
        phoneNumber,
        userEmail
        FROM users
        WHERE userName = ? 
        AND phoneNumber = ? 
      `,
      [userName, phoneNumber]
    );
    return result;
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;
    throw error;
  }
};

const getUserIdByNamePhonePassword = async (userName, userEmail) => {
  try {
    const [result] = await AppDataSource.query(
      `
          SELECT 
          id,
          userName,
          phoneNumber,
          password
          FROM users
          WHERE userName = ? 
          AND userEmail = ? 
        `,
      [userName, userEmail]
    );
    return result;
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;
    throw error;
  }
};

const createUser = async (
  userName,
  brithday,
  gender,
  phoneNumber,
  userEmail,
  Email,
  password
) => {
  try {
    const result = await AppDataSource.query(
      `
        INSERT INTO users (
          userName,
          brithday,
          gender,
          phoneNumber,
          userEmail,
          Email,
          password
            ) VALUES (
            ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        userName,
        brithday,
        gender,
        phoneNumber,
        userEmail,
        Email,
        password,
      ]
    );

    return result;
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;

    throw error;
  }
};

const getUserByEmail = async (userEmail) => {
  try {
    const [result] = await AppDataSource.query(
      `
          SELECT id, userEmail
          FROM users
          WHERE userEmail = ?
          `,
      [userEmail]
    );
    return result;
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;
  }
};

const findUserByUsername = async (userEmail, userName, phoneNumber) => {
  try {
    const [result] = await AppDataSource.query(
      `
      SELECT
      id,
      userName,
      phoneNumber,
      password
      FROM users
      WHERE userEmail = ?
      AND userName = ?
      AND phoneNumber = ?
      `,
      [userEmail, userName, phoneNumber]
    );
    return result;
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;
    throw error;
  }
};

const updatePassword = async (userId, hashedPassword) => {
  try {
    const result = await AppDataSource.query(
      `
      UPDATE users
      SET
      password = ?
      WHERE id= ?
      `,
      [hashedPassword, userId]
    );
    return result;
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  userById,
  getUserById,
  getUserIdByNamePhoneEmail,
  getUserIdByNamePhonePassword,
  findUserByUsername,
  createUser,
  getUserByEmail,
  updatePassword,
};
