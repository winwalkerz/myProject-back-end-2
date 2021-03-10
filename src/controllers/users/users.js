const Users = require("./../../models/users");
const Utils = require("./../../utils");

//           -----------------------Pagination-----------------------
//https://stackoverflow.com/questions/51732870/create-pagination-using-knexjs-pg

//           -----------------------Pagination-----------------------
class UsersController {
  constructor() {}

  async search(req, res) {
    try {
      let input = req.body;
      input.search = input.search || "";
      input.page = input.page || 1;
      input.per_page = input.per_page || 10;

      let users_query = Users.query((qb) => {
        if (input.search) {
          qb.where("first_name", "LIKE", `%${input.search}%`);
          qb.orWhere("last_name", "LIKE", `%${input.search}%`);
          qb.orWhere("email", "LIKE", `%${input.search}%`);
          qb.whereNot("role", admin);
        }
        qb.orderBy("id", "ASC");
      });
      // console.log("this is log",users_query)
      let users = await users_query.fetchPage({
        columns: ["*"], //เลือก colum ตาม db ของเราด้วย++++++++++
        page: input.page,
        pageSize: input.per_page,
      });
      // console.log("this is a type:",typeof users_query)
      users = users.toJSON();
      let count = await users_query.count();

      res.status(200).json({
        count: count,
        data: users,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

  async createUser(req, res) {
    try {
      let input = req.body;
      input.email = input.email || "";
      input.first_name = input.first_name || "";
      input.last_name = input.last_name || "";
      input.role = input.role || "";
      input.position = input.position || "";
      input.max_days = input.max_days || "";
      if (!new Utils().validateEmail(input.email)) {
        throw new Error("Invalid email.");
      }

      if (!input.first_name) {
        throw new Error("Require first name.");
      }
      if (!input.last_name) {
        throw new Error("Require last name.");
      }

      if (!input.password) {
        throw new Error("Require password.");
      }

      let password = new Utils().encryptPassword(input.password);

      // check
      let user = await Users.where("email", input.email).fetch();
      if (user) {
        throw new Error("มีผู้ใช้งานนี้แล้ว.");
      }

      await new Users({
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        password: password,
        role: input.role,
        position: input.position,
        max_days: input.max_days,
      }).save();

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
  async showDB(req, res) {
    try {
      let authen = req.authen;
      let authen_id = req.authen.id;
      let input = req.body;
      input.page = input.page || 1;
      input.per_page = input.per_page || 10;
      if (authen) {
        let users_query = Users.query((qb) => {
          qb.from("leavework")
            .innerJoin("users", "users.id", "leavework.id_user_fk")
            .innerJoin("status", "status.id", "leavework.id_status_fk");
          qb.where("users.id", "=", authen_id);
          qb.orderBy("updated_at", "DESC");
        });
        // console.log(typeof users_query)
        let users = await users_query.fetchPage({
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
            "max_days",
            "current_day",
            "check",
            "allday",
            "file",
          ],
          //เลือก colum ตาม db ของเราด้วย++++++++++
          // columns:["leavework.created_at"]
          page: input.page,
          pageSize: input.per_page,
        });
        // console.log(users)
        users = users.toJSON();
        console.log(users);
        let count = await users_query.count();

        res.status(200).json({
          count: count,
          data: users,
        });
        // console.log(users);
      }
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

  //     let filter_q = Users.query((qb) => {
  //       if (input.search) {
  //         qb.from("leavework")
  //           .innerJoin("users", "users.id", "leavework.id_user_fk")
  //           .innerJoin("status", "status.id", "leavework.id_status_fk");
  //         qb.where("first_name", "LIKE", `%${input.search}%`);
  //         qb.orWhere("last_name", "LIKE", `%${input.search}%`);
  //       }
  //       // qb.orderBy("updated_at", "DESC");
  //     });
  //     let filters = await filter_q.fetchPage({
  //       columns: ["*"],
  //       page: input.page,
  //       pageSize: input.per_page,
  //     });
  //     filters = filters.toJSON();
  //     let count = await filter_q.count();

  //     res.status(200).json({
  //       count: count,
  //       data: filters,
  //     });
  //   } catch (err) {
  //     console.log(err.stack);
  //     res.status(400).json({
  //       message: err.message,
  //     });
  //   }
  // }
  async showAllUser(req, res) {
    try {
      let input = req.body;
      let authen_role = req.authen.role;
      (input.check = input.check || ""), (input.page = input.page || 1);
      input.per_page = input.per_page || 10;
      if (authen_role === "admin") {
        let users_query = Users.query((qb) => {
          qb.from("leavework")
            .innerJoin("users", "users.id", "leavework.id_user_fk")
            .innerJoin("status", "status.id", "leavework.id_status_fk");
          qb.where("check", "LIKE", `%${input.check}%`).whereNot(
            "role",
            authen_role
          );
          qb.orderBy("updated_at", "DESC");
        });
        let users = await users_query.fetchPage({
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
            "status_name",
            "id_status_fk",
            "role",
            "check",
            "max_days",
            "current_day",
            "allday",
            "file"
          ],
          pageSize: input.per_page, // Defaults to 10 if not specified
          page: input.page, // Defaults to 1 if not specified
        });

        users = users.toJSON();
        let count = await users_query.count();

        res.status(200).json({
          count: count,
          data: users,
        });
        console.log(users);
      }
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }
  async updateUser(req, res) {
    try {
      let input = req.body;
      let authen = req.authen;
      // console.log(authen.id, req.params.user_id)
      let user_id = req.params.user_id;
      if (authen.role != "admin") {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }

      input.first_name = input.first_name || "";
      if (!input.first_name) {
        throw new Error("Require full name.");
      }
      input.last_name = input.last_name || "";
      if (!input.last_name) {
        throw new Error("Require full name.");
      }
      input.email = input.email || "";
      if (!input.email) {
        throw new Error("Require email.");
      }

      // check
      let user = await Users.where("id", user_id).fetch();
      if (!user) {
        throw new Error("ไม่มีผู้ใช้งานนี้.");
      }

      await user.save(
        {
          first_name: input.first_name,
          last_name: input.last_name,
          email: input.email,
          password: input.password,
          position: input.position,
          max_days: input.max_days,
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

  async deleteUser(req, res) {
    try {
      let authen = req.authen;
      let user_id = req.params.user_id;
      if (authen.role != "admin") {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }
      // check
      let user = await Users.where("id", user_id).fetch();
      if (!user) {
        throw new Error("ไม่มีผู้ใช้งานนี้.");
      }

      await user.destroy({ require: false });

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

module.exports = UsersController;
