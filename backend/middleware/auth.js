const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) res.status(401).send("Access Denied, No token generated");
  try {
    const decode = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decode;
    next();
  } catch (err) {
    res.status(403).send(err);
  }
};
