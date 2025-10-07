const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const Routes = require("./routes/Routes");
const pool = require("./config/dbConfig"); // your MySQL connection pool

const app = express();

// =======================
// 🔧 Middleware Setup
// =======================
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000"], // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =======================
// 📁 Ensure Upload Directory Exists
// =======================
const uploadDir = path.join(__dirname, "uploads/events");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads/events directory");
}

// =======================
// 🌐 Serve Uploaded Files Publicly
// =======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// 🚀 API Routes
// =======================
app.use("/api", Routes);

// =======================
// 🔍 Health Check
// =======================
app.get("/", (req, res) => {
  res.status(200).send({ message: "✅ CareerFast backend running fine!" });
});

// =======================
// ❌ 404 Handler
// =======================
app.use((req, res) => {
  res.status(404).json({ message: "404 Not Found - Invalid route" });
});

// =======================
// 🧩 MySQL Connection Test
// =======================
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL database connected successfully!");
    connection.release();
  }
});

// =======================
// 🚀 Start Server
// =======================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`⚡ Server running at http://localhost:${PORT}`);
});
