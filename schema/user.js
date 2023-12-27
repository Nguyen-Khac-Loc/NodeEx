var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
});

UserSchema.pre("save", function () {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  //bug sinh ra khi change password
});

UserSchema.methods.getJWT = function () {
  var token = jwt.sign({ id: this._id, role: this.role }, configs.SECRET_KEY, {
    expiresIn: configs.EXPIRE,
  });
  return token;
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
  console.log(user);
  return user;
};

module.exports = mongoose.model("user", UserSchema);
