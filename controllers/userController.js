var responseData = require("../helper/responseData");
var modelUser = require("../models/user");

const getCurrentUser = async function (req, res, next) {
  //get all
  try {
    var user = await modelUser.getOne(req.userID);
    res.send({ done: user });
  } catch (err) {
    responseData.responseReturn(res, 400, false, err);
  }
};

const { validationResult } = require("express-validator");
const getAllUser = async function (req, res, next) {
  console.log(req.query);
  var usersAll = await modelUser.getall(req.query);
  responseData.responseReturn(res, 200, true, usersAll);
};

const getUser = async function (req, res, next) {
  // get by ID
  try {
    var user = await modelUser.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, user);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay user");
  }
};
const createUser = async function (req, res, next) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    responseData.responseReturn(
      res,
      400,
      false,
      errors.array().map((error) => error.msg)
    );
    return;
  }
  var user = await modelUser.getByName(req.body.userName);
  if (user) {
    responseData.responseReturn(res, 404, false, "user da ton tai");
  } else {
    const newUser = await modelUser.createUser({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });
    responseData.responseReturn(res, 200, true, newUser);
  }
};
const updateUser = async function (req, res, next) {
  try {
    var user = await modelUser.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    responseData.responseReturn(res, 200, true, user);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay user");
  }
};
const deleteUser = function (req, res, next) {
  //delete by Id
  try {
    var product = modelUser.findByIdAndDelete(req.params.id);
    responseData.responseReturn(res, 200, true, "xoa thanh cong");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay user");
  }
};

module.exports = {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
};
