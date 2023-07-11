const express = require("express");
const { userModel } = require("../models/userModel");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = new validateUser(req.body);
  if (error) return res.status(403).send(error.details[0].message);
  const email = await userModel.findOne({ email: req.body.email });
  if (!email)
    return res
      .status(404)
      .send("This email ID is not Registered. Please Sign Up first");
  const checkPass = await bcrypt.compare(req.body.password, email.password);
  if (!checkPass) {
    res.status(403).send("Invalid Password");
  } else {
    var validation = _.pick(email, [
      "_id",
      "name",
      "email",
      "isAdmin",
      "createdAt",
      "image",
    ]);
    validation = jwt.sign(validation, config.get("jwtPrivateKey"));
    res.send(validation);
  }
});

module.exports = router;

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}
