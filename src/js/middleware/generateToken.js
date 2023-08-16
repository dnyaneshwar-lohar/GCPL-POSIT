const jwt = require("jsonwebtoken");

module.exports = function (payload) {
  return jwt.sign({ userData: payload }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 86400, // 24 hours
  });
};
