var departmentModel = require("../models/department");
var departmentSchema = require("../schema/department");
var responseData = require("../helper/responseData");

const getAllDepartments = async function (req, res, next) {
  try {
    var allDepartment = await departmentModel.getAll();
    responseData.responseReturn(res, 200, true, allDepartment);
  } catch (err) {
    responseData.responseReturn(res, 404, false, err);
  }
};

const getOneDepartment = async function (req, res, next) {
  try {
    const department = await departmentModel.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, department);
  } catch (err) {
    responseData.responseReturn(res, 404, false, err);
  }
};

const deleteDepartment = async function (req, res, next) {
  try {
    console.log(req.params.id);
    await departmentModel.deleteOne(req.params.id);
    responseData.responseReturn(res, 200, true, "xoa thanh cong");	
  } catch (err) {
    responseData.responseReturn(res, 404, false, err);
  }
};

const createDepartment = async function (req, res, next) {
  try {
    const department = await new departmentModel.createOne({
      name: req.body.name,
    }).save();

    responseData.responseReturn(res, 201, true, department);
  } catch (err) {
    responseData.responseReturn(res, 404, false, err);
  }
};

const updateDepartment = async function (req, res, next) {
  try {
    const department = await departmentModel.updateOne(req.params.id, {
      name: req.body.name,
    });
    responseData.responseReturn(res, 200, true, department);
  } catch (err) {
    responseData.responseReturn(res, 404, false, err);
  }
};

module.exports = {
  getAllDepartments,
  getOneDepartment,
  deleteDepartment,
  createDepartment,
  updateDepartment,
};
