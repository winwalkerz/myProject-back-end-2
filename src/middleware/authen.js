const fs = require("fs");
const jwt = require("jsonwebtoken");

class AuthenMiddleware {
  verifyJWT(req, res, next) {
    try {
      req.headers["authorization"] = req.headers["authorization"] || "";
      let token = req.headers["authorization"].replace(/Bearer /, "");
      // console.log('token', token)
      var cert = fs.readFileSync(`${process.cwd()}/cert/public.key`);
      console.log("This is Token : ",token)
      let decoded = jwt.verify(token, cert);

      // add request data
      req.authen = decoded;
      console.log(req.authen);
      next();
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });


    // console.log("ไม่มีสิทธิ์เข้าถึง")
    }
  }
}

module.exports = AuthenMiddleware;
