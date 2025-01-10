const express = require("express");
const db = require("../models");
const { checkAuth, checkAdmin } = require("../middleware/authMiddleware");
const RoomUserStatusEnum = require("../enums/RoomUserStatusEnum");
const RegistrationStatusEnum = require("../enums/RegistrationStatusEnum");
const { sendMailNotifyRegister } = require("../utils/helper");

const ChangeRoomRouter = express.Router();

ChangeRoomRouter.post("/", checkAuth, async (req, res, next) => {
  try {
    const auth = req.user;
    const { newRoomId, description } = req.body;
    const roomUser = await db.RoomUser.findOne({
      where: {
        UserId: auth.id,
        status: RoomUserStatusEnum.IN,
      },
    });

    await db.ChangeRoom.create({
      oldRoomId: roomUser.RoomNumber,
      newRoomId: newRoomId,
      description: description,
      UserId: auth.id,
      registrationstatus: RegistrationStatusEnum.WAIT,
    });

    return res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

ChangeRoomRouter.put(
  "/:id/active",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      const registrationId = req.params.id;
      const now = new Date();
      const registration = await db.ChangeRoom.findByPk(registrationId);

      const [room, countIn] = await Promise.all([
        db.Room.findByPk(registration.newRoomId),
        db.RoomUser.count({
          where: {
            status: RoomUserStatusEnum.IN,
            RoomNumber: registration.newRoomId,
          },
        }),
      ]);

      if (countIn >= room.Roomslot) {
        await db.ChangeRoom.update(
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
        sendMailNotifyRegister(user.Email, "Bạn không được đổi phòng");

        return res.json({
          message: "success",
        });
      }

      await db.RoomUser.create({
        status: RoomUserStatusEnum.IN,
        dateIn: now,
        UserId: registration.UserId,
        RoomNumber: registration.newRoomId,
      });

      await db.RoomUser.update(
        {
          status: RoomUserStatusEnum.OUT,
          dateOut: now,
        },
        {
          where: {
            UserId: registration.UserId,
            RoomNumber: registration.oldRoomId,
          },
        },
      );

      await db.ChangeRoom.update(
        {
          registrationstatus: RegistrationStatusEnum.ACTIVE,
        },
        {
          where: {
            id: registrationId,
          },
        },
      );

      const roomFull = await db.Room.findByPk(registration.newRoomId);

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

      const user = await db.User.findByPk(registration.UserId);
      sendMailNotifyRegister(user.Email, "Bạn đã được đổi phòng");

      return res.json({
        message: "success",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

ChangeRoomRouter.get("/", async (req, res, next) => {
  try {
    const statusQuery = req.query.status;
    const whereStatus = {};
    if (statusQuery) {
      whereStatus.registrationstatus = statusQuery;
    }
    const registrations = await db.ChangeRoom.findAll({
      where: {
        ...whereStatus,
      },

      include: [
        { model: db.User },
        {
          model: db.Room,
          as: "oldRoom",
          include: [
            {
              model: db.Building,
            },
          ],
        },
        {
          model: db.Room,
          as: "newRoom",
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

module.exports = ChangeRoomRouter;
