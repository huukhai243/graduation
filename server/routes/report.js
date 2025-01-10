const express = require("express");
const db = require("../models");

const AuthMiddleware = require("../middleware/authMiddleware");

const ReportRouter = express.Router();

ReportRouter.post("/", AuthMiddleware.checkAuth, async (req, res, next) => {
  try {
    const auth = req.user;

    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;
    const video = req.body.video;
    const parentId = req.body.parentId;
    const UserId = auth.id;

    if (!title) {
      return res.status(422).json({
        message: "Bạn phải nhập tiêu đề",
      });
    }

    const reportDTO = {
      title: title,
      content: content,
      image: image,
      video: video,
      parentId: parentId,
      UserId: UserId,
    };

    const report = await db.Report.create(reportDTO);

    return res.status(201).json(report);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

ReportRouter.get("/", AuthMiddleware.checkAuth, async (req, res, next) => {
  try {
    const reports = await db.Report.findAll({
      where: {
        parentId: {
          [db.Sequelize.Op.is]: null,
        },
      },
      include: [
        {
          model: db.User,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    for (const report of reports) {
      const subReports = await db.Report.findAll({
        where: {
          parentId: report.id,
        },
        include: [
          {
            model: db.User,
          },
        ],
      });
      report.setDataValue("reports", subReports);
    }

    return res.json(reports);
  } catch (error) {
    next(error);
  }
});

ReportRouter.get(
  "/by-auth",
  AuthMiddleware.checkAuth,
  async (req, res, next) => {
    try {
      const auth = req.user;
      const reports = await db.Report.findAll({
        where: {
          UserId: auth.id,
          parentId: {
            [db.Sequelize.Op.is]: null,
          },
        },
        include: [
          {
            model: db.User,
          },
        ],
      });

      for (const report of reports) {
        const subReports = await db.Report.findAll({
          where: {
            parentId: report.id,
          },
          include: [
            {
              model: db.User,
            },
          ],
        });
        report.setDataValue("reports", subReports);
      }

      return res.json(reports);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = ReportRouter;
