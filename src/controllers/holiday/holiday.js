const Holiday = require("./../../models/holiday");
const HolidayModel = require("./../../models/holiday");

class HolidayController {
  constructor() { }

  async createHoliday(req, res) {
    try {
      let input = req.body;
      input.date = input.date || "";
      input.content = input.content || "";
      input.type = input.type || "";
      let authen = req.authen;
      if (authen.role != "admin") {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }
      if (!input.date) {
        throw new Error("Require date.");
      }

      if(!input.content){
        throw new Error("Require detail of holiday");
      }

      if(!input.type){
        throw new Error("Require type of holiday")
      }

      await new HolidayModel({
        date: input.date,
        content: input.content,
        type: input.type,
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

  async getHoliday(req, res) {
    try {
      let holiday_q = HolidayModel;
      let authen = req.authen;
      if (!authen.role) {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }
      let holiday = await holiday_q.fetchPage({
        column: ["*"],
        pageSize: 100
      });

      holiday = holiday.toJSON();
      let count = await holiday_q.count();
      res.status(200).json({
        data: holiday,
        count: count,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

  async search(req, res) {
    console.log(req.body)
    try {
      let input = req.body;
      input.search = input.search || "";
      input.page = input.page || 1;
      input.per_page = input.per_page || 10;
      let authen = req.authen;
      if (!authen.role) {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }
      let holiday_q = HolidayModel.query((qb) => {
        if (input.search) {
          qb.where("date", "LIKE", `%${input.search}%`)
        }
      })
      let resHoliday = await holiday_q.fetchPage({
        column: ["*"],
        page: input.page,
        pageSize: input.per_page,
      })
      resHoliday = resHoliday.toJSON()
      let count = await holiday_q.count();
      res.status(200).json({
        data: resHoliday,
        count: count,
      })
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

  async updateHoliday(req, res) {
    try {
      let input = req.body;
      let holiday_id = req.params.holiday_id;
      let authen = req.authen;

      if (authen.role != "admin") {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }
      let holiday = await HolidayModel.where("id", holiday_id).fetch();
      if (!holiday) {
        throw new Error("ไม่มีวันหยุดที่ต้องการแก้ไข.");
      }

      await holiday.save(
        {
          content: input.content,
          date: input.date,
          type: input.type,
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

  async deleteHoliday(req, res) {
    try {
      let authen = req.authen;
      let holiday_id = req.params.holiday_id;
      if (authen.role != "admin") {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }
      let holiday = await HolidayModel.where("id", holiday_id).fetch();
      if (!holiday) {
        throw new Error("ไม่มีวันหยุดนี้.");
      }
      await holiday.destroy({ require: false });

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

module.exports = HolidayController;