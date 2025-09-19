const admin = require("../config/firebase");

// ✅ Send notification to a single token (already done)
const sendAppliedNotification = async (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res
            .status(400)
            .json({ error: "token, title, and body are required" });
    }

    const message = {
        notification: { title, body },
        token,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Notification sent successfully:", response);
        res.json({ success: true, response });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Subscribe a token to "allUsers" topic
const subscribeToTopic = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: "token is required" });
    }

    try {
        await admin.messaging().subscribeToTopic(token, "allUsers");
        console.log(`Token subscribed to allUsers topic: ${token}`);
        res.json({ success: true, message: "Subscribed to allUsers topic" });
    } catch (error) {
        console.error("Error subscribing to topic:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Send notification to all "allUsers"
const sendTopicNotification = async (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: "title and body are required" });
    }

    const message = {
        notification: { title, body },
        topic: "allUsers",
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Broadcast notification sent:", response);
        res.json({ success: true, response });
    } catch (error) {
        console.error("Error sending topic notification:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    sendAppliedNotification, // single token
    subscribeToTopic, // subscribe to topic
    sendTopicNotification, // broadcast to all
};
