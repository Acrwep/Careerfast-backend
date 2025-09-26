// routes/tokenRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/dbConfig");

// 🔹 Save or update FCM token for a user
router.post("/save-token", async (req, res) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        return res.status(400).json({ error: "Missing userId or token" });
    }

    try {
        // Check if token is already the same
        const [rows] = await pool.query(
            "SELECT fcm_token FROM users WHERE id = ?",
            [userId]
        );

        if (rows.length && rows[0].fcm_token === token) {
            return res.json({
                success: true,
                message: "Token already up-to-date",
            });
        }

        // Update token
        await pool.query("UPDATE users SET fcm_token = ? WHERE id = ?", [
            token,
            userId,
        ]);

        res.json({ success: true, message: "Token saved successfully" });
    } catch (err) {
        console.error("❌ Error saving token:", err);
        res.status(500).json({ error: "Failed to save token" });
    }
});

module.exports = router;
