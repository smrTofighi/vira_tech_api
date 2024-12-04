const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const verifyToken = require("../../../../middlewares/verify-token");
const userController = require('../controllers/admin-user-controller');
const User = require('../models/user-model');

router.get("/getAllUsers", verifyToken, userController.getUsers);

router.post(
    "/signup",
    verifyToken,
    body("email").isEmail().custom( async(value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        console.log(userDoc);
        if (userDoc) {
          return Promise.reject("E-Mail exists already, please pick a different one.");
        }
    }),
    body("password").isLength({ min: 5 }).trim(),
    body("firstName").isLength({ min: 5 }).trim(),
    body("lastName").isLength({ min: 5 }).trim(),
    body("role").isIn(["admin", "writer", "viewer"]),
    body("email").isLength({ min: 5 }).trim().isEmail(),
    userController.signup
  );
module.exports = router;