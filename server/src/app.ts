import express from "express";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3001);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.send("Hello World!");
});

export default app;
