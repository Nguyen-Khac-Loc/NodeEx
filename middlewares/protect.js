var jwt = require("jsonwebtoken");
const configs = require("../helper/configs");

module.exports = {
  checkLogin: async function (req) {
    var result = {};
    var token = req.headers.authorization;
    if (!token) {
      return (result = { err: true, message: "Vui long dang nhap" });
    }
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      try {
        var userDecrypt = await jwt.verify(token, configs.SECRET_KEY);
        return (result = {
          id: userDecrypt.id,
          role: userDecrypt.role,
        });
      } catch (error) {
        return (result = { err: true, message: "Vui long dang nhap" });
      }
    } else {
      return (result = { err: true, message: "Vui long dang nhap" });
    }
  },
  checkRole: async function (role, roles) {
    if (roles.includes(role)) {
      return true;
    } else {
      return false;
    }
  },
};
