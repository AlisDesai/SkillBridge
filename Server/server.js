const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const socketController = require("./sockets/socketController");
const errorHandler = require("./middleware/error");

dotenv.config();

// Env Check
const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "FRONTEND_URL",
  "SMTP_HOST",
  "SMTP_EMAIL",
  "SMTP_PASSWORD",
];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(` Missing required env variable: ${key}`);
    process.exit(1);
  }
});

connectDB();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/chats", require("./routes/chats"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/schedules", require("./routes/schedules"));
app.use("/api/progress", require("./routes/progress"));

//  Test route
app.get("/", (req, res) => {
  res.send("SkillBridge API is running...");
});

//  Global Error Handler
app.use(errorHandler);

//  Socket setup
socketController(io);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(
    `Hello, Future Billionare! Your server is running on port ${PORT}`
  );
});
