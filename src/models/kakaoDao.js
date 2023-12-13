const { AppDataSource } = require('./dataSource');

const getUserByEmail = async (email) => {
  try {
    const user = await AppDataSource.query(
      `
    SELECT
      u.email,
      u.nickname,
      u.profile_image,
      mp.user_id AS userId,
      mp.member_grade_id AS memberGradeId,
      mp.height,
      mp.weight,
      mp.age,
      mp.gender,
      mp.point,
      mm.membership_id AS membershipId,
      mm.start_date AS startDate,
      mm.end_date AS endDate
    FROM users u
    LEFT JOIN member_profiles mp ON u.id = mp.user_id
    LEFT JOIN members_memberships mm ON u.id = mm.member_id
    WHERE u.email = ?;
  `,
      [email]
    );
    return user;
  } catch (err) {
    const error = new Error('dataSource Error');
    error.statusCode = 400;
    throw error;
  }
};

const addAdditionalInfo = async (nickname, social) => {
  try {
      await AppDataSource.query(
      `INSERT INTO users
        (
          userName,
          socialName
        )VALUES (
          ?, ?)
          `,
      [nickname, social]
    );

  } catch{
    const error = new Error("dataSource Error");
    error.statusCode = 400;
    throw error;
  }
};

const getUserType = async (email) => {
  try {
    const [userType] = await AppDataSource.query(
      `SELECT 
        CASE 
          WHEN EXISTS(
            SELECT tf.user_id 
            FROM trainer_profiles tf 
            INNER JOIN users u ON tf.user_id = u.id
            WHERE u.email = ?
          ) THEN 'trainer' 
          WHEN EXISTS(
            SELECT mf.user_id 
            FROM member_profiles mf 
            INNER JOIN users u ON mf.user_id = u.id
            WHERE u.email = ?
          ) THEN 'member'
        END AS userType`,
      [email, email]
    );
    return userType;
  } catch (err) {
    const error = new Error('dataSource Error');
    error.statusCode = 400;
    throw error;
  }
};

const getGrade = async (userType, email) => {
  try {
    const [grade] = await AppDataSource.query(
      `
      SELECT 
      g.name AS grade 
      FROM users u 
      INNER JOIN ${userType}_profiles p ON u.id = p.user_id INNER JOIN ${userType}_grades g ON p.${userType}_grade_id = g.id WHERE u.email = ?`,
      [email]
    );
    return grade;
  } catch (err) {
    const error = new Error('dataSource Error');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  getUserByEmail,
  addAdditionalInfo,
  getUserType,
  getGrade
};
