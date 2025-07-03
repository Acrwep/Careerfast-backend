const userModel = require("../models/UserModel");
const { response, request } = require("express");

const getUsers = async (request, response) => {
  try {
    const users = await userModel.getUsers();
    response.status(200).json({
      message: "Users data fetched successfully",
      data: users,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while fetching sections",
      details: error.message,
    });
  }
};

const createUser = async (request, response) => {
  const {
    first_name,
    last_name,
    phone_code,
    phone,
    email,
    password,
    organization,
    organization_type_id,
    role_id,
  } = request.body;

  if (
    !first_name ||
    !last_name ||
    !phone_code ||
    !phone ||
    !email ||
    !password ||
    !role_id
  ) {
    response.status(400).json({
      message: "Missing required fields",
      required: [
        "first_name",
        "last_name",
        "phone_code",
        "phone",
        "email",
        "password",
        "role_id",
      ],
    });
  }
  try {
    const result = await userModel.createUser(
      first_name,
      last_name,
      phone_code,
      phone,
      email,
      password,
      organization,
      organization_type_id,
      role_id
    );
    response.status(201).json({
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error creating user",
      details: error.message,
    });
  }
};

const updateUser = async (request, response) => {
  const { id, name, email, gender } = request.body;
  try {
    const result = await userModel.updateUser(
      request.params.id,
      name,
      email,
      gender
    );
    response.status(200).json({
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error updating user",
      details: error.message,
    });
  }
};

const deleteUser = async (request, response) => {
  try {
    const result = await userModel.deleteUser(request.params.id);
    response.status(200).json({
      message: "User has been deleted",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error deleting user",
      details: error.message,
    });
  }
};

const forgotPassword = async (request, response) => {
  const { email, password } = request.body;
  try {
    const result = await userModel.forgotPassword(email, password);
    response.status(200).json({
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

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
};
