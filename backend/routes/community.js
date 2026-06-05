const { Router } = require("express");
const { pool } = require("../db");

const router = Router();

// GET /community — list community trees, optionally filter by source_role or target_role
router.get("/", async (req, res) => {
  try {
    const { source_role, target_role, limit = 20, offset = 0 } = req.query;

    let query = `SELECT * FROM community_trees`;
    const params = [];
    const conditions = [];

    if (source_role) {
      params.push(`%${source_role}%`);
      conditions.push(`source_role ILIKE $${params.length}`);
    }
    if (target_role) {
      params.push(`%${target_role}%`);
      conditions.push(`target_role ILIKE $${params.length}`);
    }
    if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;

    params.push(limit, offset);
    query += ` ORDER BY upvotes DESC, created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /community/:id — get a single community tree
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM community_trees WHERE id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /community/submit — anonymously submit a skill tree to the community
router.post("/submit", async (req, res) => {
  try {
    const { tree_id } = req.body;
    if (!tree_id) return res.status(400).json({ error: "tree_id is required" });

    const treeResult = await pool.query(
      `SELECT st.target_role,
              json_agg(json_build_object(
                'title', n.title,
                'description', n.description,
                'status', n.status,
                'estimated_hours', n.estimated_hours,
                'branch_label', n.branch_label
              )) AS nodes
       FROM skill_trees st
       JOIN nodes n ON n.tree_id = st.id
       WHERE st.id = $1
       GROUP BY st.target_role`,
      [tree_id]
    );
    if (!treeResult.rows.length) return res.status(404).json({ error: "tree not found" });

    const tree = treeResult.rows[0];

    // Use the user's current role from their other trees as source_role, default to "Unknown"
    const sourceResult = await pool.query(
      `SELECT title FROM skill_trees
       WHERE user_id = (SELECT user_id FROM skill_trees WHERE id = $1)
         AND id != $1
       LIMIT 1`,
      [tree_id]
    );
    const sourceRole = sourceResult.rows[0]?.title ?? "Unknown";

    const result = await pool.query(
      `INSERT INTO community_trees (source_role, target_role, tree_snapshot)
       VALUES ($1, $2, $3) RETURNING *`,
      [sourceRole, tree.target_role, JSON.stringify({ nodes: tree.nodes })]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /community/:id/upvote
router.post("/:id/upvote", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE community_trees SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
