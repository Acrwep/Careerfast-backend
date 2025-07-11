const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");
const RoleController = require("../controllers/RoleController");
const OrganizationController = require("../controllers/OrganizationController");
const { verifyToken } = require("../Validation/Validation");
const JobsController = require("../controllers/JobsController");
const { jobPosting } = require("../models/JobsModel");
const EmailController = require("../controllers/EmailController");

// Login module APIs
router.post("/login", LoginController.login);

// User module APIs
router.get("/getUsers", userController.getUsers);
router.post("/createUser", userController.createUser);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);
router.get("/userAppliedJobs", userController.getUserAppliedJobs);
router.put(
  "/updateUserAppliedJobStatus",
  userController.updateUserAppliedJobStatus
);
router.get("/getUserJobPostStatus", userController.getUserJobPostStatus);
// Role module APIs
router.get("/getRoles", RoleController.getRoles);

//Organization module APIs
router.get(
  "/organization/type/get",
  OrganizationController.getOrganizationTypes
);

//Job module APIs
router.post("/job/nature/add", verifyToken, JobsController.insertJobNature);
router.get("/job/getJobNature", verifyToken, JobsController.getJobNature);
router.post(
  "/job/workplace-type/add",
  verifyToken,
  JobsController.insertWorkPlaceType
);
router.get(
  "/job/workplace-type/get",
  verifyToken,
  JobsController.getWorkplaceType
);

router.get(
  "/job/workLocation/get",
  verifyToken,
  JobsController.getWorklocation
);

router.get(
  "/job/durationTypes/get",
  verifyToken,
  JobsController.getInternshipDuration
);

router.get("/getDuration", verifyToken, JobsController.getDurationPeriod);
router.get("/getBenefits", verifyToken, JobsController.getBenefits);
router.get("/getGender", verifyToken, JobsController.getGender);
router.get("/getEligibility", verifyToken, JobsController.getEligibility);
router.get("/getSalaryType", verifyToken, JobsController.getSalaryType);
router.post("/jobPosting", verifyToken, JobsController.jobPosting);
router.post("/applyforjob", verifyToken, JobsController.applyForJob);
router.get(
  "/getJobAppliedCandidates",
  verifyToken,
  JobsController.getJobAppliedCandidates
);
router.get(
  "/getJobPostByUserId",
  verifyToken,
  JobsController.getJobPostByUserId
);
router.get("/getYears", JobsController.getYears);
router.get("/getSkills", JobsController.getSkills);
router.get("/getJobCategories", JobsController.getJobCategories);
router.post("/getJobPosts", verifyToken, JobsController.getJobPosts);
router.put("/registrationClose", verifyToken, JobsController.registrationClose);

// Email verification
router.post("/sendOTP", EmailController.sendVerificationEmail);
router.post("/verifyOTP", EmailController.verifyOTP);
router.put("/forgotPassword", userController.forgotPassword);
router.post("/insertProfile", userController.insertProfile);
router.get("/getExperienceRange", JobsController.getExperienceRange);
router.put("/updateSocialLinks", verifyToken, userController.updateSocialLinks);
router.post("/insertProjects", verifyToken, JobsController.insertProjects);
router.put("/updateProject", verifyToken, JobsController.updateProject);
router.post("/VerifyEmail", EmailController.VerifyEmail);
router.put("/updateResume", verifyToken, JobsController.updateResume);
router.put("/updateSkills", verifyToken, JobsController.updateSkills);
router.put("/updateAbout", verifyToken, JobsController.updateAbout);
router.get("/getUserType", userController.getUserType);

router.get("/getClasses", JobsController.getClasses);
router.put(
  "/updateBasicDetails",
  verifyToken,
  userController.updateBasicDetails
);

router.put("/updateEducation", verifyToken, userController.updateEducation);
router.delete("/deleteEducation", verifyToken, userController.deleteEducation);
router.post("/insertEducation", verifyToken, userController.insertEducation);

router.put("/updateExperience", verifyToken, JobsController.updateExperience);
router.post("/insertExperience", verifyToken, JobsController.insertExperience);
router.delete(
  "/deleteExperience",
  verifyToken,
  JobsController.deleteExperience
);
router.get("/getUserProfile", verifyToken, userController.getUserProfile);

module.exports = router;
