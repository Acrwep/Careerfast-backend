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
    professional,
    is_email_verified,
    user_type
  ) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // Update profile image
      const [personal] = await conn.query(
        `UPDATE users SET profile_image = ?, is_email_verified = ?, user_type = ? WHERE id = ?`,
        [profile_image, is_email_verified, user_type, user_id]
      );

      // insert user address
      const [address_result] = await conn.query(
        `INSERT INTO user_address (user_id, address1, city, state, country, pincode, created_date) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        [user_id, address, city, state, country, pincode, new Date()]
      );

      if (professional.length > 0) {
        professional.map(async (p) => {
          // Insert user professional
          await conn.query(
            `INSERT INTO user_professional (user_id, experince_type, total_years, total_months, job_title, company_name, designation, start_date, end_date, currently_working, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user_id,
              p.experience_type,
              p.total_years,
              p.total_months,
              p.job_title,
              p.company_name,
              p.designation,
              p.start_date,
              p.end_date,
              p.currently_working,
              JSON.stringify(p.skills),
            ]
          );
        });
      }

      const [social_links] = await conn.query(
        `INSERT INTO user_social_links (user_id) VALUES(?)`,
        user_id
      );

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw new Error(error.message);
    } finally {
      conn.release();
    }
  },

  updateSocialLinks: async (
    linkedin,
    facebook,
    instagram,
    twitter,
    dribble,
    behance,
    user_id
  ) => {
    try {
      const [result] = await pool.query(
        `UPDATE user_social_links SET linkedin = ?, facebook = ?, instagram = ?, twitter = ?, dribble = ?, behance = ? WHERE user_id = ?`,
        [linkedin, facebook, instagram, twitter, dribble, behance, user_id]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getUserAppliedJobs: async (userId) => {
    const query = `
  SELECT 
    applied_jobs.id AS applied_job_id,
    job_post.id AS post_id,
    job_post.*,
    CASE WHEN job_post.is_closed = 1 THEN 1 ELSE 0 END AS is_closed
  FROM applied_jobs
  JOIN job_post ON applied_jobs.postId = job_post.id
  WHERE applied_jobs.userId = ?
`;

    const values = [userId];

    try {
      const [result] = await pool.query(query, values);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateUserAppliedJobStatus: async (post_id, user_id, status) => {
    const get_appliedjob_query = `SELECT * FROM applied_jobs WHERE postId = ? AND userId = ?`;
    const appliedjob_value = [post_id, user_id];

    try {
      const [appliedjob_data] = await pool.query(
        get_appliedjob_query,
        appliedjob_value
      );
      const appliedjob_id = appliedjob_data[0].id;

      const query = `INSERT INTO applied_job_status_history (applied_job_id, status) VALUES(?,?)`;
      const values = [appliedjob_id, status];

      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getUserJobPostStatus: async (applied_job_id) => {
    const query = `SELECT * FROM applied_job_status_history WHERE applied_job_id = ?`;
    const values = [applied_job_id];

    try {
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getUserType: async () => {
    try {
      const [result] = await pool.query(
        `SELECT id, name FROM user_type WHERE is_deleted = 0 ORDER BY name`
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateBasicDetails: async (
    first_name,
    last_name,
    gender,
    user_type,
    classes,
    location,
    course,
    start_year,
    end_year,
    user_id
  ) => {
    try {
      const query = `UPDATE users SET first_name = ?, last_name = ?, gender = ?, user_type = ?, class = ?, location = ?, course = ?, start_year = ?, end_year = ? WHERE id = ?`;
      const params = [
        first_name,
        last_name,
        gender,
        user_type,
        classes,
        location,
        course,
        start_year,
        end_year,
        user_id,
      ];
      const [result] = await pool.query(query, params);
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateEducation: async (
    qualification,
    board,
    course,
    specialization,
    college,
    start_date,
    end_date,
    course_type,
    percentage,
    cgpa,
    roll_number,
    lateral_entry,
    skills,
    description,
    user_id,
    id
  ) => {
    try {
      const updateQuery = `UPDATE user_education SET qualification = ?, board = ?, course = ?, specialization = ?, college = ?, start_date = ?, end_date = ?, course_type = ?, percentage = ?, cgpa = ?, roll_number = ?, lateral_entry = ?, skills = ?, description = ? WHERE user_id = ? AND id = ?`;
      const params = [
        qualification,
        board,
        course,
        specialization,
        college,
        start_date,
        end_date,
        course_type,
        percentage,
        cgpa,
        roll_number,
        lateral_entry,
        skills,
        description,
        user_id,
        id,
      ];
      const result = await pool.query(updateQuery, params);
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
