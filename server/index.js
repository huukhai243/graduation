const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./models");

const bcrypt = require("bcrypt");
const JwtConfig = require("./config/jwt");
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  }),
);

app.post("/login", async (req, res, next) => {
  try {
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
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// db.sequelize.sync({ alter: true });

const AdminRouter = require("./routes/admin");
const WebRouter = require("./routes");

app.use("/admin", AdminRouter);
app.use("/", WebRouter);

app.get("/makePass", (req, res, next) => {
  try {
    const pass = req.query.pass;
    console.log(pass, saltRounds);
    return res.json({
      pass: bcrypt.hashSync(pass, saltRounds),
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.use((err, req, res, next) => {
  const status = err.status || 500;

  return res.status(status).json({
    message: err,
  });
});

app.listen(3002, () => {
  console.log("running server");
});
