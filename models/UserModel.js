const pool = require("../config/dbConfig");
const bcrypt = require("bcrypt");

const UserModel = {
  getUsers: async () => {
    try {
      const query = `SELECT * FROM users`;
      const [users] = await pool.query(query);
      return users;
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },

  createUser: async (
    first_name,
    last_name,
    phone_code,
    phone,
    email,
    password,
    organization,
    organization_type_id,
    role_id
  ) => {
    try {
      const [isPhoneExists] = await pool.query(
        `SELECT id FROM users WHERE phone_code = ? AND phone = ?`,
        [phone_code, phone]
      );
      if (isPhoneExists.length > 0)
        throw new Error("Phone number already exists!");

      const [isEmailExists] = await pool.query(
        `SELECT id FROM users WHERE email = ?`,
        [email]
      );
      if (isEmailExists.length > 0) throw new Error("Email already exists!");
      const hashedPassword = await hashPassword(password);
      const query = `INSERT INTO users (first_name, last_name, phone_code, phone, email, password, organization, organization_type_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [user] = await pool.query(query, [
        first_name,
        last_name,
        phone_code,
        phone,
        email,
        hashedPassword,
        organization,
        organization_type_id,
        role_id,
      ]);
      return user.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateUser: async (id, name, email, gender, password) => {
    try {
      const query = `UPDATE users SET name = ?, email = ?, gender = ?, password = ? WHERE id = ?`;
      const [user] = await pool.query(query, [
        name,
        email,
        gender,
        password,
        id,
      ]);
      return user.affectedRows;
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  },

  deleteUser: async (id) => {
    try {
      const query = `DELETE FROM users WHERE id = ?`;
      const [user] = await pool.query(query, [id]);
      return user.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  forgotPassword: async (email, password) => {
    try {
      const hashedPassword = await hashPassword(password);
      const [result] = await pool.query(
        `UPDATE users SET password = ? WHERE email = ?`,
        [email, hashedPassword]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

// 🔐 Encrypt (Hash) Password
const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

module.exports = UserModel;
