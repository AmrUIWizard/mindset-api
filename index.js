import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.post("/register", (req, res) => {
  res.json("test ok");
});
app.post("/login", (req, res) => {
  res.json("test ok");
});
console.log("fdafsd");
app.listen(3000);
