const { knex } = require("../../db");
const Types = require("../../models/types");

class TypesController {
  
  constructor() {}
  
  async search(req, res) {
    try {
      let types_query = knex.select().from("types");
      // console.log(typ)
      // let type = await types_query.fetchPage({
      //   columns: ["id_type", "type_name"],          //เลือก colum ตาม db ของเราด้วย++++++++++
      //   // columns:["id"],
      //   // page: input.page,
      //   // pageSize: input.per_page,
      // });
      // let myJSON = JSON.stringify(types_query);
      let types = types_query.toJSON();
      // console.log(types_query);
      let count = await types_query.count();

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
module.exports = TypesController;
