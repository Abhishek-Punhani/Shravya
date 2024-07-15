const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const createHttpError = require("http-errors");
const routes = require("./routes/index.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");

require("dotenv").config();
const app = express();
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.disable("x-powered-by");
app.use(helmet());
const corsOptions = {
  origin: process.env.CLIENT_API, // Specify your frontend's origin
  credentials: true, // This allows cookies to be sent
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
const sessionObject = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 7 * 24 * 60 * 60,
    maxAge: 1000 * 7 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "None", // Set SameSite to 'None' for cross-site requests
  },
  store,
};
app.use(session(sessionObject));

app.use(mongoSanitize());

app.use(compression());
app.use(fileUpload({ useTempFiles: true }));

app.use("/", routes);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("Page Not Found !"));
});

// http errors
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = app;
