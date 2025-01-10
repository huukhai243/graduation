const express = require("express");
const db = require("../models");
const RoomUserStatusEnum = require("../enums/RoomUserStatusEnum");

const RoomUserRouter = express.Router();

RoomUserRouter.get("/statistic", async (req, res, next) => {
  try {
    const roomsInfo = await db.RoomUser.findAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("*")), "total"], // Đếm số lượng dòng và đặt tên là 'total'
        [db.sequelize.col("Room.buildingid"), "buildingid"],
      ],
      include: [
        {
          model: db.Room,
          attributes: [],
          required: true,
        },
      ],
      where: {
        status: RoomUserStatusEnum.IN,
      },
      group: ["Room.buildingid"], // Nhóm kết quả theo tên cột
    });

    const buildings = await db.Building.findAll();

    const roomsInfoResult = JSON.parse(JSON.stringify(roomsInfo));
    const buildingsResult = JSON.parse(JSON.stringify(buildings));

    for (const building of buildingsResult) {
      building.total =
        roomsInfoResult.find(
          (roomInfo) => roomInfo.buildingid == building.buildingid,
        )?.total ?? 0;
    }

    return res.json(buildingsResult);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

RoomUserRouter.get("/prev-service", async (req, res, next) => {
  try {
    const roomInPayments = await db.Paymentservice.findAll({
      where: {
        monthId: req.query.month,
      },
    });

    const rooms = await db.RoomUser.findAll({
      where: {
        status: RoomUserStatusEnum.IN,
        RoomNumber: {
          [db.Sequelize.Op.notIn]: roomInPayments.map(
            (room) => room.Roomnumber,
          ),
        },
      },
      include: [
        {
          model: db.Room,
          required: true,
          include: [
            {
              model: db.Building,
            },
          ],
        },
      ],
    });

    const roomsResults = [];

    rooms.forEach((room) => {
      if (
        !roomsResults.some(
          (roomResult) => roomResult.RoomNumber === room.RoomNumber,
        )
      ) {
        roomsResults.push(room);
      }
    });

    return res.json(roomsResults);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = RoomUserRouter;
