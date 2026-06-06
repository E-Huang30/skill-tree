const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Create table if it doesn't exist yet
pool.query(`
  CREATE TABLE IF NOT EXISTS reviews (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text       TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`).catch(err => console.error("reviews table init error:", err.message));

// GET /reviews — return all reviews newest first
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM reviews ORDER BY created_at DESC LIMIT 100"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /reviews — submit a new review
router.post("/", async (req, res) => {
  const { name, rating, text } = req.body;
  if (!name?.trim() || !text?.trim()) {
    return res.status(400).json({ error: "name and text are required" });
  }
  const r = Math.max(1, Math.min(5, parseInt(rating) || 5));
  try {
    const { rows } = await pool.query(
      "INSERT INTO reviews (name, rating, text) VALUES ($1, $2, $3) RETURNING *",
      [name.trim(), r, text.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
