const pool = require("../config/dbConfig");
const bcrypt = require("bcrypt");

const LoginModel = {
  login: async (email, password) => {
    try {
      const query = `SELECT id, password FROM users WHERE email = ? AND is_active = 1`;
      const [isExists] = await pool.query(query, [email]);
      if (isExists.length == 0) throw new Error("Invalid email");
      const isMatch = await verifyPassword(password, isExists[0].password);
      if (!isMatch) throw new Error("Invalid password!");
      const [result] = await pool.query(
        `SELECT u.first_name, u.last_name, u.phone_code, u.phone, u.email, u.password, u.organization, o.name AS organization_type, u.is_active FROM users AS u INNER JOIN organization_type o ON u.organization_type_id = o.id WHERE u.id = ? AND u.is_active = 1`,
        isExists[0].id
      );

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

// 🔐 Verify Password
const verifyPassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = LoginModel;
