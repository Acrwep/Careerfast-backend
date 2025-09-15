const admin = require("firebase-admin");
const pool = require("../config/dbConfig.js"); // DB connection

const applyJob = async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res
      .status(400)
      .json({ success: false, error: "postId and userId are required" });
  }

  try {
    // 1️⃣ Get recruiter who posted this job
    const [rows] = await pool.query(
      `SELECT u.id as recruiter_id, u.fcm_token, u.first_name, u.last_name, u.email
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

    const recruiterId = rows[0].recruiter_id;

    // 2️⃣ Insert job application with recruiter_id
    await pool.query(
      `INSERT INTO job_applications (post_id, user_id, recruiter_id, applied_at) VALUES (?, ?, ?, NOW())`,
      [postId, userId, recruiterId]
    );

    // 3️⃣ Send notification if recruiter has FCM token
    if (rows[0].fcm_token) {
      const [cand] = await pool.query(
        `SELECT first_name, last_name FROM users WHERE id = ?`,
        [userId]
      );

      const candidateName = cand[0]
        ? `${cand[0].first_name} ${cand[0].last_name}`
        : "A candidate";

      const messagePayload = {
        notification: {
          title: "New Job Application 🚀",
          body: `${candidateName} has applied for your job.`,
        },
        token: rows[0].fcm_token,
      };

      await admin.messaging().send(messagePayload);
    }

    res.json({
      success: true,
      message: "Application submitted & recruiter notified",
    });
  } catch (error) {
    console.error("❌ Error applying job:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { applyJob };
