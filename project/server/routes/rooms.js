const express = require("express");
const db = require("../models");
const RegistrationStatusEnum = require("../enums/RegistrationStatusEnum");
const RoomUserStatusEnum = require("../enums/RoomUserStatusEnum");
const AuthMiddleware = require("../middleware/authMiddleware");

const RoomRouter = express.Router();

RoomRouter.get("/empty", AuthMiddleware.checkAuth, async (req, res, next) => {
  try {
    const auth = req.user;
    const rooms = await db.Room.findAll({
      where: {
        Roomgender: auth.Gender,
      },
      include: [{ model: db.Building }], // thêm dòng này để lấy ra tòa nhà
    });

    const roomUsers = await db.RoomUser.findAll({
      where: {
        RoomNumber: {
          [db.Sequelize.Op.in]: rooms.map((room) => room.Roomnumber),
        },
        status: RoomUserStatusEnum.IN,
      },
      attributes: [
        "RoomNumber",
        [
          // Note the wrapping parentheses in the call below!
          db.sequelize.literal(`COUNT(*)`),
          "total",
        ],
      ],

      group: "RoomNumber",
    });

    const roomsResult = rooms
      .map((room) => {
        const roomUser = roomUsers.find(
          (roomUserItem) => roomUserItem.RoomNumber === room.Roomnumber,
        );
        const total = roomUser ? JSON.parse(JSON.stringify(roomUser)).total : 0;

        if (room.Roomslot <= total) {
          return;
        }
        return {
          ...JSON.parse(JSON.stringify(room)),
          empty: room.Roomslot - total,
        };
      })
      .filter((room) => room);

    return res.json(roomsResult);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

RoomRouter.get(
  "/buildings/:buildingId",
  AuthMiddleware.checkAuth,
  async (req, res, next) => {
    try {
      const rooms = await db.Room.findAll({
        where: {
          buildingid: req.params.buildingId,
        },
      });

      return res.json(rooms);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

RoomRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    await db.Room.create(body);

    return res.json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
});

RoomRouter.get("/:id", AuthMiddleware.checkAuth, async (req, res, next) => {
  try {
    const room = await db.Room.findByPk(req.params.id);

    return res.json(room);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

RoomRouter.put("/:id", AuthMiddleware.checkAuth, async (req, res, next) => {
  try {
    const body = req.body;
    await db.Room.update(body, {
      where: {
        Roomnumber: req.params.id,
      },
    });

    return res.json({
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

RoomRouter.delete("/:id", AuthMiddleware.checkAuth, async (req, res, next) => {
  try {
    await db.Room.destroy({
      where: {
        Roomnumber: req.params.id,
      },
    });

    return res.json({
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = RoomRouter;
