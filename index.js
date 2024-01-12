import express, { request } from "express";
import cors from "cors";
import { Mongoose } from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  res.json({
    requestData: {
      name,
      email,
      password,
    },
  });
  // res.json("test ok");
});
app.post("/login", (req, res) => {
  res.json("test ok");
});
console.log("fdafsd");
app.listen(3000);
