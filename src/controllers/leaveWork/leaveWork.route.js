const express = require("express");
const app = express.Router();
const LeaveWork = require("./leaveWork");
const AuthenMiddleware = require("./../../middleware/authen");
app.get("", (req, res) => {
  res.send("api leavework is running");
});

const multer = require("multer");

const uploads = multer({
  fileFilter: (req, file, cb) => {
    var filecheck = /jpg|peg|gif|png/.test(file.mimetype); //เช็ค type immage
    if (filecheck) {
      return cb(null, true); //
    } else {
      console.log("file is not match");
    }
  },
});
app.post("/upload", [uploads.single("file")], new LeaveWork().uploadfile);
app.post("/createleave", new LeaveWork().createLeave);
app.post("/filter", new LeaveWork().filterData);
app.post("/searchbyid/:leave_id",  new LeaveWork().searchByID);
// app.post("/showleave", new LeaveWork().showLeave);
app.get("/getstatus", new LeaveWork().showStatus);
app.get("/searchdata/:leave_id", [new AuthenMiddleware().verifyJWT], new LeaveWork().searchByType);
app.put("/update/:leave_id", new LeaveWork().updateLeave);
app.put("/updateadmin/:leave_id", new LeaveWork().updateLeaveAdmin);
app.delete("/delete/:leave_id", new LeaveWork().deleteLeave);
module.exports = app;
