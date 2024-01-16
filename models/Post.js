const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: String,
    description: String,
    editorValue: String,
    imageUrl: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Posts", PostSchema);

module.exports = PostModel;
