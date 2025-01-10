const express = require("express");
const db = require("../../models");
const { checkAuth, checkAdmin } = require("../../middleware/authMiddleware");

const ConfigPaymentRouter = express.Router();

ConfigPaymentRouter.put("/", checkAuth, checkAdmin, async (req, res, next) => {
  try {
    const { electric, water, parking_bike, parking_moto } = req.body;

    if (electric) {
      const [electricValue] = await db.ConfigPayment.findOrCreate({
        where: { key: "electric" },
        defaults: {
          value: 0,
        },
      });

      electricValue.value = electric;
      await electricValue.save();
    }

    if (water) {
      const [waterValue] = await db.ConfigPayment.findOrCreate({
        where: { key: "water" },
        defaults: {
          value: 0,
        },
      });

      waterValue.value = water;
      await waterValue.save();
    }

    if (parking_bike) {
      const [parking_bikeValue] = await db.ConfigPayment.findOrCreate({
        where: { key: "parking_bike" },
        defaults: {
          value: 0,
        },
      });

      parking_bikeValue.value = parking_bike;
      await parking_bikeValue.save();
    }

    if (parking_moto) {
      const [parking_motoValue] = await db.ConfigPayment.findOrCreate({
        where: { key: "parking_moto" },
        defaults: {
          value: 0,
        },
      });

      parking_motoValue.value = parking_moto;
      await parking_motoValue.save();
    }

    return res.json({
      message: "cập nhật giá thành công",
    });
  } catch (error) {
    next(error);
  }
});

ConfigPaymentRouter.get("/", checkAuth, checkAdmin, async (req, res, next) => {
  try {
    const configPayments = await db.ConfigPayment.findAll();

    const results = {};
    configPayments.forEach((configPayment) => {
      results[configPayment.key] = configPayment.value;
    });
    return res.json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = ConfigPaymentRouter;
