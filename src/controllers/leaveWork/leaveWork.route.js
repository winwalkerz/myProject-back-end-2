const express = require("express");
const LeaveworkController = require("./leaveWork");
const app = express.Router();
const LeaveWork = require("./leaveWork");

app.get("", (req, res) => {
  res.send("api leavework is running");
});

app.post("/createLeave", new LeaveWork().createLeave);
app.post("/showleave", new LeaveWork().showLeave)
module.exports = app;
