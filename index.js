require("dotenv").config();
const express = require("express");
const router = require("./router/index");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();

app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
