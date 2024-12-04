const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      res.status(error.statusCode).json({
        status: -1,
        message: "مقادیر ورودی اشتباه است",
      });
      throw error;
    }

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 401;
      res.status(error.statusCode).json({
        status: -1,
        message: "ایمیل یا رمز عبور اشتباه است",
      });
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      res.status(error.statusCode).json({
        status: -1,
        message: "ایمیل یا رمز عبور اشتباه است",
      });
      throw error;
    }
    if (user.role !== "admin" && user.role !== "writer") {
      const error = new Error("User not authorized.");
      error.statusCode = 401;
      res.status(error.statusCode).json({
        status: -1,
        message: "کاربر مورد نظر دسترسی مجاز را ندارد",
      });
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret", //TODO change secret
      { expiresIn: "124h" }
    );

    res.status(200).json({
      status: 1,
      token: token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.checkSession = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      res.status(error.statusCode).json({
        status: -1,
        message: "کاربر مورد نظر یافت نشد",
      });

      throw error;
    }
    if (user.role !== "admin" && user.role !== "writer") {
      const error = new Error("User not authorized.");
      error.statusCode = 401;
      res.status(error.statusCode).json({
        status: -1,
        message: "کاربر مورد نظر دسترسی مجاز ندارد",
      });
      throw error;
    }

    res.status(200).json({
      status: 1,
      user: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
