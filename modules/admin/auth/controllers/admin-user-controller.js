const User = require("../models/user-model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
exports.getUsers = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      res
        .status(error.statusCode)
        .json({ status: -1, message: "کاربر مورد نظر یافت نشد" });
      throw error;
    }
    if (user.role !== "admin" && user.role !== "writer") {
      const error = new Error("User not authorized.");
      error.statusCode = 401;
      res
        .status(error.statusCode)
        .json({ status: -1, message: "کاربر مورد نظر دسترسی مجاز ندارد" });
      throw error;
    }
    const userList = await User.find({}, "_id firstName lastName email role createdAt");
    res.status(200).json({ status: 1, userList: userList });
  } catch (error) {}
};
exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
  
    
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      
      
      res.status(error.statusCode).json({
        status: -1,
        //data:data,
        message: "مقادیر ورودی اشتباه است",
      });
      throw error;
    }
    const userId = req.userId;

    const mainUser = await User.findById(userId);

    if(!mainUser){
      const error = new Error("User not found.");
      error.statusCode = 404;
      res.status(error.statusCode).json({
        status: -1,
        message: "کاربر مورد نظر یافت نشد",
      });
      throw error;
    }
    if(mainUser.role !== "admin" && mainUser.role !== "writer"){
      const error = new Error("User not authorized.");
      error.statusCode = 401;
      res.status(error.statusCode).json({
        status: -1,
        message: "کاربر مورد نظر دسترسی مجاز ندارد",
      });
      throw error;
    }


    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const role = req.body.role;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      role: role,
    });

    const result = await user.save();
    res.status(201).json({
      status: 1,
      message: "حساب کاربری با موفقیت ایجاد شد",
      user:{
        _id: result._id.toString(),
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
        createdAt: result.createdAt,
      }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      res.status(error.statusCode).json({
        status: -1,
        message: "خطای سروری",
      })
    }
    next(error);
  }
};