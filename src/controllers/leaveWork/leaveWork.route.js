const express = require("express");
const app = express.Router();
const LeaveWork = require("./leaveWork");

app.get("", (req, res) => {
  res.send("api leavework is running");
});

app.post("/createLeave", new LeaveWork().createLeave);

module.exports = app;
