const { validationResult } = require("express-validator");
const { checkLogin, checkRole } = require("../middlewares/protect");
var modelUser = require("../models/user");
var responseData = require("../helper/responseData");

const signup = async function (req, res, next) {
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
      username: req.body.userName,
      username: req.body.password,
      email: req.body.email,
    });
    responseData.responseReturn(res, 200, true, newUser);
  }
};
const login = async (req, res, next) => {
  var result = await modelUser.login(req.body.userName, req.body.password);
  if (result.err) {
    responseData.responseReturn(res, 400, true, result.err);
    return;
  }
  var token = result.getJWT();
  res.cookie("tokenJWT", token);
  responseData.responseReturn(res, 200, true, token);
};
const protect = async function (req, res, next) {
  var result = await checkLogin(req);
  if (result.message) {
    return responseData.responseReturn(res, 400, false, result.message);
  }
  console.log(result);
  req.userID = result.id;
  req.role = result.role;
  next();
};
const restrictTo = (...roles) =>
  async function (req, res, next) {
    console.log(req.role);
    // checkLogin;
    var result = await checkRole(req.role, roles);
    console.log(result);
    if (result.message) {
      return responseData.responseReturn(res, 400, false, result.message);
    }
    next();
  };
module.exports = {
  login,
  signup,
  restrictTo,
  protect,
};
