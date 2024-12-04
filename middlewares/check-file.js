const checkFile = (req, res, next) => {
    if (!req.file) {
      const error = new Error("No image provided.");
      error.statusCode = 422;
      return next(error); // ارسال خطا به error handler
    }
    next(); // ادامه پردازش
  };
  
  module.exports = checkFile;