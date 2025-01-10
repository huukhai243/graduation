const express = require("express");
const UserRouter = require("./user");
const RegistrationRouter = require("./registration");
const RoomUserRouter = require("./roomUser");
const RoomRouter = require("./rooms");
const MonthRouter = require("./month");
const BuildingRouter = require("./building");
const ChangeRoomRouter = require("./changeRoom");
const RegistrationParkingRouter = require("./registrationParking");
const ReportRouter = require("./report");

const WebRouter = express.Router();

WebRouter.use("/users", UserRouter);
WebRouter.use("/registrations", RegistrationRouter);
WebRouter.use("/registration-parkings", RegistrationParkingRouter);
WebRouter.use("/room-users", RoomUserRouter);
WebRouter.use("/rooms", RoomRouter);
WebRouter.use("/months", MonthRouter);
WebRouter.use("/buildings", BuildingRouter);
WebRouter.use("/change-rooms", ChangeRoomRouter);
WebRouter.use("/reports", ReportRouter);

module.exports = WebRouter;
