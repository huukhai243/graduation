const express = require("express");
const db = require("../models");

const bcrypt = require("bcrypt");
const AuthMiddleware = require("../middleware/authMiddleware");
const saltRounds = 10;

const UserRouter = express.Router();

UserRouter.post("/", async (req, res, next) => {
  try {
    const userID = req.body.UserID;
    const name = req.body.Name;
    const password = req.body.Password;
    const phone = req.body.Phone;
    const building = req.body.Building;
    const userType = req.body.UserType;
    const email = req.body.Email;
    const gender = req.body.Gender;

    if (
      !userID ||
      !name ||
      !password ||
      !phone ||
      !userType ||
      !email ||
      !gender
    ) {
      return res.status(422).json({
        message: "Bạn phải nhập đầy đủ các trường",
      });
    }

    const userDTO = {
      UserID: userID,
      Name: name,
      Password: bcrypt.hashSync(password, saltRounds),
      Phone: phone,
      Building: building,
      UserType: userType,
      Email: email,
      Gender: gender,
    };

    const user = await db.User.create(userDTO);

    console.log(user);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

UserRouter.get("/", AuthMiddleware.checkAuth, async (req, res, next) => {
  try {
    const auth = req.user;
    const users = await db.User.findAll({
      where: {
        id: {
          [db.Sequelize.Op.ne]: auth.id,
        },
      },
    });
    return res.json(users);
  } catch (error) {
    next(error);
  }
});

UserRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await db.User.findByPk(id);
    const room = await db.Room.findByPk(user.RoomNumber, {
      include: [
        {
          model: db.Building,
        },
      ],
    });
    const userResult = JSON.stringify(user);
    const roomResult = JSON.stringify(room);
    return res.json({
      ...JSON.parse(userResult),
      room: JSON.parse(roomResult),
    });
  } catch (error) {
    next(error);
  }
});

UserRouter.put("/:id", async (req, res, next) => {
  try {
    const userDTO = req.body;
    const id = req.params.id;

    await db.User.update(userDTO, {
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

UserRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    await db.User.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = UserRouter;
