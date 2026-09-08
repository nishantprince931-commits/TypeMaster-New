const dailyChallengeRoutes = require("./routes/dailyChallenge");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");
const authRoutes = require("./routes/auth");
const typingTestRoutes = require("./routes/typingTest");
const achievementRoutes = require("./routes/achievements");
const lessonRoutes = require("./routes/lessons");
const notificationRoutes = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(express.json());

app.locals.pool = pool;
app.use("/api/auth", authRoutes);
app.use("/api/typing-test", typingTestRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/daily-challenge", dailyChallengeRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/notifications", notificationRoutes);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.json({
    message: "TypeMaster Backend is running!"
  });
});

/* API TEST ROUTE */
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "TypeMaster API is working!"
  });
});

/* USERS API */
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "User"');

    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
});
console.log(
  "Typing test routes:",
  typingTestRoutes.stack
    .map(
      (x) =>
        x.route &&
        Object.keys(x.route.methods).join(",") +
        " " +
        x.route.path
    )
    .filter(Boolean)
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});