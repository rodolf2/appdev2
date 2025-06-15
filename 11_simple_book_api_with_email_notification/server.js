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

// Log environment variables (without sensitive data)
console.log("Environment Configuration:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  DEFAULT_RECIPIENT: process.env.DEFAULT_RECIPIENT_EMAIL
});

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
