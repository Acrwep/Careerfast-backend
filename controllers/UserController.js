const { pool } = require("../config/dbConfig");
const UserModel = require("../models/UserModel");
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

const insertProfile = async (request, response) => {
  const {
    profile_image,
    user_id,
    country,
    state,
    city,
    pincode,
    address,
    professional,
    is_email_verified,
  } = request.body;

  if (
    !profile_image ||
    !user_id ||
    !country ||
    !state ||
    !city ||
    !pincode ||
    !address
  ) {
    return response.status(400).json({
      message: "Missing required fields",
      required: [
        "profile_image",
        "user_id",
        "country",
        "state",
        "city",
        "pincode",
        "address",
      ],
    });
  }
  const formattedProfessional = Array.isArray(professional)
    ? professional
    : [professional];

  try {
    const result = await userModel.insertProfile(
      profile_image,
      user_id,
      country,
      state,
      city,
      pincode,
      address,
      formattedProfessional,
      is_email_verified
    );

    response.status(201).json({
      message: "Profile inserted successfully!",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while inserting profile",
      details: error.message,
    });
  }
};

const updateSocialLinks = async (request, response) => {
  const { linkedin, facebook, instagram, twitter, dribble, behance, user_id } =
    request.body;
  try {
    const result = await userModel.updateSocialLinks(
      linkedin,
      facebook,
      instagram,
      twitter,
      dribble,
      behance,
      user_id
    );
    response.status(200).json({
      message: "Social links updated successfully!",
      data: result,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while updating social links",
      details: error.message,
    });
  }
};

const getUserAppliedJobs = async (request, response) => {
  const { userId } = request.query;

  try {
    const result = await userModel.getUserAppliedJobs(userId);

    const formattedResult = result.map(({ id, applied_job_id, ...item }) => {
      return {
        ...item,
        id: applied_job_id,
        duration_period: JSON.parse(item.duration_period),
        skills: JSON.parse(item.skills),
        experience_required: JSON.parse(item.experience_required),
        diversity_hiring: JSON.parse(item.diversity_hiring),
        job_category: JSON.parse(item.job_category),
        benefits: JSON.parse(item.benefits),
      };
    });

    return response.status(200).send({
      message: "applied jobs fetched successfully",
      data: formattedResult,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error while get applied job post",
      details: error.message,
    });
  }
};

const updateUserAppliedJobStatus = async (request, response) => {
  const { post_id, user_id, status } = request.body;

  try {
    const result = await UserModel.updateUserAppliedJobStatus(
      post_id,
      user_id,
      status
    );
    return response
      .status(200)
      .send({ message: "Status changed", data: result });
  } catch (error) {
    response.status(500).send({
      message: "Error while update applied job status",
      details: error.message,
    });
  }
};

const getUserJobPostStatus = async (request, response) => {
  const { applied_job_id } = request.query;

  try {
    const result = await UserModel.getUserJobPostStatus(applied_job_id);
    return response
      .status(200)
      .send({ message: "job status get successfully", data: result });
  } catch (error) {
    response.status(500).send({
      message: "Error while get applied job status",
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
  insertProfile,
  getUserAppliedJobs,
  updateUserAppliedJobStatus,
  getUserJobPostStatus,
  updateSocialLinks,
};
