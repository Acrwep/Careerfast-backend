const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const EventController = require("../controllers/EventController");

const uploadDir = path.join(__dirname, "../uploads/events");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// ✅ ensure both file and text fields are available
router.post(
    "/",
    upload.single("logo"),
    express.urlencoded({ extended: true }),
    EventController.createEvent
);

router.get("/", EventController.getAllEvents);
router.delete("/:id", EventController.deleteEvent);

module.exports = router;
