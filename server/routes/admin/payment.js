const express = require("express");
const db = require("../../models");
const { checkAuth, checkAdmin } = require("../../middleware/authMiddleware");
const PaymentTypeEnum = require("../../enums/PaymentTypeEnum");
const ParkingTypeEnum = require("../../enums/ParkingTypeEnum");
const { sendMailPayment } = require("../../utils/helper");
const RoomUserStatusEnum = require("../../enums/RoomUserStatusEnum");
const RegistrationStatusEnum = require("../../enums/RegistrationStatusEnum");

const PaymentRouter = express.Router();

PaymentRouter.post("/rooms", checkAuth, checkAdmin, async (req, res, next) => {
  try {
    const { monthId } = req.body;

    const userInPayments = await db.Payment.findAll({
      where: {
        monthId: monthId,
      },
    });

    const users = await db.RoomUser.findAll({
      where: {
        status: RoomUserStatusEnum.IN,
        UserId: {
          [db.Sequelize.Op.notIn]: userInPayments.map((user) => user.userId),
        },
      },
      include: [
        {
          model: db.Room,
          required: true,
        },
        {
          model: db.User,
          required: true,
        },
      ],
    });

    for (const userRoom of users) {
      await db.Payment.create({
        amount: userRoom.Room.Price,
        paymentstatus: PaymentTypeEnum.UN_ACTIVE,
        userId: userRoom.UserId,
        monthId: monthId,
      });

      const user = await db.User.findByPk(userRoom.UserId);
      const room = await db.Room.findByPk(userRoom.RoomNumber, {
        include: [{ model: db.Building }],
      });
      const info = `
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px;">Tên</th>
            <th style="border: 1px solid black; padding: 8px;">Phòng</th>
            <th style="border: 1px solid black; padding: 8px;">Số tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 8px;">
              ${user.Name}
            </td>
            <td style="border: 1px solid black; padding: 8px;">
              ${room.Building.name} - ${room.name}
            </td>
            <td style="border: 1px solid black; padding: 8px;">
              ${userRoom.Room.Price}
            </td>
          </tr>
        </tbody>
      </table>
    `;
      const month = await db.Month.findByPk(monthId);
      sendMailPayment(user.Email, "rooms", info, month.time);
    }

    return res.json({
      message: "thành công",
    });
  } catch (error) {
    next(error);
  }
});

PaymentRouter.post(
  "/parkings",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      const { monthId } = req.body;

      const userInPayments = await db.Parking.findAll({
        where: {
          monthId: monthId,
        },
      });

      const registrationParkings = await db.RegistrationParking.findAll({
        where: {
          registrationstatus: RegistrationStatusEnum.ACTIVE,
          UserId: {
            [db.Sequelize.Op.notIn]: userInPayments.map((user) => user.userId),
          },
        },
      });

      for (const registrationParking of registrationParkings) {
        const ParkingType = registrationParking.parkingType;
        const userId = registrationParking.UserId;

        const parkingTypeValue = await db.ConfigPayment.findOne({
          where: {
            key: `parking_${ParkingType}`,
          },
        });

        if (!parkingTypeValue) {
          return res.status(400).json({
            message: `vui lòng thêm giá tiền ${ParkingType} trước khi tạo payment parking`,
          });
        }

        await db.Parking.create({
          amount: parkingTypeValue.value,
          paymentstatus: PaymentTypeEnum.UN_ACTIVE,
          userId: userId,
          monthId: monthId,
          ParkingType: ParkingType,
        });

        const user = await db.User.findByPk(userId);
        const info = `
          <table style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="border: 1px solid black; padding: 8px;">Tên</th>
                <th style="border: 1px solid black; padding: 8px;">Loại xe</th>
                <th style="border: 1px solid black; padding: 8px;">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid black; padding: 8px;">
                  ${user.Name}
                </td>
                <td style="border: 1px solid black; padding: 8px;">
                  ${ParkingType === ParkingTypeEnum.BIKE ? "Xe đạp" : "Xe máy"}
                </td>
                <td style="border: 1px solid black; padding: 8px;">
                  ${parkingTypeValue.value}
                </td>
              </tr>
            </tbody>
          </table>
        `;
        const month = await db.Month.findByPk(monthId);

        sendMailPayment(user.Email, "parkings", info, month.time);
      }

      return res.json({
        message: "Thành công",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

PaymentRouter.post(
  "/services",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      const { BuildingID, electric, water, Roomnumber, monthId } = req.body;

      const electricValue = await db.ConfigPayment.findOne({
        where: {
          key: "electric",
        },
      });

      if (!electricValue) {
        return res.status(400).json({
          message: "vui lòng thêm giá tiền điện trước khi tạo payment service",
        });
      }

      const waterValue = await db.ConfigPayment.findOne({
        where: {
          key: "water",
        },
      });

      if (!waterValue) {
        return res.status(400).json({
          message: "vui lòng thêm giá tiền nước trước khi tạo payment service",
        });
      }

      const amount = electric * electricValue.value + water * waterValue.value;

      const service = await db.Paymentservice.create({
        BuildingID: BuildingID,
        paymentstatus: PaymentTypeEnum.UN_ACTIVE,
        electric: electric,
        electricPrice: electricValue.value,
        water: water,
        waterPrice: waterValue.value,
        monthId: monthId,
        Roomnumber: Roomnumber,
        amount: amount,
      });

      const roomUsers = await db.RoomUser.findAll({
        where: {
          RoomNumber: Roomnumber,
          status: RoomUserStatusEnum.IN,
        },
        include: [
          {
            model: db.User,
          },
        ],
      });

      const room = await db.Room.findByPk(Roomnumber, {
        include: [{ model: db.Building }],
      });

      const info = `
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px;">Phòng</th>
            <th style="border: 1px solid black; padding: 8px;">Số điện</th>
            <th style="border: 1px solid black; padding: 8px;">Giá điện</th>
            <th style="border: 1px solid black; padding: 8px;">Số nước</th>
            <th style="border: 1px solid black; padding: 8px;">Giá nước</th>
            <th style="border: 1px solid black; padding: 8px;">Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 8px;">
              ${room.Building.name} - ${room.name}
            </td>
            <td style="border: 1px solid black; padding: 8px;">
              ${electric}
            </td>
            <td style="border: 1px solid black; padding: 8px;">
              ${electricValue.value}
            </td>
            <td style="border: 1px solid black; padding: 8px;">
              ${water}
            </td>
            <td style="border: 1px solid black; padding: 8px;">
              ${waterValue.value}
            </td>
            <td style="border: 1px solid black; padding: 8px;">
              ${amount}
            </td>
          </tr>
        </tbody>
      </table>
    `;
      const month = await db.Month.findByPk(monthId);

      roomUsers.forEach((roomUser) => {
        sendMailPayment(roomUser.User.Email, "services", info, month.time);
      });

      return res.json(service);
    } catch (error) {
      next(error);
    }
  },
);

PaymentRouter.put(
  "/rooms/:id/active",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      await db.Payment.update(
        {
          paymentstatus: PaymentTypeEnum.ACTIVE,
          paymentdate: new Date(),
        },
        {
          where: {
            id: req.params.id,
          },
        },
      );

      return res.json({
        message: "Xác nhận thành công",
      });
    } catch (error) {
      next(error);
    }
  },
);

PaymentRouter.put(
  "/parkings/:id/active",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      await db.Parking.update(
        {
          paymentstatus: PaymentTypeEnum.ACTIVE,
          paymentdate: new Date(),
        },
        {
          where: {
            id: req.params.id,
          },
        },
      );

      return res.json({
        message: "Xác nhận thành công",
      });
    } catch (error) {
      next(error);
    }
  },
);

PaymentRouter.put(
  "/services/:id/active",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      await db.Paymentservice.update(
        {
          paymentstatus: PaymentTypeEnum.ACTIVE,
          Paymentdate: new Date(),
        },
        {
          where: {
            id: req.params.id,
          },
        },
      );

      return res.json({
        message: "Xác nhận thành công",
      });
    } catch (error) {
      next(error);
    }
  },
);

PaymentRouter.get(
  "/rooms/:monthId",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      const payments = await db.Payment.findAll({
        where: {
          monthId: req.params.monthId,
        },
        include: [
          {
            model: db.User,
          },
        ],
      });

      return res.json(payments);
    } catch (error) {
      next(error);
    }
  },
);

PaymentRouter.get(
  "/services/:monthId",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      const payments = await db.Paymentservice.findAll({
        where: {
          monthId: req.params.monthId,
        },
        include: [
          {
            model: db.Room,
            include: [
              {
                model: db.Building,
              },
            ],
          },
        ],
      });

      return res.json(payments);
    } catch (error) {
      next(error);
    }
  },
);

PaymentRouter.get(
  "/parkings/:monthId",
  checkAuth,
  checkAdmin,
  async (req, res, next) => {
    try {
      const payments = await db.Parking.findAll({
        where: {
          monthId: req.params.monthId,
        },
        include: [
          {
            model: db.User,
          },
        ],
      });

      return res.json(payments);
    } catch (error) {
      next(error);
    }
  },
);
module.exports = PaymentRouter;
