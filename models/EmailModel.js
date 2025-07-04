const nodemailer = require("nodemailer");
const crypto = require("crypto");
const pool = require("../config/dbConfig");

// Generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_FROM, // Replace with your email
    pass: process.env.SMTP_PASS, // Replace with your email password or app password for Gmail
  },
});

// Store OTPs temporarily (in production, use Redis or database)
const otpStorage = new Map();

const sendVerificationEmail = async (email) => {
  try {
    const [is_email_exists] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );
    console.log("eee", is_email_exists);

    if (is_email_exists.length == 0) {
      throw new Error("The given email is not exists in the database");
    }

    const otp = generateOTP();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Email Verification OTP",
      text: `Your OTP for email verification is: ${otp}`,
      html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`,
    };

    // Store OTP with expiration (5 minutes)
    otpStorage.set(email, {
      otp,
      expiresAt: Date.now() + 300000, // 5 minutes
    });

    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyOTP = (email, userOTP) => {
  const storedData = otpStorage.get(email);

  if (!storedData) {
    return { success: false, message: "OTP expired or not found" };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStorage.delete(email);
    return { success: false, message: "OTP expired" };
  }

  if (storedData.otp === userOTP) {
    otpStorage.delete(email);
    return { success: true, message: "Email verified successfully" };
  }

  return { success: false, message: "Invalid OTP" };
};

module.exports = { sendVerificationEmail, verifyOTP };
