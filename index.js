const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({
  dest: "uploads",
});
const fs = require("fs");

const app = express();
app.use(
  cors({ credentials: true, origin: "https://mindset-vdje.onrender.com" })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  `mongodb+srv://mongo:${process.env.DB_PASSWORD}@cluster0.3iafh6u.mongodb.net/?retryWrites=true&w=majority`
);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({ name, email, password });
    res.json(userDoc);
    jwt.sign(
      { email, name, id: userDoc._id },
      process.env.SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json("ok");
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { name, email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc === null) {
    return res.status(400).json({ message: "Invalid Email!" });
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign(
      { email, name: userDoc.name, id: userDoc._id },
      process.env.SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          name: userDoc.name,
        });
      }
    );
  } else {
    return res.status(400).json({ message: "Invalid Password!" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("imageUrl"), async (req, res) => {
  const { originalname, path } = req.file;
  const { title, description, editorValue } = req.body;

  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = `${path}.${ext}`;

  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
    if (err) throw err;

    fs.renameSync(path, newPath);
    const postDoc = await Post.create({
      title,
      description,
      editorValue,
      imageUrl: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find().populate("author", ["name"]).sort({ createdAt: -1 })
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["name"]);
  res.json(postDoc);
});

console.log(process.env.TESTING);
console.log(process.env.TESTING);
app.listen(3000);
