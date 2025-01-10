const express = require("express");
const UserTypeEnum = require("../../enums/UsertypeEnum");
const bcrypt = require("bcrypt");
const JwtConfig = require("../../config/jwt");
const db = require("../../models");
const UserRouter = require("./user");
const PaymentRouter = require("./payment");
const ConfigPaymentRouter = require("./configPayment");

const AdminRouter = express.Router();

AdminRouter.post("/login", async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).json({
            message: "phải điền đầy đủ các trường",
        });
    }

    const user = await db.User.findOne({
        where: {
            Email: email,
            UserType: UserTypeEnum.ADMIN,
        },
    });

    if (!user) {
        return res.status(401).json({
            message: "Sai tài khoản hoặc mật khẩu",
        });
    }

    if (!bcrypt.compareSync(password, user.Password)) {
        return res.status(401).json({
            message: "Sai tài khoản hoặc mật khẩu",
        });
    }

    const token = JwtConfig.createToken({ id: user.id });
    return res.json({ user, token });
});

AdminRouter.use("/users", UserRouter);
AdminRouter.use("/payments", PaymentRouter);
AdminRouter.use("/config-payments", ConfigPaymentRouter);

module.exports = AdminRouter;
