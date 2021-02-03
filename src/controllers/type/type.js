const { knex } = require("../../db");
const Types = require("../../models/types");

class TypesController {
  constructor() {}
  async showType(req, res) {
    try {
        let input = req.body;
        input.search = input.search || "";
        input.page = input.page || 1;
        input.per_page = input.per_page || 10;
  
        let types_query = Types.query((qb) => {
          if (input.search) {
            qb.where("type_name", "LIKE", `%${input.search}%`);
            // qb.orWhere("type_name", "LIKE", `%${input.search}%`);
            // qb.orWhere("email", "LIKE", `%${input.search}%`);
          }
          qb.orderBy("id_type", "DESC");
        });
      let type = await types_query.fetchPage({
        columns: ["id_type","type_name"],
        //เลือก colum ตาม db ของเราด้วย++++++++++
        // columns:["id"]
        // page: in, put.page,
        // pageSize: input.per_page,
      });

      // types = types.toJSON();
      // console.log(types);
      // let count = await types_query.count();

      res.status(200).json({
        count: count,
        data: type,
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
module.exports = TypesController;
