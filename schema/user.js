var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const configs = require("../helper/configs");

const UserSchema = new mongoose.Schema({
  email: String,
  userName: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user", "publisher"],
    default: "user",
  },
  tokenForgot: String,
  tokenForgotExp: String,
  department_k: {
    type: mongoose.Schema.ObjectId,
    ref: "department",
  },
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods.getJWT = function () {
  var token = jwt.sign({ id: this._id }, configs.SECRET_KEY, {
    expiresIn: configs.EXPIRE,
  });
  return token;
};

UserSchema.methods.addTokenForgotPassword = function () {
  var tokenForgot = crypto.randomBytes(31).toString("hex");
  this.tokenForgot = tokenForgot;
  this.tokenForgotExp = Date.now() + 15 * 60 * 1000;
  return tokenForgot;
};

UserSchema.statics.checkLogin = async function (userName, password) {
  if (!userName || !password) {
    return { err: "Hay nhap day du username va password" };
  }
  var user = await this.findOne({ userName: userName });
  if (!user) {
    return { err: "userName hoac password sai" };
  }
  var result = bcrypt.compareSync(password, user.password);
  if (!result) {
    return { err: "userName hoac password sai" };
  }
  return user;
};

module.exports = mongoose.model("user", UserSchema);
