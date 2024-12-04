const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const verifyToken = require("../../../middlewares/verify-token");
const Category = require("./category-model");
const categoryController = require("./admin-category-controller");
const checkRole = require("../../../middlewares/check-role");
const validationResult = require("../../../middlewares/validation-result");
const checkFile = require("../../../middlewares/check-file");
router.post(
  "/",
  [body("title").trim().isLength({ min: 5 })],
  validationResult,
  verifyToken,
  checkRole("admin"),
  checkFile,
  categoryController.createCategory
);

router.get('/getBlogs/:categoryId', verifyToken, checkRole('admin'), checkRole('writer'), categoryController.getBlogsFromCategory);

router.get(
  "/:categoryId",
  verifyToken,
  checkRole("admin"),
  checkRole("writer"),
  categoryController.getCategory
);
router.delete(
  "/:categoryId",
  verifyToken,
  checkRole("admin"),
  categoryController.deleteCategory
);
router.get(
  "/",
  verifyToken,
  checkRole("admin"),
  checkRole("writer"),
  categoryController.getAllCategories
);
module.exports = router;
