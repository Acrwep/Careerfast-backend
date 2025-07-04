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
      let result;
      if (user.affectedRows > 0) {
        result = await pool.query(
          `SELECT * FROM users WHERE email = ? AND phone_code = ? AND phone = ?`,
          [email, phone_code, phone]
        );
      }

      return result;
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
      console.log(email, password);

      const hashedPassword = await hashPassword(password);
      console.log(hashedPassword);

      const [result] = await pool.query(
        `UPDATE users SET password = ? WHERE email = ?`,
        [hashedPassword, email]
      );
      console.log(result);

      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  insertProfile: async (
    profile_image,
    user_id,
    country,
    state,
    city,
    pincode,
    address,
    experience_type,
    total_years,
    total_months,
    job_title,
    company_name,
    designation,
    start_date,
    end_date,
    currently_working,
    skills,
    is_email_verified
  ) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // Update profile image
      const [personal] = await conn.query(
        `UPDATE users SET profile_image = ?, is_email_verified = ? WHERE id = ?`,
        [profile_image, is_email_verified, user_id]
      );

      // insert user address
      const [address_result] = await conn.query(
        `INSERT INTO user_address (user_id, address1, city, state, country, pincode, created_date) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        [user_id, address, city, state, country, pincode, new Date()]
      );

      // Insert user professional
      const [professional] = await conn.query(
        `INSERT INTO user_professional (user_id, experince_type, total_years, total_months, job_title, company_name, designation, start_date, end_date, currently_working, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          experience_type,
          total_years,
          total_months,
          job_title,
          company_name,
          designation,
          start_date,
          end_date,
          currently_working,
          JSON.stringify(skills),
        ]
      );

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw new Error(error.message);
    } finally {
      conn.release();
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
