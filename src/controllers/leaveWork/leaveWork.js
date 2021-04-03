const { knex } = require("../../db");
const LeaveworkModel = require("./../../models/leave_work");
const UsersModel = require("./../../models/users");
const Utils = require("./../../utils");
const StatusModel = require("./../../models/status");
const fs = require("fs");
var admin = require("firebase-admin");
class LeaveworkController {
  constructor() { }
  async createLeave(req, res) {
    try {
      let input = req.body;
      input.id_user_fk = input.id_user_fk || "";
      input.id_status_fk = input.id_status_fk || "";
      input.type = input.type || "";
      input.date_start = input.date_start || "";
      input.date_end = input.date_end || "";
      input.description = input.description || "";
      input.file = input.file || "";
      input.check = input.check;
      input.allday = input.allday || "";
      // await new Leavework({
      //   id_users: input.id_users,
      //   date_time: input.date_time,
      //   type_leave: input.type_leave,
      // }).save();
      await new LeaveworkModel({
        id_user_fk: input.id_user_fk,
        id_status_fk: input.id_status_fk,
        type: input.type,
        date_start: input.date_start,
        date_end: input.date_end,
        description: input.description,
        file: input.file,
        check: input.check,
        allday: input.allday,
      }).save();

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

  // async showLeave(req, res) {
  //   try {
  //     let input = req.body;
  //     input.search = input.search || "";
  //     input.page = input.page || 1;
  //     input.per_page = input.per_page || 10;

  //     let leave_query = LeaveworkModel.query((qb) => {
  //       if (input.search) {
  //         qb.where("id", "LIKE", `%${input.search}%`);
  //         qb.orWhere("description", "LIKE", `%${input.search}%`);
  //         qb.orWhere("email", "LIKE", `%${input.search}%`);
  //       }
  //       qb.orderBy("id", "DESC");
  //     });
  //     // console.log(types_query);
  //     let types = await leave_query.fetchPage({
  //       columns: ["*"],
  //       page: input.page,
  //       pageSize: input.per_page,
  //     });

  //     types = leave_query.toJSON();
  //     // let count = await leave_query.count();

  //     res.status(200).json({
  //       // count: count,
  //       data: types,
  //     });
  //     // console.log(users)
  //   } catch (err) {
  //     console.log(err.stack);
  //     res.status(400).json({
  //       message: err.message,
  //     });
  //   }
  // }
  async showStatus(req, res) {
    try {
      let status_q = StatusModel;
      let status = await status_q.fetchPage({
        columns: ["*"],
      });
      status = status.toJSON();

      res.status(200).json({
        data: status,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }
  // async filterData(req, res) {
  //   try {
  //     let input = req.body;
  //     input.search = input.search || "";
  //     // input.last_name = input.last_name || "";
  //     input.page = input.page || 1;
  //     input.per_page = input.per_page || 10;
  //     if (input.search) {
  //       let filter_q = LeaveworkModel.query((qb) => {

  //         qb.from("leavework")
  //           .innerJoin("users", "users.id", "leavework.id_user_fk")
  //           .innerJoin("status", "status.id", "leavework.id_status_fk");
  //         qb.where("first_name", "LIKE", `%${input.search}%`);
  //         qb.orWhere("last_name", "LIKE", `%${input.search}%`);

  //         // qb.orderBy("updated_at", "DESC");
  //       });
  //       let filters = await filter_q.fetchPage({
  //         columns: [
  //           "leavework.id",
  //           "description",
  //           "created_at",
  //           "first_name",
  //           "last_name",
  //           "email",
  //           "date_start",
  //           "date_end",
  //           "type",
  //           "id_status_fk",
  //           "status_name",
  //         ],
  //         page: input.page,
  //         pageSize: input.per_page,
  //       });
  //       filters = filters.toJSON();
  //       let count = await filter_q.count();

  //       res.status(200).json({
  //         count: count,
  //         data: filters,
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err.stack);
  //     res.status(400).json({
  //       message: err.message,
  //     });
  //   }
  // }
  async filterData(req, res) {
    try {
      let input = req.body;
      input.search = input.search || "";
      // input.last_name = input.last_name || "";
      input.page = input.page || 1;
      input.per_page = input.per_page || 10;

      let filter_q = LeaveworkModel.query((qb) => {
        qb.from("leavework")
          .innerJoin("users", "users.id", "leavework.id_user_fk")
          .innerJoin("status", "status.id", "leavework.id_status_fk");
        if (input.search) {
          qb.where("first_name", "LIKE", `%${input.search}%`);
          qb.orWhere("last_name", "LIKE", `%${input.search}%`);
        }
        // qb.orderBy("updated_at", "DESC");
      });
      let filters = await filter_q.fetchPage({
        columns: [
          "leavework.id",
          "description",
          "created_at",
          "first_name",
          "last_name",
          "email",
          "date_start",
          "date_end",
          "type",
          "id_status_fk",
          "status_name",
        ],
        page: input.page,
        pageSize: input.per_page,
      });
      filters = filters.toJSON();
      let count = await filter_q.count();

      res.status(200).json({
        count: count,
        data: filters,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }
  async updateLeave(req, res) {
    try {
      let input = req.body;
      let leave_id = req.params.leave_id;
      let leave = await LeaveworkModel.where("id", leave_id).fetch();
      if (!leave) {
        throw new Error("ไม่มีรายการลาที่เลือก.");
      }
      await leave.save(
        {
          description: input.description,
          date_start: input.date_start,
          date_end: input.date_end,
          type: input.type,
          id_status_fk: input.id_status_fk,
          allday: input.allday,
        },
        { methods: "update", patch: true }
      );

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
  async updateLeaveAdmin(req, res) {
    try {
      let input = req.body;
      let leave_id = req.params.leave_id;
      let leave = await LeaveworkModel.where("id", leave_id).fetch();
      if (!leave) {
        throw new Error("useless.");
      }
      await leave.save(
        {
          description: input.description,
          date_start: input.date_start,
          date_end: input.date_end,
          type: input.type,
          id_status_fk: input.id_status_fk,
          allday: input.allday,
          check: 1
        },
        { methods: "update", patch: true }
      );

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
  async deleteLeave(req, res) {
    try {
      let leave_id = req.params.leave_id;
      let input = req.body;
      let leave = await LeaveworkModel.where("id", leave_id).fetch();
      if (input.check == "'0'") {
        throw new Error("ไม่มีสิทธ์เข้าถึง.");
      }

      await leave.destroy({ require: false });

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
  async uploadfile(req, res) {
    try {
      let image = req.file.buffer; //ฝั่ง client ส่ง file มา
      let filename = `${Date.now()}-${req.file.originalname}`;
      let save_patch = `${process.cwd()}/public/temp/${filename}`;

      fs.writeFileSync(`${process.cwd()}/public/temp/${filename}`, image); // เขียน file in folder temp
      let upload = admin.storage().bucket();
      let res_upload = await upload.upload(save_patch, {});
      fs.unlinkSync(save_patch); // delete from temp

      let getpath = await res_upload[0].getMetadata();
      getpath = getpath[0];
      let url = `https://firebasestorage.googleapis.com/v0/b/${getpath.bucket}/o/${getpath.name}?alt=media`;
      return res.json({
        patch: url,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

  //ฟังก์ชันสำหรับรวมวันหยุดแต่ละประเภท
  async searchByType(req, res) {
    try {
      let authen_id = req.authen.id;
      let data_q = LeaveworkModel.query((qb) => {
        qb.where("id_user_fk", authen_id);
      });
      let data = await data_q.fetchPage({
        columns: ["type", "allday"],
        page: 1,
        pageSize: 100,
      });
      let count = await data_q.count();
      data = data.toJSON();
      let sumday = [0,0,0,0,0,0];
      for (let i = 0; i < count; i++) {
        if (data[i].type == 'ลากิจ') {
          sumday[0] = sumday[0] + data[i].allday;
        } else if (data[i].type == 'ลาป่วย') {
          sumday[1] = sumday[1] + data[i].allday;
        } else if (data[i].type == 'ลาทำหมัน') {
          sumday[2] = sumday[2] + data[i].allday;
        } else if (data[i].type == 'ลาฝึกอบรม') {
          sumday[3] = sumday[3] + data[i].allday;
        } else if (data[i].type == 'ลารับราชการทหาร') {
          sumday[4] = sumday[4] + data[i].allday;
        } else if (data[i].type == 'ลาคลอดบุตร') {
          sumday[5] = sumday[5] + data[i].allday;
        }
      }
      res.status(200).json({
        sumHoliday: sumday,
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
