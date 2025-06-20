const LoginModel = require("../models/LoginModel");
const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const login = async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    throw new Error("Please provide username and password");
  }
  try {
    const result = await LoginModel.login(email, password);
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

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, //Payload
    process.env.JWT_SECRET, // Secret
    { expiresIn: "1d" } // Token expires in 1 hour
  );
};

module.exports = {
  login,
};
