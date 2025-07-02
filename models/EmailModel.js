const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send OTP" };
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
