const express = require("express");
const app = express.Router();
const Holiday = require("./holiday");
const AuthenMiddleware = require("./../../middleware/authen");

app.get("", (req, res) => {
  res.send("api holiday run");
});

app.post("/createholiday",
  [new AuthenMiddleware().verifyJWT], new Holiday().createHoliday);
app.get("/getholiday",
  [new AuthenMiddleware().verifyJWT], new Holiday().getHoliday);
app.post("/search",
  [new AuthenMiddleware().verifyJWT], new Holiday().search);
app.put("/update/:holiday_id",
  [new AuthenMiddleware().verifyJWT], new Holiday().updateHoliday);
app.delete(
    "/delete/:holiday_id",
    [new AuthenMiddleware().verifyJWT],
    new Holiday().deleteHoliday
  );

module.exports = app;
