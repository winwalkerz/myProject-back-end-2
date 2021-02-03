const { knex } = require("../../db");
const LeaveWork = require("./../../models/leave_work");
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
      await knex("leavework").insert({
        date_time: input.date_time,
        type_leave: input.type_leave,
        id_users: input.id_users,
      });

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

  async showLeave(req, res) {
    try {
      let input = req.body;
      input.search = input.search || "";
      input.page = input.page || 1;
      input.per_page = input.per_page || 10;

      let types_query = LeaveWork.query((qb) => {
        if (input.search) {
          qb.where("description", "LIKE", `%${input.search}%`);
          // qb.orWhere("type_name", "LIKE", `%${input.search}%`);
          // qb.orWhere("email", "LIKE", `%${input.search}%`);
        }
        qb.orderBy("id_leave", "DESC");
      });
      let types = await types_query.fetchPage({
        columns: ["id_leave", "description"],
        //เลือก colum ตาม db ของเราด้วย++++++++++
        // columns:["id"]
        // page: in, put.page,
        // pageSize: input.per_page,
      });

      types = types.toJSON();
      console.log(types);
      let count = await leave_query.count();

      res.status(200).json({
        count: count,
        data: types,
      });
      // console.log(users)
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }
}
module.exports = LeaveworkController;
