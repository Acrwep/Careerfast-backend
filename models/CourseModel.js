const db = require("../config/dbConfig");

const CourseModel = {
    create: async (title, description, link, imageBase64) => {
        const sql =
            "INSERT INTO courses (title, description, link, image) VALUES (?, ?, ?, ?)";
        try {
            const [result] = await db.execute(sql, [
                title,
                description,
                link,
                imageBase64, // ✅ store Base64 string
            ]);
            return { success: true, message: "Course added successfully", result };
        } catch (error) {
            console.error("DB Error:", error);
            return { success: false, message: "Database error" };
        }
    },

    getAll: async () => {
        try {
            const [rows] = await db.execute("SELECT * FROM courses ORDER BY id DESC");
            return { success: true, data: rows };
        } catch (error) {
            console.error("DB Error:", error);
            return { success: false, message: "Failed to fetch courses" };
        }
    },
};

module.exports = CourseModel;
