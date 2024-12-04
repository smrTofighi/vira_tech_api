const Category = require("./category-model");
const User = require("../auth/models/user-model");
const mongoose = require("mongoose");

const path = require("path");

const Blog = require("../blog/blog-model");

exports.createCategory = async (req, res, next) => {
  try {
    const title = req.body.title;
    const color = req.body.color;
    const user = await User.findById(req.userId);
    const oldCategory = await Category.findOne({ title: title });
    
   
    if (oldCategory) {
      const error = new Error("دسته بندی قبلا ثبت شده است");
      error.statusCode = 422;
      res.status(error.statusCode).json({ status: -1, message: error.message });
      throw error;
    }
   
    const category = new Category({
      title: title,
      color: color,
      icon: req.file.path,
      creator: req.userId,
    });

    user.categories.push(category);
    const creator = await user.save();
  const cat = await category.save();
    console.log(cat);
    const resultCategory = await Category.findById(cat._id).select("title color icon").populate({
      path: "creator",
      select: "firstName lastName email role createdAt",
    });
    resultCategory._doc.blogCount = 0;
    
    res.status(201).json({
      status: 1,
      message: "دسته بندی با موفقیت ایجاد شد",
      category: resultCategory,
      
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getBlogsFromCategory = async (req, res, next) => {
  try {
    const id = req.params.categoryId;
    blogs = await Blog.find({ category: id }).select(
      "_id title imageUrl isShow createdAt"
    ).populate({
      path: "creator",
      select: "_id firstName lastName email role createdAt",
    }).populate({
      path: "category",
      select:"_id title color icon",
    });
    if (blogs.length == 0) {
      res.status(404).json({
        status: -1,
        message: "هیچ بلاگی برای این دسته بندی وجود ندارد",
      });
    }
    res.status(200).json({
      status: 1,
      blogs: blogs,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categoryList = await Category.find()
      .populate({
        path: "creator",
        select: "_id email firstName lastName role createdAt",
      })
      .select("title color icon");

    for (const category of categoryList) {
      const blogCount = await Blog.countDocuments({ category: category._id });
      category._doc.blogCount = blogCount; // اضافه کردن تعداد بلاگ به شیء دسته‌بندی
    }

    res.status(201).json({
      status: 1,
      categories: categoryList,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const id = req.params.categoryId;
    const category = await Category.findById(id).populate("creator");

    if (!category) {
      const error = new Error("Could not find Category!");
      error.statusCode = 404;
      res.status(error.statusCode).json({
        status: -1,
        message: "دسته بندی یافت نشد!",
      });
      throw error;
    }

    res.status(200).json({
      status: 1,
      category: {
        id: category._id.toString(),
        title: category.title,
        color: category.color,
        icon: category.icon,
      },
      creator: {
        _id: category.creator._id,
        email: category.creator.email,
        fullName: category.creator.firstName + " " + category.creator.lastName,
        role: category.creator.role,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.categoryId;
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error("Could not find Category!");
      res.status(error.statusCode).json({
        status: -1,
        message: "دسته بندی یافت نشد!",
      });
      error.statusCode = 404;
    }
    const user = await User.findById(category.creator);
    user.categories.pull(mongoose.Types.ObjectId(id));
    await Category.findByIdAndRemove(id);
    await clearImage(category.icon);
    await user.save();
    res.status(200).json({
      status: 1,
      message: "دسته بندی با موفقیت حذف شد",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const id = req.params.categoryId;
    const category = await Category.findById(id);
    if (!category) {
      const error = new Error("Could not find Category!");
      error.statusCode = 404;
      throw error;
    }
    category.title = req.body.title;
    category.color = req.body.color;
    if (req.file) {
      category.icon = req.file.path;
    }
    await category.save();
    res.status(200).json({
      status: 1,
      message: "دسته بندی با موفقیت ویرایش شد",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
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