const CourseModel = require("../models/CourseModel");

const addCourse = async (req, res) => {
    try {
        const { title, description, link, imageBase64 } = req.body;

        if (!title || !description || !link || !imageBase64) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await CourseModel.create(
            title,
            description,
            link,
            imageBase64
        );

        if (result.success) {
            res.status(201).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error while adding course",
            details: error.message,
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const result = await CourseModel.getAll();
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching courses",
            details: error.message,
        });
    }
};

module.exports = {
    addCourse,
    getCourses,
};
