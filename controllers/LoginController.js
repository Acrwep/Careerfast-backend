const LoginModel = require("../models/LoginModel");
const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

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

// controller
const dailyStreak = async (request, response) => {
  const { user_id } = request.body;
  try {
    // Step 1: Insert today’s usage (ignore if already exists)
    await LoginModel.dailyStreak(user_id);

    // Step 2: Get streak details
    const streakData = await LoginModel.getDailyStreak(user_id);

    // Step 3: Calculate max streak
    let maxStreak = 0;
    let currentStreak = streakData.streak;

    // Find max streak from daily_log
    if (streakData.daily_log.length > 0) {
      let count = 1;
      for (let i = 1; i < streakData.daily_log.length; i++) {
        const prev = moment(streakData.daily_log[i - 1].usage_date)
          .tz("Asia/Kolkata")
          .startOf("day");
        const curr = moment(streakData.daily_log[i].usage_date)
          .tz("Asia/Kolkata")
          .startOf("day");

        if (prev.diff(curr, "days") === 1) {
          count++;
        } else {
          maxStreak = Math.max(maxStreak, count);
          count = 1;
        }
      }
      maxStreak = Math.max(maxStreak, count);
    }

    return response.status(200).json({
      message: "Streak data fetched successfully",
      history: streakData.daily_log, // array of { usage_date }
      currentStreak,
      maxStreak,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while fetching streak",
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
