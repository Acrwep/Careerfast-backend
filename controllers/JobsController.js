const JobsModel = require("../models/JobsModel");
const { response, request } = require("express");

const insertJobNature = async (request, response) => {
  const { nature_name } = request.body;
  try {
    const result = await JobsModel.insertJobNature(nature_name);
    response.status(201).send({
      message: "Job nature inserted successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error inserting job nature",
      details: error.message,
    });
  }
};

const getJobNature = async (request, response) => {
  try {
    const natures = await JobsModel.getJobNature();
    response.status(200).send({
      message: "Job natures fetched successfully",
      data: natures,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching job nature",
      details: error.message,
    });
  }
};

const insertWorkPlaceType = async (request, response) => {
  const { workplace } = request.body;
  try {
    const result = await JobsModel.insertWorkPlaceType(workplace);
    response.status(201).send({
      message: "Workplace inserted successfully",
      data: result,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error inserting workplace",
      details: error.message,
    });
  }
};

const getWorkplaceType = async (request, response) => {
  try {
    const workplaces = await JobsModel.getWorkplaceType();
    response.status(200).send({
      message: "Workplaces fetched successfully",
      data: workplaces,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching workplace",
      details: error.message,
    });
  }
};

const getWorklocation = async (request, response) => {
  try {
    const workLocation = await JobsModel.getWorklocation();
    response.status(200).send({
      message: "work location fetched successfully",
      data: workLocation,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching work location",
      details: error.message,
    });
  }
};

const getInternshipDuration = async (request, response) => {
  try {
    const durationTypes = await JobsModel.getInternshipDuration();
    response.status(200).send({
      message: "Internship duration type fetched successfully",
      data: durationTypes,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching internship duration type",
      details: error.message,
    });
  }
};

const getDurationPeriod = async (request, response) => {
  const { duration_type_id } = request.query;
  try {
    const durationPeriod = await JobsModel.getDurationPeriod(duration_type_id);
    response.status(200).send({
      message: "Duration fetched successfully",
      data: durationPeriod,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching duration",
      details: error.message,
    });
  }
};

const getBenefits = async (request, response) => {
  try {
    const benefits = await JobsModel.getBenefits();
    response.status(200).send({
      message: "Benefits fetched successfully",
      data: benefits,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching benefits",
      details: error.message,
    });
  }
};

const getGender = async (request, response) => {
  try {
    const genders = await JobsModel.getGender();
    response.status(200).send({
      message: "Benefits fetched successfully",
      data: genders,
    });
  } catch (error) {
    response.status(500).send({
      message: "Error fetching benefits",
      details: error.message,
    });
  }
};

module.exports = {
  insertJobNature,
  getJobNature,
  insertWorkPlaceType,
  getWorkplaceType,
  getWorklocation,
  getInternshipDuration,
  getDurationPeriod,
  getBenefits,
  getGender,
};
