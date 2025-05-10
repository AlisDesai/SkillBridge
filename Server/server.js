const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Init app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));

// Sample route
app.get("/", (req, res) => {
  res.send("SkillBridge API is running...");
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(
    `Hello, Future Billionare! Your server is running on port ${PORT}`
  );
});
