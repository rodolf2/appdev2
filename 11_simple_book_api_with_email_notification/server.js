require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bookRouter = require("./routers/book.router");
const authRouter = require("./routers/auth.router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.get("/", (req, res) => {
  res.send("Simple Book API using Node.js and Express");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });
