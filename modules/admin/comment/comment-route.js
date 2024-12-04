const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const verifyToken = require("../../../middlewares/verify-token");
const Comment = require("./comment-model");






module.exports = router;