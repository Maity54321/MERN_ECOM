const express = require('express');
const { getUsers, createUser, newCreateUser, deleteUser } = require('../controller/userController');
const {profileUpload} = require('../middleware/profileMulter');

const router = express.Router();

router.post('/', profileUpload, createUser);
router.get('/', getUsers)

router.delete("/:id", deleteUser)

module.exports = router;