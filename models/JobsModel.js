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
    min_salary,
    max_salary,
    diversity_hiring,
    benefits,
    job_description,
    openings,
    working_days,
    created_at,
    questions
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
                        min_salary,
                        max_salary,
                        diversity_hiring,
                        benefits,
                        job_description,
                        openings,
                        working_days,
                        created_at
                    )
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
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
        min_salary,
        max_salary,
        JSON.stringify(diversity_hiring),
        JSON.stringify(benefits),
        job_description,
        openings,
        working_days,
        created_at,
      ];
      console.log("questions", questions);
      const [result] = await pool.query(query, values);

      const lastJobPostId = result?.insertId;
      //insert post questions

      if (questions.length >= 1) {
        questions.map(async (q) => {
          const postQuestionQuery = `INSERT INTO job_post_questions(post_id,question,isrequired) VALUES(?,?,?)`;
          const postQuestionsValues = [lastJobPostId, q.question, q.isrequired];

          await pool.query(postQuestionQuery, postQuestionsValues);
        });
      }

      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  applyForJob: async (postId, userId, answers) => {
    try {
      const query = `INSERT INTO applied_jobs(postId,userId)VALUES(?,?)`;
      const values = [postId, userId];

      const [result] = await pool.query(query, values);

      if (answers.length >= 1) {
        answers.map(async (item) => {
          const query = `INSERT INTO job_post_answers (postId,userId,questionId,answer) VALUES(?,?,?,?)`;
          const values = [postId, userId, item.questionId, item.answer];

          await pool.query(query, values);
        });
      }
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getYears: async () => {
    try {
      const [years] = await pool.query(
        `SELECT id, year FROM year_master ORDER BY id`
      );

      return years;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getSkills: async () => {
    try {
      const [skills] = await pool.query(
        `SELECT
            id,
            name
        FROM
            skills
        ORDER BY CASE WHEN name
            = 'Others' THEN 1 ELSE 0
        END,
        name`
      );
      return skills;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getJobCategories: async () => {
    try {
      const [categories] = await pool.query(
        `SELECT id, category_name FROM job_categories WHERE is_active = 1 ORDER BY CASE WHEN category_name = 'Others' THEN 1 ELSE 0 END, category_name`
      );
      return categories;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getJobPosts: async (filters = {}) => {
    try {
      let query = `SELECT
                      id,
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
                      min_salary,
                      max_salary,
                      diversity_hiring,
                      benefits,
                      job_description,
                      openings,
                      working_days,
                      created_at
                  FROM
                      job_post`;

      const whereClauses = [];
      const queryParams = [];

      // Workplace type filter
      if (filters.workplace_type) {
        whereClauses.push(`workplace_type = ?`);
        queryParams.push(filters.workplace_type);
      }

      // Workplace location filter
      if (filters.work_location) {
        whereClauses.push(`work_location = ?`);
        queryParams.push(filters.work_location);
      }

      // Working days filter
      if (filters.working_days) {
        whereClauses.push(`working_days = ?`);
        queryParams.push(filters.working_days);
      }

      // Date range filter
      if (filters.start_date && filters.end_date) {
        whereClauses.push(`DATE(created_at) BETWEEN ? AND ?`);
        queryParams.push(filters.start_date, filters.end_date);
      } else if (filters.start_date) {
        whereClauses.push(`DATE(created_at) >= ?`);
        queryParams.push(filters.start_date);
      } else if (filters.end_date) {
        whereClauses.push(`DATE(created_at) <= ?`);
        queryParams.push(filters.end_date);
      }

      // Job category filter (array of categories)
      // In your model where you build the query:
      if (filters.job_categories && filters.job_categories.length > 0) {
        whereClauses.push(`(
          ${filters.job_categories
            .map(() => `JSON_CONTAINS(job_category, ?)`)
            .join(" OR ")}
        )`);

        filters.job_categories.forEach((category) => {
          queryParams.push(JSON.stringify(category)); // Just the string, not array
        });
      }

      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(" AND ")}`;
      }

      // Salary sorting
      if (filters.salary_sort) {
        if (filters.salary_sort === "low_to_high") {
          query += ` ORDER BY COALESCE(min_salary, 0) ASC`;
        } else if (filters.salary_sort === "high_to_low") {
          query += ` ORDER BY COALESCE(max_salary, 0) DESC`;
        }
      } else {
        query += ` ORDER BY created_at DESC`;
      }

      const [posts] = await pool.query(query, queryParams);

      // Helper function to safely parse JSON arrays
      const safeParseArray = (str) => {
        try {
          return str ? JSON.parse(str) : [];
        } catch (e) {
          return [];
        }
      };

      const processedPosts = posts.map((post) => ({
        ...post,
        duration_period: safeParseArray(post.duration_period),
        job_category: safeParseArray(post.job_category),
        skills: safeParseArray(post.skills),
        experience_required: safeParseArray(post.experience_required),
        diversity_hiring: safeParseArray(post.diversity_hiring),
        benefits: safeParseArray(post.benefits),
        working_days: post.working_days || null,
      }));

      return {
        success: true,
        message: "Job posts fetched successfully",
        data: processedPosts,
        meta: {
          total: processedPosts.length,
          filters: filters,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  registrationClose: async (id) => {
    try {
      const [is_exists] = await pool.query(
        `SELECT id FROM job_post WHERE id = ? AND is_closed = 0`,
        id
      );
      if (is_exists.length == 0) {
        throw new Error("Invalid id");
      }

      const [result] = await pool.query(
        `UPDATE job_post SET is_closed = 1 WHERE id = ?`,
        id
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getExperienceRange: async () => {
    try {
      const [range] = await pool.query(
        `SELECT id, display_text, sort_order FROM experience_range WHERE is_active = 1 ORDER BY sort_order`
      );
      return range;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = JobsModel;
