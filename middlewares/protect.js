var jwt = require("jsonwebtoken");
const configs = require("../helper/configs");

module.exports = {
  checkLogin: async function (req) {
    var result = {};
    var token = req.headers.authorization;
    if (!token) {
      return (result = { message: "Vui long dang nhap" });
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
        return (result = { message: "Vui long dang nhap" });
      }
    } else {
      return (result = { message: "Vui long dang nhap" });
    }
  },
  checkRole: async function (role) {
    const DSRole = ["admin", "publisher"];
    var result = {};
    if (DSRole.includes(role)) {
      return (result = true);
    } else {
      return (result = { message: "ban khong du quyen truy cap" });
    }
  },
};
