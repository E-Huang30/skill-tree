const { Router } = require("express");
const { pool } = require("../db");
const { runPivotSimulation } = require("../services/ai");

const router = Router();

// POST /simulate — run a pivot simulation for a user targeting a new role
router.post("/", async (req, res) => {
  try {
    const { user_id, target_role, source_tree_id } = req.body;
    if (!user_id || !target_role) {
      return res.status(400).json({ error: "user_id and target_role are required" });
    }

    // Collect all completed/in-progress skills across user's trees
    const skillsResult = await pool.query(
      `SELECT DISTINCT n.title
       FROM nodes n
       JOIN skill_trees st ON st.id = n.tree_id
       WHERE st.user_id = $1 AND n.status IN ('complete', 'in_progress')`,
      [user_id]
    );
    const currentSkills = skillsResult.rows.map((r) => r.title);

    const analysis = await runPivotSimulation(currentSkills, target_role);

    const result = await pool.query(
      `INSERT INTO simulations
         (user_id, source_tree_id, target_role, gap_analysis, transferable_skills, estimated_months)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        user_id,
        source_tree_id ?? null,
        target_role,
        JSON.stringify(analysis),
        JSON.stringify(analysis.transferable_skills ?? []),
        analysis.estimated_months ?? null,
      ]
    );

    res.status(201).json({ simulation: result.rows[0], analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /simulate/:id — fetch a saved simulation
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM simulations WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /simulate?user_id=X — list all simulations for a user
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    const result = await pool.query(
      `SELECT * FROM simulations WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
