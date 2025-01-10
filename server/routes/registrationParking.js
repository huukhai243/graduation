const express = require("express");
const db = require("../models");
const AuthMiddleware = require("../middleware/authMiddleware");
const RegistrationStatusEnum = require("../enums/RegistrationStatusEnum");
const { sendMailNotifyRegister } = require("../utils/helper");

const RegistrationParkingRouter = express.Router();

RegistrationParkingRouter.post(
  "/",
  AuthMiddleware.checkAuth,
  async (req, res, next) => {
    try {
      const auth = req.user;
      const body = req.body;

      body.registrationstatus = RegistrationStatusEnum.WAIT;
      body.UserId = auth.id;

      await db.RegistrationParking.create(body);

      return res.json({ message: "success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

RegistrationParkingRouter.put("/:id/active", async (req, res, next) => {
  try {
    const registrationId = req.params.id;

    const registrationParking = await db.RegistrationParking.findByPk(
      registrationId,
    );

    if (!registrationParking) {
      return res.status(404).json({
        message: `Registration ${registrationId} not found`,
      });
    }

    await db.RegistrationParking.update(
      {
        registrationstatus: RegistrationStatusEnum.UN_ACTIVE,
      },
      {
        where: {
          UserId: registrationParking.UserId,
        },
      },
    );

    await db.RegistrationParking.update(
      {
        registrationstatus: RegistrationStatusEnum.ACTIVE,
      },
      {
        where: {
          id: registrationId,
        },
      },
    );

    const user = await db.User.findByPk(registrationParking.UserId);
    sendMailNotifyRegister(user.Email, "Đơn gửi xe của bạn đã được chấp nhận");

    return res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

RegistrationParkingRouter.get(
  "/",
  AuthMiddleware.checkAuth,
  AuthMiddleware.checkAdmin,
  async (req, res, next) => {
    try {
      const statusQuery = req.query.status;
      const whereStatus = {};
      if (statusQuery) {
        whereStatus.registrationstatus = statusQuery;
      }
      const registrationParkings = await db.RegistrationParking.findAll({
        where: {
          ...whereStatus,
        },
        include: [{ model: db.User }],
      });
      return res.json(registrationParkings);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

module.exports = RegistrationParkingRouter;
