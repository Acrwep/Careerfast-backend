const pool = require("../config/dbConfig");

const JobsModel = {
  insertJobNature: async (nature_name) => {
    try {
      const [isExists] = await pool.query(
        `SELECT id FROM job_nature WHERE name = ? AND is_active = 1`,
        nature_name
      );
      if (isExists.length > 0) throw new Error("Job nature is already exists");
      const [result] = await pool.query(
        `INSERT INTO job_nature(name) VALUES(?)`,
        nature_name
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getJobNature: async () => {
    try {
      const [natures] = await pool.query(
        `SELECT id, name FROM job_nature WHERE is_active = 1 ORDER BY id`
      );

      return natures;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  insertWorkPlaceType: async (workplace) => {
    try {
      const [isExists] = await pool.query(
        `SELECT id FROM workplace_type WHERE name = ? AND is_active = 1`,
        workplace
      );
      if (isExists.length > 0) throw new Error("Workplace is already exists");
      const [result] = await pool.query(
        `INSERT INTO workplace_type(name) VALUES(?)`,
        workplace
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getWorkplaceType: async () => {
    try {
      const [natures] = await pool.query(
        `SELECT id, name FROM workplace_type WHERE is_active = 1 ORDER BY id`
      );

      return natures;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getWorklocation: async () => {
    try {
      const [locations] = await pool.query(
        `SELECT id, name FROM work_location WHERE is_active = 1 ORDER BY id`
      );

      return locations;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getInternshipDuration: async () => {
    try {
      const [durationTypes] = await pool.query(
        `SELECT id, name FROM internship_duration WHERE is_active = 1 ORDER BY id`
      );

      return durationTypes;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getDurationPeriod: async (duration_type_id) => {
    try {
      console.log("duration_type_id", duration_type_id);

      const [durationPeriod] = await pool.query(
        `SELECT id, duration_type_id, duration FROM duration_period WHERE duration_type_id = ? AND is_active = 1 ORDER BY id`,
        [duration_type_id]
      );

      return durationPeriod;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getBenefits: async () => {
    try {
      const [benefits] = await pool.query(
        `SELECT id, name, logo FROM benefits WHERE is_active = 1 ORDER BY id`
      );

      return benefits;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getGender: async () => {
    try {
      const [genders] = await pool.query(
        `SELECT id, name FROM gender WHERE is_active = 1 ORDER BY id`
      );

      return genders;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getEligibility: async () => {
    try {
      const [eligibility] = await pool.query(
        `SELECT id, name FROM eligibility_type WHERE is_active = 1 ORDER BY id`
      );

      return eligibility;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getSalaryType: async () => {
    try {
      const [salaryType] = await pool.query(
        `SELECT id, name FROM salary_type WHERE is_active = 1 ORDER BY id`
      );

      return salaryType;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  jobPosting: async (
    user_id,
    company_name,
    company_logo,
    job_title,
    job_nature,
    duration_period,
    workplace_type,
    work_location,
    job_category,
    skills,
    experience_type,
    experience_required,
    salary_type,
    salary_figure,
    diversity_hiring,
    benefits,
    job_description,
    openings,
    created_at
  ) => {
    try {
      const query = `INSERT INTO job_post(
                        user_id,
                        company_name,
                        company_logo,
                        job_title,
                        job_nature,
                        duration_period,
                        workplace_type,
                        work_location,
                        job_category,
                        skills,
                        experience_type,
                        experience_required,
                        salary_type,
                        salary_figure,
                        diversity_hiring,
                        benefits,
                        job_description,
                        openings,
                        created_at
                    )
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const values = [
        user_id,
        company_name,
        company_logo,
        job_title,
        job_nature,
        JSON.stringify(duration_period),
        workplace_type,
        work_location,
        JSON.stringify(job_category),
        JSON.stringify(skills),
        experience_type,
        JSON.stringify(experience_required),
        salary_type,
        salary_figure,
        JSON.stringify(diversity_hiring),
        JSON.stringify(benefits),
        job_description,
        openings,
        created_at,
      ];
      console.log("Values", values);

      const [result] = await pool.query(query, values);
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = JobsModel;
