const express = require("express");
const path = require("path");
const logger = require("morgan");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

const uploadRouter = express.Router();

uploadRouter.post("/", (req, res) => {
  const path = `./public/${req.query.filename}`;
  req.pipe(fs.createWriteStream(path));
  req.on("end", () => {
    res.sendStatus(201);
  });
});

app.use("/upload", uploadRouter);

module.exports = app;
