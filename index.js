const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  `mongodb+srv://mongo:${process.env.DB_PASSWORD}@cluster0.3iafh6u.mongodb.net/?retryWrites=true&w=majority`
);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({ name, email, password });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ email });
  } else {
    return res.status(400).json({ message: "Invalid Password!" });
  }
});

console.log(process.env.TESTING);
console.log(process.env.TESTING);
app.listen(3000);
//test
