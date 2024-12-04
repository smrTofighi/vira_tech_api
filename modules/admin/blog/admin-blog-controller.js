const User = require("../auth/models/user-model");

const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const Blog = require("./blog-model");
const { log } = require("console");
exports.getBlogs = async (req, res, next) => {
  try {
    const blogList = await Blog.find().populate({
      path: "creator",
      select: "_id firstName lastName email role createdAt",
    }).populate({
      path: "category",
      select:"_id title color icon createdAt",
    }).select("_id title content comments isShow imageUrl createdAt updatedAt");
    res.status(200).json({
      status: 1,
      blogs: blogList,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const user = await User.findById(req.userId);
    const blog = new Blog({
      title: title,
      content: content,
      category: req.body.category,
      imageUrl: req.file.path,
      creator: req.userId,
    });
    const blogResult = await blog.save();
    user.blogs.push(blog);
    const creator = await user.save();
    res.status(201).json({
      status: 1,
      message: "Blog Created!",
      blog: blogResult,
      creator: creator,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.getBlog = async (req, res, next) => {
  try {
    const id = req.params.blogId;

    const blog = await Blog.findById(id).populate({
      path: 'creator',
      select: '_id firstName lastName email role createdAt',
    }).populate('category', '_id title color icon').select('_id title content isShow imageUrl createdAt updatedAt');
    if (!blog) {
      const error = new Error("Could not find blog");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: 1,
      blog: blog,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = req.file.path;
      if (!imageUrl) {
        const error = new Error("No file picked");
        error.statusCode = 422;
        throw error;
      }
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      const error = new Error("Could not find blog");
      error.statusCode = 404;
      throw error;
    }

    if (imageUrl !== blog.imageUrl) {
      {
        await clearImage(blog.imageUrl);
      }
      blog.title = title;
      blog.content = content;
      blog.imageUrl = imageUrl;
      await blog.save();
      res.status(200).json({
        status: 1,
        message: "Blog Updated!",
        blog: blog,
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);
    console.log(blog);
    const user = await User.findById(req.userId);
    if (!blog) {
      const error = new Error("Could not find blog");
      error.statusCode = 404;
      throw error;
    }
    await clearImage(blog.imageUrl);

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    user.blogs.pull(mongoose.Types.ObjectId(blogId));
    await user.save();
    res
      .status(200)
      .json({ status: 1, message: "Deleted post.", blog: deletedBlog });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.changeShowBlog = async (req, res, next) => {
  try {
    const isShow = req.body.isShow;
    const blogId = req.body.blogId;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      const error = new Error("Could not find blog");
      error.statusCode = 404;
      res
        .status(error.statusCode)
        .json({ status: -1, message: "بلاگ یافت نشد" });
      throw error;
    }
    blog.isShow = isShow;
    await blog.save();
    res
      .status(200)
      .json({ status: 1, message: "بلاگ با موفقیت ویرایش شد", blog: blog });
  } catch (error) {}
};

const clearImage = async (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  if (await fs.existsSync(filePath)) {
    await fs.unlinkSync(filePath, (err) => {
      console.log(err);
      throw err;
    });
    console.log("Image deleted succesfully");
  } else {
    console.log("Image not found");
  }
};
