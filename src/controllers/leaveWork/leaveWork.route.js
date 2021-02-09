const express = require("express");
const app = express.Router();
const LeaveWork = require("./leaveWork");

app.get("", (req, res) => {
  res.send("api leavework is running");
});

app.post("/createleave", new LeaveWork().createLeave);
app.post("/showleave", new LeaveWork().showLeave)
module.exports = app;
