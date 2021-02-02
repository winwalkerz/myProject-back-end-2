const { knex } = require("../../db");
const Leavework = require("./../../models/leave_work");
const Utils = require("./../../utils");

class LeaveworkController {
  constructor() {}
  async createLeave(req, res) {
    try {
      let input = req.body;
      input.id_users = input.id_users || "";
      input.date_time = input.date_time || "";
      input.type_leave = input.type_leave || "";
      // await new Leavework({
      //   id_users: input.id_users,
      //   date_time: input.date_time,
      //   type_leave: input.type_leave,
      // }).save();
      await knex("leavework")
        .insert({
          date_time: input.date_time,
          type_leave: input.type_leave,
          id_users: input.id_users,
        })

        // .from("user")
        // .innerJoin("leavework", "users.id", "leavework.id_users");
      res.status(200).json({
        message: "complete",
      });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }
}
module.exports = LeaveworkController;
