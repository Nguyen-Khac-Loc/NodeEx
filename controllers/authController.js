const { validationResult } = require("express-validator");
const { checkLogin } = require("../middlewares/protect");
const sendmail = require("../helper/sendmail");
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
    responseData.responseReturn(res, 201, true, newUser);
  }
};

const login = async (req, res, next) => {
  var result = await modelUser.login(req.body.userName, req.body.password);
  if (result.err) {
    return responseData.responseReturn(res, 400, true, result.err);
  }
  var token = result.getJWT();

  const cookieOpts = {
    expires: new Date(Date.now() + 2 * 24 * 3600 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOpts);
  responseData.responseReturn(res, 200, true, token);
};

const protect = async function (req, res, next) {
  var result = await checkLogin(req);
  if (result.message) {
    return responseData.responseReturn(res, 401, false, result.message);
  }
  req.userId = result;
  next();
};
const restrictTo = (...roles) =>
  async function (req, res, next) {
    const user = await modelUser.getOne(req.userId).select("role");

    if (!roles.includes(user.role)) {
      return responseData.responseReturn(
        res,
        401,
        false,
        "Ban khong du quyen truy cap"
      );
    }
    next();
  };

module.exports = {
  login,
  signup,
  restrictTo,
  protect,
};
