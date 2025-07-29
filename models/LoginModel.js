const pool = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");

const LoginModel = {
  login: async (email, password, role_id) => {
    try {
      const [checkRole] = await pool.query(
        `SELECT role_id FROM users WHERE email = ?`,
        [email]
      );
      if (role_id != checkRole[0].role_id) {
        throw new Error("You are not allowed to login");
      }

      const query = `SELECT id, password FROM users WHERE email = ? AND is_active = 1`;
      const [isExists] = await pool.query(query, [email]);
      if (isExists.length == 0) throw new Error("Invalid email");
      const isMatch = await verifyPassword(password, isExists[0].password);
      if (!isMatch) throw new Error("Invalid password!");
      const [result] = await pool.query(
        `SELECT u.id, u.first_name, u.last_name, u.phone_code, u.phone, u.email, u.password, u.organization, o.name AS organization_type, u.is_active, u.role_id, r.name AS role_name FROM users AS u INNER JOIN role AS r ON u.role_id = r.id LEFT JOIN organization_type o ON u.organization_type_id = o.id WHERE u.id = ? AND u.is_active = 1`,
        isExists[0].id
      );

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  dailyStreak: async (user_id) => {
    try {
      const now = moment().tz("Asia/Kolkata");
      const today = now.format("YYYY-MM-DD");
      const created_at = now.format("YYYY-MM-DD HH:mm:ss");
      const [result] = await pool.query(
        `INSERT IGNORE INTO user_daily_usage (user_id, usage_date, created_at) VALUES (?, ?, ?)`,
        [user_id, today, created_at]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getDailyStreak: async (user_id) => {
    try {
      const [rows] = await pool.query(
        `SELECT usage_date FROM user_daily_usage 
     WHERE user_id = ? 
     ORDER BY usage_date DESC`,
        [user_id]
      );

      let streak = 0;
      const now = moment().tz("Asia/Kolkata");
      let today = now.clone().startOf("day");
      for (let row of rows) {
        const usageDate = moment(row.usage_date)
          .tz("Asia/Kolkata")
          .startOf("day");

        if (usageDate.isSame(today, "day")) {
          streak++;
          today.subtract(1, "day");
        } else if (usageDate.isSame(today.clone().subtract(1, "day"), "day")) {
          streak++;
          today.subtract(1, "day");
        } else {
          break; // streak broken
        }
      }

      return {
        daily_log: rows,
        streak: streak,
      };
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
