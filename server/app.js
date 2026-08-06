const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("🚀 Welcome to SafeRoute AI Backend");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SafeRoute AI Backend Connected Successfully 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});