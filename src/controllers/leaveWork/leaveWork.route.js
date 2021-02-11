const express = require("express");
const app = express.Router();
const LeaveWork = require("./leaveWork");

app.get("", (req, res) => {
  res.send("api leavework is running");
});

app.post("/createleave", new LeaveWork().createLeave);
app.post("/showleave", new LeaveWork().showLeave);
app.get("/getstatus", new LeaveWork().showStatus)
app.put("/update/:leave_id", new LeaveWork().updateLeave);
app.delete("/delete/:leave_id", new LeaveWork().deleteLeave);
module.exports = app;
