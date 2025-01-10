const express = require("express");
const db = require("../models");

const BuildingRouter = express.Router();

BuildingRouter.get("/", async (req, res, next) => {
  try {
    const buildings = await db.Building.findAll({
      include: [{ model: db.Room }],
    });
    return res.json(buildings);
  } catch (error) {
    next(error);
  }
});

BuildingRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const building = await db.Building.findByPk(id);
    return res.json(building);
  } catch (error) {
    next(error);
  }
});

BuildingRouter.get("/:id/rooms", async (req, res, next) => {
  try {
    const id = req.params.id;
    const rooms = await db.Room.findAll({
      include: [
        {
          model: db["RoomUser"],
        },
      ],
      where: {
        buildingid: id,
      },
    });
    return res.json(rooms);
  } catch (error) {
    next(error);
  }
});

BuildingRouter.post("/", async (req, res, next) => {
  try {
    const building = req.body;

    await db.Building.create(building);
    return res.json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
});

BuildingRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const building = req.body;

    await db.Building.update(building, {
      where: {
        buildingid: id,
      },
    });

    return res.json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
});

BuildingRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    await db.Building.destroy({
      where: {
        buildingid: id,
      },
    });

    return res.json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = BuildingRouter;
