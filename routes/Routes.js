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

module.exports = router;
