const app = require("./app");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const SocketServer = require("./SocketServer");
const port = 8080;
const { DB_URL } = process.env;

// handling mongo error

mongoose.connection.on("error", (err) => {
  console.error(`Mongo Connection Error ${err}`);
  process.exit(1);
});

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to db");
  });

// debug mode on :: lets u know all changes in db on ur console
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

const server = app.listen(port, (req, res) => {
  console.log(`Listening to port ${port}...`);
});

//  Socket io

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_API,
  },
});

io.on("connection", (socket) => {
  console.log("Socket Server Connected!");
  SocketServer(socket, io);
});

const exithandler = () => {
  if (server) {
    console.log("Server Closed");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectederrorhandler = (error) => {
  console.error(error);
  exithandler();
};
process.on("uncaughtException", unexpectederrorhandler);
process.on("unhandledRejection", unexpectederrorhandler);

// SIGTERM

process.on("SIGTERM", () => {
  if (server) {
    console.log("Server Closed");
    process.exit(1);
  }
});
