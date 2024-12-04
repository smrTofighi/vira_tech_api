const express = require("express");

const { body } = require("express-validator");
const authController = require("../controllers/admin-auth-controller");
const verifyToken = require("../../../../middlewares/verify-token");
const User = require("../models/user-model");
const router = express.Router();


router.post("/checkSession",verifyToken , authController.checkSession);
router.post("/login", authController.login);

module.exports = router;