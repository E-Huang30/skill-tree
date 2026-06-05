const { Router } = require("express");
const { pool } = require("../db");

const router = Router();

// GET /users — list all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, username, time_budget_hrs, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /users — create a user
router.post("/", async (req, res) => {
  try {
    const { email, username, time_budget_hrs = 5.0 } = req.body;
    if (!email || !username) {
      return res.status(400).json({ error: "email and username are required" });
    }
    const result = await pool.query(
      `INSERT INTO users (email, username, time_budget_hrs)
       VALUES ($1, $2, $3) RETURNING *`,
      [email, username, time_budget_hrs]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /users/:id
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// PUT /users/:id — update username or time_budget_hrs
router.put("/:id", async (req, res) => {
  try {
    const { username, time_budget_hrs } = req.body;
    const result = await pool.query(
      `UPDATE users
       SET username        = COALESCE($1, username),
           time_budget_hrs = COALESCE($2, time_budget_hrs)
       WHERE id = $3 RETURNING *`,
      [username, time_budget_hrs, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /users/:id/constraints — add a constraint (e.g. no_coding, remote_only)
router.post("/:id/constraints", async (req, res) => {
  try {
    const { constraint_type, constraint_value } = req.body;
    if (!constraint_type || !constraint_value) {
      return res.status(400).json({ error: "constraint_type and constraint_value are required" });
    }
    const result = await pool.query(
      `INSERT INTO user_constraints (user_id, constraint_type, constraint_value)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.id, constraint_type, constraint_value]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /users/:id/constraints
router.get("/:id/constraints", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM user_constraints WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
