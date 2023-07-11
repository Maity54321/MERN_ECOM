const _ = require("lodash");
const bcrypt = require("bcrypt");
const { userModel, userValidation } = require("../models/userModel");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/datUri");

exports.createUser = async (req, res) => {
  const user = new userModel(_.pick(req.body, ["name", "email", "password"]));
  const { error } = new userValidation(
    _.pick(req.body, ["name", "email", "password"])
  );
  if (error) return res.status(403).send(error.details[0].message);
  const email = await userModel.findOne({ email: req.body.email });
  if (email) return res.status(400).send("Email already exists");
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  const file = req.file;
  // console.log(file);
  const imageUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(imageUri.content,{folder:"Users"})
  // console.log(imageUri);
  user.image.public_id = myCloud.public_id;
  user.image.url = myCloud.secure_url

  try {
    const result = await userModel.create(user);
    res.status(200).json(_.pick(result, ["_id", "name", "email"]));
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.getUsers = async (req, res) => {
  const users = await userModel.find();
  if (users.length === 0) return res.status(404).send("No User Found");
  res.status(200).send(users);
};

exports.deleteUser = async(req, res)=>{
  const user = await userModel.findById(req.params.id);
  if(!user) return res.status(404).send("User Not Found");
  await cloudinary.v2.uploader.destroy(user.image.public_id,{invalidate:true});
  await userModel.findByIdAndRemove(req.params.id);
  res.status(200).json({
    success:true,
    message:"User Deleted"
  })
}

// exports.newCreateUser = async (req, res) => {
//   // const user = new userModel(req.body);
//   const user = new userModel(_.pick(req.body, ["name", "email", "password", "image"]));
//   const { error } = new userValidation(
//     _.pick(req.body, ["name", "email", "password"])
//   );
//   if (error) return res.status(400).send(error.details[0].message);
//   const existingEmail = await userModel.findOne({ email: req.body.email });
//   if (existingEmail) return res.status(400).send("User Already exists");
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(req.body.password, salt);
//   user.image.public_id = "Hello";
//   user.image.url = "World"
//   const file = req.file;
//   console.log(file);
//   await userModel.create(user);
//   res.status(200).json({
//     success: true,
//   });
// };
