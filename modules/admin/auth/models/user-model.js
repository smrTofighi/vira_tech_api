const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    // username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ["viewer", "writer", "admin"],
      default: "viewer",
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "Blog",
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: "Category",
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
