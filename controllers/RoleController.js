const { response, request } = require("express");
const RoleModel = require("../models/RoleModel");

const getRoles = async (request, response) => {
  try {
    const roles = await RoleModel.getRoles();
    response.status(200).json({
      message: "Roles data fetched successfully",
      data: roles,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error while fetching roles",
      details: error.message,
    });
  }
};

const insertCollege = async (request, response) => {
  await RoleModel.insertCollege();
};

module.exports = {
  getRoles,
  insertCollege,
};
