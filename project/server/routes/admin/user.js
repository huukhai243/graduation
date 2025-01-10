const express = require("express");
const AuthMiddleware = require("../../middleware/authMiddleware");
const db = require("../../models");
const RoomUserStatusEnum = require("../../enums/RoomUserStatusEnum");

const UserRouter = express.Router();

UserRouter.get(
  "/",
  AuthMiddleware.checkAuth,
  (req, res, next) => {
    console.log("đã qua check auth");
    next();
  },
  AuthMiddleware.checkAdmin,
  async (req, res, next) => {
    try {
      const auth = req.user;
      const whereBuilding = {};
      if (auth.Building !== "all") {
        whereBuilding["$Room.buildingid$"] = auth.Building;
      }
      const users = await db.RoomUser.findAll({
        include: [
          {
            model: db.User,
            required: true,
          },
          {
            model: db.Room,
            required: true,
            include: [{ model: db.Building }],
          },
        ],

        where: {
          status: RoomUserStatusEnum.IN,
          ...whereBuilding,
        },
      });
      return res.json(users);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = UserRouter;
