const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

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

console.log(process.env.TESTING);
console.log(process.env.TESTING);
app.listen(3000);
//test
