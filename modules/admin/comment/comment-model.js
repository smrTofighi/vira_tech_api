const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    isShow:{
      type: Boolean,
      default : false,
      
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
