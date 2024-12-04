const express = require("express");
const { body } = require("express-validator");
const verifyToken = require("../../../middlewares/verify-token");
const blogController = require("./admin-blog-controller");
const router = express.Router();
const checkRole = require("../../../middlewares/check-role");
const validationResult = require("../../../middlewares/validation-result");
const checkFile = require("../../../middlewares/check-file");
router.get(
  "/",
  verifyToken,
  checkRole("admin"),
  checkRole("writer"),
  blogController.getBlogs
);
router.post(
  "/",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  checkFile,
  verifyToken,
  checkRole("admin"),

  validationResult,
  blogController.createBlog
);
router.put(
  "/:blogId",
  verifyToken,
  checkRole("admin"),

  validationResult,
  blogController.updateBlog
);

router.get(
  "/:blogId",
  verifyToken,
  checkRole("admin"),
  checkRole("writer"),
  blogController.getBlog
);
router.delete(
  "/:blogId",
  verifyToken,
  verifyToken,
  checkRole("admin"),
  blogController.deleteBlog
);
module.exports = router;
