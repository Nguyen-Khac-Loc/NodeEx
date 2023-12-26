var express = require("express");
const { model } = require("mongoose");
const { use } = require(".");
var router = express.Router();
var responseData = require("../helper/responseData");
var modelUser = require("../models/user");
var validate = require("../validations/user");
const { validationResult } = require("express-validator");
const { checkLogin, checkRole } = require("../middlewares/protect");

router.post("/signup", validate.validator(), async function (req, res, next) {
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
    const newUser = await modelUser.createUser(req.body);
    responseData.responseReturn(res, 200, true, newUser);
  }
});

router.post("/login", async (req, res, next) => {
  var result = await modelUser.login(req.body.userName, req.body.password);
  if (result.err) {
    responseData.responseReturn(res, 400, true, result.err);
    return;
  }
  var token = result.getJWT();
  res.cookie("tokenJWT", token);
  responseData.responseReturn(res, 200, true, token);
});
router.get(
  "/me",
  async function (req, res, next) {
    var result = await checkLogin(req);
    if (result.message) {
      responseData.responseReturn(res, 400, false, result.message);
      return;
    }
    req.userID = result.id;
    req.role = result.role;
    next();
  },
  async function (req, res, next) {
    var result = await checkRole(req.role);
    if (result.message) {
      responseData.responseReturn(res, 400, false, result.message);
      return;
    }
    next();
  },
  async function (req, res, next) {
    //get all
    var user = await modelUser.getOne(req.userID);
    res.send({ done: user });
  }
);
module.exports = router;
