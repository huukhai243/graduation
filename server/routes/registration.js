const express = require("express");
const db = require("../models");
const RegistrationStatusEnum = require("../enums/RegistrationStatusEnum");
const RoomUserStatusEnum = require("../enums/RoomUserStatusEnum");
const AuthMiddleware = require("../middleware/authMiddleware");
const { sendMailNotifyRegister } = require("../utils/helper");

const RegistrationRouter = express.Router();

RegistrationRouter.post(
  "/",
  AuthMiddleware.checkAuth,
  async (req, res, next) => {
    try {
      const auth = req.user;
      const body = req.body;

      body.registrationstatus = RegistrationStatusEnum.WAIT;
      body.UserId = auth.id;

      await db.Registration.create(body);
      return res.json({ message: "success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

RegistrationRouter.put("/:id/active", async (req, res, next) => {
  try {
    let i = 1;
    const registrationId = req.params.id;

    const registration = await db.Registration.findByPk(registrationId);

    if (!registration) {
      return res.status(404).json({
        message: `Registration ${registrationId} not found`,
      });
    }

    do {
      const key = `RoomNumber${i}`;
      const [room, countIn] = await Promise.all([
        db.Room.findByPk(registration[key]),
        db.RoomUser.count({
          where: {
            status: RoomUserStatusEnum.IN,
            RoomNumber: registration[key],
          },
        }),
      ]);
      if (countIn >= room.Roomslot) {
        i++;
        continue;
      }

      const now = new Date();
      await db.RoomUser.create({
        status: RoomUserStatusEnum.IN,
        dateIn: now,
        UserId: registration.UserId,
        RoomNumber: room.Roomnumber,
      });

      await db.Registration.update(
        {
          registrationstatus: RegistrationStatusEnum.ACTIVE,
          RoomActive: room.Roomnumber,
        },
        {
          where: {
            id: registrationId,
          },
        },
      );

      const user = await db.User.findByPk(registration.UserId);
      const roomFull = await db.Room.findByPk(room.Roomnumber, {
        include: [{ model: db.Building }],
      });

      await db.User.update(
        {
          RoomNumber: roomFull.Roomnumber,
          Building: roomFull.buildingid,
        },
        {
          where: {
            id: registration.UserId,
          },
        },
      );

      sendMailNotifyRegister(
        user.Email,
        `Bạn đã được vào phòng ${roomFull.Building.name} - ${roomFull.name}`,
      );
      return res.json({
        message: "success",
      });
    } while (i <= 3);

    await db.Registration.update(
      {
        registrationstatus: RegistrationStatusEnum.UN_ACTIVE,
      },
      {
        where: {
          id: registrationId,
        },
      },
    );

    const user = await db.User.findByPk(registration.UserId);
    sendMailNotifyRegister(
      user.Email,
      "Bạn không được duyệt vào phòng nào vì đã hết chỗ",
    );
    return res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

RegistrationRouter.get("/", async (req, res, next) => {
  try {
    const statusQuery = req.query.status;
    const whereStatus = {};
    if (statusQuery) {
      whereStatus.registrationstatus = statusQuery;
    }
    const registrations = await db.Registration.findAll({
      where: {
        ...whereStatus,
      },
      include: [
        { model: db.User },
        {
          model: db.Room,
          as: "Room1",
          include: [
            {
              model: db.Building,
            },
          ],
        },
        {
          model: db.Room,
          as: "Room2",
          include: [
            {
              model: db.Building,
            },
          ],
        },
        {
          model: db.Room,
          as: "Room3",
          include: [
            {
              model: db.Building,
            },
          ],
        },
      ],
    });
    return res.json(registrations);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = RegistrationRouter;
