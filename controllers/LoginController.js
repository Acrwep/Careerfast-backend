const LoginModel = require("../models/LoginModel");
const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const pool = require("../config/dbConfig.js"); // adjust path to your db.js file

const login = async (request, response) => {
  const { email, password, role_id, fcm_token } = request.body;

  if (!email || !password || !role_id) {
    throw new Error("Please provide username and password");
  }

  try {
    const result = await LoginModel.login(email, password, role_id);

    if (result) {
      const token = generateToken(result);

      // ✅ Save FCM token in DB
      if (fcm_token) {
        await pool.query(`UPDATE users SET fcm_token = ? WHERE id = ?`, [
          fcm_token,
          result[0].id,
        ]);
      }

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
const dailyStreak = async (req, res) => {
  const { user_id } = req.body;
  try {
    await LoginModel.dailyStreak(user_id); // insert today's usage
    const streakData = await LoginModel.getDailyStreak(user_id);

    return res.status(200).json({
      message: "Streak data fetched successfully",
      history: streakData.daily_log,
      currentStreak: streakData.currentStreak,
      maxStreak: streakData.maxStreak,
    });
  } catch (error) {
    res.status(500).json({
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
