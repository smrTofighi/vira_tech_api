const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    res.status(error.statusCode).json({ errors: errors.array() });
    return next(error); // پاس دادن خطا به error handler
  }
  next(); // ادامه پردازش
};

module.exports = validateRequest;
