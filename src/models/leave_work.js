const db = require("./../db");

const Leavework = db.model("Leavework", {
  tableName: "leavework",
  hasTimestamps: true, // มันจะ add เวลา auto ลง column  created_at และ updated_at เวลามีข้อมูล update ใน row
  requireFetch: false,
});

module.exports = Leavework;
