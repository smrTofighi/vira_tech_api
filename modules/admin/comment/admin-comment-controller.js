const Comment = require("./comment-model");
const User = require("../auth/models/user-model");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const Blog = require("../blog/blog-model");
const { log } = require("console");

