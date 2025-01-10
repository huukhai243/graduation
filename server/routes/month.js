const express = require("express");
const db = require("../models");

const MonthRouter = express.Router();

MonthRouter.get("/", async (req, res, next) => {
  try {
    const months = await db.Month.findAll({
      order: [["time"]],
    });
    return res.json(months);
  } catch (error) {
    next(error);
  }
});

MonthRouter.get("/:monthId", async (req, res, next) => {
  try {
    const month = await db.Month.findByPk(req.params.monthId);
    return res.json(month);
  } catch (error) {
    next(error);
  }
});

module.exports = MonthRouter;
