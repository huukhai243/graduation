const db = require("../models");
const UserTypeEnum = require("../enums/UsertypeEnum");
const JwtConfig = require("../config/jwt");

const AuthMiddleware = {
  checkAuth: async (req, res, next) => {
    const authorization = req.headers.authorization;
    try {
      if (!authorization)
        return res.status(401).json({
          message: "unauthorization",
        });

      const [scheme, token] = authorization.split(" ");

      if (scheme !== "Bearer") {
        return res.status(401).json({
          message: "unauthorization",
        });
      }

      if (!token) {
        return res.status(401).json({
          message: "unauthorization",
        });
      }

      const payload = JwtConfig.verifyToken(token);

      const auth = await db.User.findByPk(payload.id);

      if (!auth) {
        return res.status(401).json({
          message: "unauthorization",
        });
      }

      req.user = auth;
      next();
    } catch (error) {
      if (error.message == "jwt expired") {
        return res.status(401).json({
          message: "token expired",
        });
      }
      console.log("error", error);
      next(error);
    }
  },

  checkAdmin: (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "unauthorization",
        });
      }
      if (
        req.user.UserType !== UserTypeEnum.ADMIN &&
        req.user.UserType !== UserTypeEnum.SUP_ADMIN
      ) {
        return res.status(403).json({
          message: "accessdenied",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthMiddleware;
