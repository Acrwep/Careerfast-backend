const { request, response } = require("express");
const EmailModel = require("../models/EmailModel");

const sendVerificationEmail = async (request, response) => {
  const { email } = request.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const result = await EmailModel.sendVerificationEmail(email);
    if (result.success) {
      response.json({ message: result.message });
    } else {
      response.status(500).json({ error: result.message });
    }
  } catch (error) {
    response.status(500).send({
      message: "Error while sending email",
      details: error.message,
    });
  }
};

const verifyOTP = async (request, response) => {
  const { email, otp } = request.body;
  if (!email || !otp) {
    return response.status(400).json({ error: "Email and OTP are required" });
  }
  try {
    const result = await EmailModel.verifyOTP(email, otp);
    if (result.success) {
      response.status(200).send({ message: result.message });
    } else {
      response.status(400).json({ error: result.message });
    }
  } catch (error) {
    response.status(500).send({
      message: "Error verifying otp",
      details: error.message,
    });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyOTP,
};
