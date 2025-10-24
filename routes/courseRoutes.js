const express = require("express");
const { addCourse, getCourses } = require("../controllers/CourseController");

const router = express.Router();

// POST new course (Base64)
router.post("/", addCourse);

// GET all courses
router.get("/", getCourses);

module.exports = router;
