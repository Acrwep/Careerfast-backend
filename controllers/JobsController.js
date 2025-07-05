// const { use } = require("react");
const JobsModel = require("../models/JobsModel");
const { response, request } = require("express");

const insertJobNature = async (request, response) => {
  const { nature_name } = request.body;
  try {
    const result = await JobsModel.insertJobNature(nature_name);
    response.status(201).send({
      message: "Job nature inserted successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error inserting job nature",
      details: error.message,
    });
  }
};

const getJobNature = async (request, response) => {
  try {
    const natures = await JobsModel.getJobNature();
    response.status(200).send({
      message: "Job natures fetched successfully",
      data: natures,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching job nature",
      details: error.message,
    });
  }
};

const insertWorkPlaceType = async (request, response) => {
  const { workplace } = request.body;
  try {
    const result = await JobsModel.insertWorkPlaceType(workplace);
    response.status(201).send({
      message: "Workplace inserted successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error inserting workplace",
      details: error.message,
    });
  }
};

const getWorkplaceType = async (request, response) => {
  try {
    const workplaces = await JobsModel.getWorkplaceType();
    response.status(200).send({
      message: "Workplaces fetched successfully",
      data: workplaces,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching workplace",
      details: error.message,
    });
  }
};

const getWorklocation = async (request, response) => {
  try {
    const workLocation = await JobsModel.getWorklocation();
    response.status(200).send({
      message: "work location fetched successfully",
      data: workLocation,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching work location",
      details: error.message,
    });
  }
};

const getInternshipDuration = async (request, response) => {
  try {
    const durationTypes = await JobsModel.getInternshipDuration();
    response.status(200).send({
      message: "Internship duration type fetched successfully",
      data: durationTypes,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching internship duration type",
      details: error.message,
    });
  }
};

const getDurationPeriod = async (request, response) => {
  const { duration_type_id } = request.query;
  try {
    const durationPeriod = await JobsModel.getDurationPeriod(duration_type_id);
    response.status(200).send({
      message: "Duration fetched successfully",
      data: durationPeriod,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching duration",
      details: error.message,
    });
  }
};

const getBenefits = async (request, response) => {
  try {
    const benefits = await JobsModel.getBenefits();
    response.status(200).send({
      message: "Benefits fetched successfully",
      data: benefits,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching benefits",
      details: error.message,
    });
  }
};

const getGender = async (request, response) => {
  try {
    const genders = await JobsModel.getGender();
    response.status(200).send({
      message: "Benefits fetched successfully",
      data: genders,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching benefits",
      details: error.message,
    });
  }
};

const getEligibility = async (request, response) => {
  try {
    const eligibility = await JobsModel.getEligibility();
    response.status(200).send({
      message: "Benefits fetched successfully",
      data: eligibility,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching benefits",
      details: error.message,
    });
  }
};

const getSalaryType = async (request, response) => {
  try {
    const salaryType = await JobsModel.getSalaryType();
    response.status(200).send({
      message: "Benefits fetched successfully",
      data: salaryType,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching benefits",
      details: error.message,
    });
  }
};

const jobPosting = async (request, response) => {
  const {
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
    questions,
  } = request.body;
  const formattedDuration = Array.isArray(duration_period)
    ? duration_period
    : [duration_period];
  const formattedJobCategory = Array.isArray(job_category)
    ? job_category
    : [job_category];
  const formattedSkills = Array.isArray(skills) ? skills : [skills];
  const formattedExpReq = Array.isArray(experience_required)
    ? experience_required
    : [experience_required];
  const formattedDiversity = Array.isArray(diversity_hiring)
    ? diversity_hiring
    : [diversity_hiring];
  const formattedBenefits = Array.isArray(benefits) ? benefits : [benefits];
  const formatQuestions = Array.isArray(questions) ? questions : [questions];

  try {
    const result = await JobsModel.jobPosting(
      user_id,
      company_name,
      company_logo,
      job_title,
      job_nature,
      formattedDuration,
      workplace_type,
      work_location,
      formattedJobCategory,
      formattedSkills,
      experience_type,
      formattedExpReq,
      salary_type,
      min_salary,
      max_salary,
      formattedDiversity,
      formattedBenefits,
      job_description,
      openings,
      working_days,
      created_at,
      formatQuestions
    );
    return response.status(201).send({
      message: "Job posted successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error posting job",
      details: error.message,
    });
  }
};

const applyForJob = async (request, response) => {
  const { postId, userId, answers } = request.body;

  const formattedQuestions = Array.isArray(answers) ? answers : [answers];

  try {
    await JobsModel.applyForJob(postId, userId, formattedQuestions);
    return response.status(200).send({
      message: "Job applied successfully",
    });
  } catch (error) {
    response.status(500).send({
      message: "Error posting job",
      details: error.message,
    });
  }
};

const getJobAppliedCandidates = async (request, response) => {
  const { post_id } = request.query;

  try {
    const result = await JobsModel.getJobAppliedCandidates(post_id);
    return response.status(200).send({
      message: "job applied candidates fetched successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error posting job",
      details: error.message,
    });
  }
};

const getYears = async (request, response) => {
  try {
    const years = await JobsModel.getYears();
    response.status(200).send({
      message: "Years fetched successfully",
      data: years,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching years",
      details: error.message,
    });
  }
};

const getSkills = async (request, response) => {
  try {
    const skills = await JobsModel.getSkills();
    response.status(200).send({
      message: "Skills fetched successfully",
      data: skills,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching skills",
      details: error.message,
    });
  }
};

const getJobCategories = async (request, response) => {
  try {
    const categories = await JobsModel.getJobCategories();
    response.status(200).send({
      message: "Job categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching job categories",
      details: error.message,
    });
  }
};

const getJobPosts = async (request, response) => {
  const filters = {
    job_categories: request.body.job_categories
      ? request.body.job_categories
      : undefined,
    workplace_type: request.body.workplace_type,
    work_location: request.body.work_location,
    working_days: request.body.working_days,
    start_date: request.body.start_date,
    end_date: request.body.end_date,
    salary_sort: request.body.salary_sort,
  };

  try {
    const posts = await JobsModel.getJobPosts(filters);
    response.status(200).send({
      message: "Job posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching job posts",
      details: error.message,
    });
  }
};

const registrationClose = async (request, response) => {
  const { id } = request.body;
  try {
    const result = await JobsModel.registrationClose(id);
    response.status(200).send({
      message: "Registration closed successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error closing registration",
      details: error.message,
    });
  }
};

const getExperienceRange = async (request, response) => {
  try {
    const range = await JobsModel.getExperienceRange();
    response.status(200).send({
      message: "Experience range get successfully",
      data: range,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching experience range",
      details: error.message,
    });
  }
};

const insertProjects = async (request, response) => {
  const { user_id, projects } = request.body;
  if (!user_id || !projects?.length) {
    return res
      .status(400)
      .json({ error: "user_id and projects array are required" });
  }
  try {
    await userModel.insertProjects(user_id, projects);
    response.status(201).json({
      message: "Projects inserted successfully!",
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while inserting projects",
      details: error.message,
    });
  }
};

const updateProject = async (request, response) => {
  const {
    company_name,
    project_title,
    project_type,
    start_date,
    end_date,
    description,
    id,
  } = request.body;
  try {
    const result = await JobsModel.updateProject(
      company_name,
      project_title,
      project_type,
      start_date,
      end_date,
      description,
      id
    );
    response.status(200).send({
      message: "Updated successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while updating",
      details: error.message,
    });
  }
};

const updateResume = async (request, response) => {
  const { resume, id } = request.body;
  try {
    const result = await JobsModel.updateResume(resume, id);
    response.status(200).send({
      message: "Updated successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while updating",
      details: error.message,
    });
  }
};

const updateSkills = async (request, response) => {
  const { skills, user_id } = request.body;
  const formattedSkills = Array.isArray(skills) ? skills : [skills];
  try {
    const result = await JobsModel.updateSkills(formattedSkills, user_id);
    response.status(200).send({
      message: "Updated successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while updating",
      details: error.message,
    });
  }
};

const updateAbout = async (request, response) => {
  const { about, id } = request.body;
  try {
    const result = await JobsModel.updateAbout(about, id);
    response.status(200).send({
      message: "Updated successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while updating",
      details: error.message,
    });
  }
};

module.exports = {
  insertJobNature,
  getJobNature,
  insertWorkPlaceType,
  getWorkplaceType,
  getWorklocation,
  getInternshipDuration,
  getDurationPeriod,
  getBenefits,
  getGender,
  getEligibility,
  getSalaryType,
  jobPosting,
  applyForJob,
  getJobAppliedCandidates,
  getYears,
  getSkills,
  getJobCategories,
  getJobPosts,
  registrationClose,
  getExperienceRange,
  insertProjects,
  updateProject,
  updateResume,
  updateSkills,
  updateAbout,
};
