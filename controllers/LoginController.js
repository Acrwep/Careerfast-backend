const LoginModel = require("../models/LoginModel");
const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const login = async (request, response) => {
  const { email, password, role_id } = request.body;
  if (!email || !password || !role_id) {
    throw new Error("Please provide username and password");
  }
  try {
    const result = await LoginModel.login(email, password, role_id);
    if (result) {
      const token = generateToken(result);
      return response.status(200).json({
        message: "Login successful",
        token: token,
        data: result,
      });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    response.status(500).json({
      message: "Error while login",
      details: error.message,
    });
  }
};

const dailyStreak = async (request, response) => {
  const { user_id } = request.body;
  try {
    const result = await LoginModel.dailyStreak(user_id);
    return response.status(200).json({
      message: "Data inserted successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while inserting",
      details: error.message,
    });
  }
};

const getDailyStreak = async (request, response) => {
  const { user_id } = request.query;
  try {
    const streaks = await LoginModel.getDailyStreak(user_id);
    return response.status(200).json({
      message: "User streaks fetched successfully",
      data: streaks,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while fetching user streaks",
      details: error.message,
    });
  }
};

const changePassword = async (request, response) => {
  const { user_id, currentPassword, newPassword } = request.body;
  try {
    const result = await LoginModel.changePassword(
      user_id,
      currentPassword,
      newPassword
    );
    return response.status(200).json({
      message: "Password changed successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while changing password",
      details: error.message,
    });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, //Payload
    process.env.JWT_SECRET, // Secret
    { expiresIn: "1d" } // Token expires in 1 hour
  );
};

module.exports = {
  login,
  dailyStreak,
  getDailyStreak,
  changePassword,
};
