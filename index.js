const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  `mongodb+srv://mongo:${process.env.DB_PASSWORD}@cluster0.3iafh6u.mongodb.net/?retryWrites=true&w=majority`
);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const userDoc = await User.create({ name, email, password });
  res.json(userDoc);
  // res.json("test ok");
});
app.post("/login", (req, res) => {
  res.json("test ok");
});
console.log(process.env.TESTING);
app.listen(3000);
