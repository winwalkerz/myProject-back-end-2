const express = require("express");
const app = express.Router();
const Types = require("./type");

app.get("", (req, res) => {
  res.send("API type running.");
});

app.post("/showtype", new Types().showType);

module.exports = app;
