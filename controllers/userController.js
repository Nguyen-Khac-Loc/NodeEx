var responseData = require("../helper/responseData");
var modelUser = require("../models/user");
const sendmail = require("../helper/sendmail");

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
      department_k: req.body.department_k,
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

const logout = async function (req, res, next) {
  res.cookie("jwt", "none", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  responseData.responseReturn(res, 200, true, "logout thanh cong");
};

const forgotPassword = async function (req, res, next) {
  var email = req.body.email;
  var user = await modelUser.getByEmail(email);
  if (!user) {
    return responseData.responseReturn(res, 404, false, "Email khong ton tai");
  }
  user.addTokenForgotPassword();
  await user.save();
  try {
    await sendmail.send(user.email, user.tokenForgot);
    return responseData.responseReturn(res, 200, true, "gui mail thanh cong");
  } catch (error) {
    user.tokenForgot = undefined;
    user.tokenForgotExp = undefined;
    return responseData.responseReturn(
      res,
      400,
      true,
      "gui mail loi vui long thu lai" + error
    );
  }
};

const resetPassword = async function (req, res, next) {
  var token = req.params.token;
  var password = req.body.password;
  var user = await modelUser.getByTokenForgot(token);
  if (!user) {
    return responseData.responseReturn(res, 404, false, "user khong ton tai");
  }
  user.password = password;
  user.tokenForgot = undefined;
  user.tokenForgotExp = undefined;
  await user.save();

  return responseData.responseReturn(res, 200, true, "mat khau da duoc doi");
};

module.exports = {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  resetPassword,
  logout,
  forgotPassword,
};
