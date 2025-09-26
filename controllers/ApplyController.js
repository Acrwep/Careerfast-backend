// controllers/ApplyController.js
const admin = require("firebase-admin");
const pool = require("../config/dbConfig.js");

const applyJob = async (req, res) => {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
        return res.status(400).json({
            success: false,
            error: "postId and userId are required",
        });
    }

    try {
        // 1️⃣ Get recruiter + job info
        const [rows] = await pool.query(
            `SELECT jp.job_title, u.fcm_token, u.id as recruiterId
             FROM job_post jp
             INNER JOIN users u ON jp.user_id = u.id
             WHERE jp.id = ?`,
            [postId]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                error: "Job or recruiter not found",
            });
        }

        const jobTitle = rows[0].job_title;
        const recruiterToken = rows[0].fcm_token;

        // 2️⃣ Get candidate info
        const [cand] = await pool.query(
            `SELECT first_name, last_name FROM users WHERE id = ?`,
            [userId]
        );
        const candidateName = cand[0]
            ? `${cand[0].first_name} ${cand[0].last_name}`
            : "A candidate";

        // 3️⃣ Send push to recruiter if token exists
        if (recruiterToken) {
            const message = {
                notification: {
                    title: "New Job Application 🚀",
                    body: `${candidateName} applied for your job: ${jobTitle}`,
                },
                webpush: {
                    notification: {
                        icon: "/favicon.png",
                        click_action: "https://careerfast.in/admin-profile",
                    },
                },
                token: recruiterToken,
            };

            try {
                await admin.messaging().send(message);
                console.log("✅ Recruiter notified:", recruiterToken);
            } catch (err) {
                console.error("❌ Recruiter notification failed:", err.message);
            }
        } else {
            console.warn("⚠️ Recruiter has no FCM token — ask them to log in once");
        }


        // 4️⃣ Respond to candidate
        res.json({
            success: true,
            message: "Application submitted. Recruiter notified.",
        });
    } catch (error) {
        console.error("❌ Error in applyJob notification:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { applyJob };
