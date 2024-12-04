const mongoose = require("mongoose");
const User = require("../modules/admin/auth/models/user-model");

const checkRole = (role) => {
  return (req, res, next) => {
    const user = User.findById(req.userId);
    console.log(req.userId);
    
    if (user.role === role) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      res.status(error.statusCode).json({
        status: -1,
        message: "کاربر مورد نظر دسترسی مجاز را ندارد",
      });
      return next(error);
    }
    next();
  };
};

module.exports = checkRole;
