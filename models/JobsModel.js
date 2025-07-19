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

  getJobAppliedCandidates: async (post_id) => {
    const query = `
    SELECT 
      job_post.id AS postId,
      job_post.job_title,
      job_post.company_name,
      job_post.job_nature,
      job_post.duration_period,
      job_post.workplace_type,
      job_post.work_location,
      job_post.job_category,
      job_post.skills,
      job_post.experience_type,
      job_post.experience_required,
      job_post.salary_type,
      job_post.min_salary,
      job_post.max_salary,
      job_post.diversity_hiring,
      job_post.benefits,
      job_post.job_description,
      job_post.openings,
      job_post.working_days,
      job_post.created_at AS post_created_at,
      users.id AS user_id,
      users.first_name,
      users.last_name,
      users.email,
      users.phone_code,
      users.phone,
      users.profile_image
    FROM job_post
    LEFT JOIN applied_jobs ON applied_jobs.postId = job_post.id
    LEFT JOIN users ON users.id = applied_jobs.userId
    WHERE job_post.id = ?
  `;

    const values = [post_id];

    try {
      const [rows] = await pool.query(query, values);

      if (rows.length === 0) return null;

      const post_questions_query = `SELECT * FROM job_post_questions WHERE post_id= ?`;
      const post_questions_values = [post_id];

      const [post_questions] = await pool.query(
        post_questions_query,
        post_questions_values
      );

      const post_answers_query = `SELECT * FROM job_post_answers WHERE postId= ?`;
      const post_answers_values = [post_id];

      const [post_answers] = await pool.query(
        post_answers_query,
        post_answers_values
      );

      const filterQuestionAnswerList = post_questions.flatMap((q) => {
        return post_answers
          .filter((a) => a.questionId === q.id)
          .map((a) => ({
            question: q.question,
            answer: a.answer,
            user_id: a.userId,
          }));
      });

      const postData = rows.map((item) => {
        return {
          ...item,
          duration_period: JSON.parse(item.duration_period),
          skills: JSON.parse(item.skills),
          experience_required: JSON.parse(item.experience_required),
          diversity_hiring: JSON.parse(item.diversity_hiring),
          job_category: JSON.parse(item.job_category),
          benefits: JSON.parse(item.benefits),
          users: rows
            .filter((row) => row.user_id) // filter out nulls if no users applied
            .map((row) => ({
              id: row.user_id,
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.email,
              phone: row.phone,
              candidateAnswersForRecruiterQuestions:
                filterQuestionAnswerList.filter(
                  (f) => f.user_id === row.user_id
                ),
            })),
        };
      });
      return postData;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getJobPostByUserId: async (user_id) => {
    const query = `
  SELECT 
    *, 
    CASE 
      WHEN job_post.is_closed = 1 THEN 1 
      ELSE 0 
    END AS is_closed 
  FROM job_post 
  WHERE user_id = ?;
`;

    const values = [user_id];

    try {
      const [result] = await pool.query(query, values);
      return result;
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

      const questionQuery = `SELECT id, post_id, question, CASE WHEN isrequired = 1 THEN 1 ELSE 0 END AS isrequired FROM job_post_questions WHERE post_id = ? ORDER BY created_at ASC`;

      const processedPosts = await Promise.all(
        posts.map(async (post) => {
          const [questions] = await pool.query(questionQuery, [post.id]);

          return {
            ...post,
            duration_period: safeParseArray(post.duration_period),
            job_category: safeParseArray(post.job_category),
            skills: safeParseArray(post.skills),
            experience_required: safeParseArray(post.experience_required),
            diversity_hiring: safeParseArray(post.diversity_hiring),
            benefits: safeParseArray(post.benefits),
            working_days: post.working_days || null,
            questions,
          };
        })
      );

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

  insertProjects: async (
    user_id,
    company_name,
    project_title,
    project_type,
    start_date,
    end_date,
    description
  ) => {
    try {
      const projectQuery = `INSERT INTO user_projects(
                                    user_id,
                                    company_name,
                                    project_title,
                                    project_type,
                                    start_date,
                                    end_date,
                                    description
                                ) VALUES(?, ?, ?, ?, ?, ?, ?)`;
      const projectValue = [
        user_id,
        company_name,
        project_title,
        project_type,
        start_date,
        end_date,
        description,
      ];

      await pool.query(projectQuery, projectValue);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateProject: async (
    company_name,
    project_title,
    project_type,
    start_date,
    end_date,
    description,
    id
  ) => {
    try {
      const [chechId] = await pool.query(
        `SELECT id FROM user_projects WHERE id = ?`,
        [id]
      );
      if (chechId.length === 0) {
        throw new Error("Invalid Id");
      }

      const updateQuery = `UPDATE user_projects SET
                              company_name = ?,
                              project_title = ?,
                              project_type = ?,
                              start_date = ?,
                              end_date = ?,
                              description = ?
                          WHERE id = ?`;
      const [result] = await pool.query(updateQuery, [
        company_name,
        project_title,
        project_type,
        start_date,
        end_date,
        description,
        id,
      ]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateResume: async (resumeBase64, id) => {
    try {
      const [updateResume] = await pool.query(
        `UPDATE users SET resume = ? WHERE id = ?`,
        [resumeBase64, id]
      );
      return updateResume.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateSkills: async (skills, user_id) => {
    try {
      const [skill] = await pool.query(
        `UPDATE users SET skills = ? WHERE id = ?`,
        [JSON.stringify(skills), user_id]
      );
      return skill.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateAbout: async (about, user_id) => {
    try {
      const [result] = await pool.query(
        `UPDATE users SET about = ? WHERE id = ?`,
        [about, user_id]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getClasses: async () => {
    try {
      const classes = [];
      for (let i = 1; i <= 12; i++) {
        classes.push(i);
      }
      return classes;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateExperience: async (
    job_title,
    company_name,
    designation,
    start_date,
    end_date,
    currently_working,
    skills,
    id,
    user_id
  ) => {
    try {
      const [chechId] = await pool.query(
        `SELECT id FROM user_professional WHERE id = ?`,
        [id]
      );
      if (chechId.length === 0) {
        throw new Error("Invalid Id");
      }
      const updateQuery = `UPDATE user_professional SET
                              job_title = ?,
                              company_name = ?,
                              designation = ?,
                              start_date = ?,
                              end_date = ?,
                              currently_working = ?,
                              skills = ?
                          WHERE id = ? AND user_id = ?`;
      const values = [
        job_title,
        company_name,
        designation,
        start_date,
        end_date,
        currently_working,
        JSON.stringify(skills),
        id,
        user_id,
      ];
      const [result] = await pool.query(updateQuery, values);
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  insertExperience: async (user_id, experiences) => {
    try {
      if (experiences.length >= 1) {
        experiences.map(async (e) => {
          const insertQuery = `INSERT INTO user_professional(
                              user_id,
                              job_title,
                              company_name,
                              designation,
                              start_date,
                              end_date,
                              currently_working,
                              skills
                          )
                          VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
          const values = [
            user_id,
            e.job_title,
            e.company_name,
            e.designation,
            e.start_date,
            e.end_date,
            e.currently_working,
            JSON.stringify(e.skills),
          ];
          await pool.query(insertQuery, values);
        });
      }

      // return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteExperience: async (id) => {
    try {
      const [result] = await pool.query(
        `DELETE FROM user_professional WHERE id = ?`,
        id
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getQualification: async () => {
    try {
      const [qualifications] = await pool.query(
        `SELECT id, name FROM qualification WHERE is_deleted = 0`
      );
      return qualifications;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getCourses: async () => {
    try {
      const [courses] = await pool.query(
        `SELECT id, name FROM course_master WHERE is_deleted = 0`
      );
      return courses;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getSpecialization: async () => {
    try {
      const [specializations] = await pool.query(
        `SELECT id, name FROM specialization_master WHERE is_deleted = 0`
      );
      return specializations;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getColleges: async () => {
    try {
      const [colleges] = await pool.query(
        `SELECT id, name, city, state, university FROM college_master WHERE is_deleted = 0`
      );
      return colleges;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getCourseType: async () => {
    const types = ["Part-time", "Full-time", "Distance Learning"];
    return types;
  },

  deleteProject: async (id) => {
    try {
      const [result] = await pool.query(
        `DELETE FROM user_projects WHERE id = ?`,
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  saveJobPost: async (user_id, job_post_id) => {
    try {
      const insertQuery = `INSERT INTO user_saved_jobs (user_id, job_post_id, created_date) VALUES (?, ?, ?)`;
      const values = [user_id, job_post_id, new Date()];
      const [result] = await pool.query(insertQuery, values);
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getSavedJobs: async (user_id) => {
    try {
      const query = `SELECT
                        sj.id,
                        sj.user_id,
                        sj.job_post_id,
                        jp.company_name,
                        jp.company_logo,
                        jp.job_title
                    FROM
                        user_saved_jobs sj
                    INNER JOIN job_post jp ON
                      sj.job_post_id = jp.id
                    WHERE
                        sj.user_id = ?
                    ORDER BY sj.created_date`;
      const [savedJobs] = await pool.query(query, [user_id]);
      return savedJobs;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  removeSavedJobs: async (id) => {
    try {
      const [result] = await pool.query(
        `DELETE FROM user_saved_jobs WHERE id = ?`,
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = JobsModel;
