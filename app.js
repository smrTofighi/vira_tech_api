const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

//* routers -------------------------------------
const blogRouter = require("./modules/admin/blog/blog-route");
const authRouter = require("./modules/admin/auth/routes/auth-route");
const userRouter = require("./modules/admin/auth/routes/user-route");
const categoryRouter = require("./modules/admin/category/category-route");
//* routers -------------------------------------
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.body.type === "category") {
      cb(null, "images/icons/");
    } else if (req.body.type === "blog") {
      cb(null, "images/blogs/");
    } else if (req.body.type === "user") {
      cb(null, "images/user/");
    } else {
      cb(null, "images/");
    }
  },
  filename: function (req, file, cb) {
    if (req.body.type === "category") {
      cb(null, Date.now() + "-" + file.originalname);
    } else if (req.body.type === "blog") {
      cb(null, Date.now() + "-" + req.body.title);
    } else if (req.body.type === "user") {
      cb(null, Date.now() + "-" + file.originalname);
    } else {
      cb(null, Date.now() + "-" + file.originalname);
    }
  },
});

const fileFilter = function (req, file, cb) {
  console.log("File MIME type:", file.mimetype);

  if (req.body.type === "category") {
    if (file.mimetype=== "image/svg+xml") {
      cb(null, true);
    } else {
      cb(new Error("Only .svg format allowed!"), false);
    }
  } else if (req.body.type === "blog") {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg and .png format allowed!"), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

app.use(upload.single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
//app.use(bodyParser.urlencoded()); //! x-www-form-urlencoded <form>
app.use(bodyParser.json()); //! use for backend
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/admin/blog", blogRouter);
app.use("/admin/auth", authRouter);
app.use("/admin/user", userRouter);
app.use("/admin/category", categoryRouter);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({ message: message });
});
mongoose
  .connect("mongodb://localhost:27017/viraTech")
  .then((res) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
