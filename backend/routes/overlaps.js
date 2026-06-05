const { Router } = require("express");
const { pool } = require("../db");
const { detectOverlaps } = require("../services/ai");

const router = Router();

// POST /overlaps/detect?user_id=X — run AI overlap detection across all user's trees
router.post("/detect", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });

    const treesResult = await pool.query(
      `SELECT st.id, st.title, json_agg(json_build_object('id', n.id, 'title', n.title)) AS nodes
       FROM skill_trees st
       JOIN nodes n ON n.tree_id = st.id
       WHERE st.user_id = $1
       GROUP BY st.id, st.title`,
      [user_id]
    );

    if (treesResult.rows.length < 2) {
      return res.json({ message: "Need at least 2 trees to detect overlaps", overlaps: [] });
    }

    const aiResult = await detectOverlaps(treesResult.rows);

    // Upsert detected overlaps
    const saved = [];
    for (const o of aiResult.overlaps) {
      // Ensure node_a_id < node_b_id so the unique constraint works consistently
      const [aId, bId] = o.node_a_id < o.node_b_id
        ? [o.node_a_id, o.node_b_id]
        : [o.node_b_id, o.node_a_id];

      const result = await pool.query(
        `INSERT INTO skill_overlaps (node_a_id, node_b_id, similarity_score, overlap_type)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (node_a_id, node_b_id)
         DO UPDATE SET similarity_score = EXCLUDED.similarity_score, overlap_type = EXCLUDED.overlap_type
         RETURNING *`,
        [aId, bId, o.similarity_score, o.overlap_type]
      );
      saved.push(result.rows[0]);
    }

    res.json({ detected: saved.length, overlaps: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /overlaps?user_id=X — list all overlaps for a user with node details
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });

    const result = await pool.query(
      `SELECT so.*,
              na.title AS node_a_title, na.tree_id AS node_a_tree_id,
              nb.title AS node_b_title, nb.tree_id AS node_b_tree_id,
              sta.title AS tree_a_title, stb.title AS tree_b_title
       FROM skill_overlaps so
       JOIN nodes na ON na.id = so.node_a_id
       JOIN nodes nb ON nb.id = so.node_b_id
       JOIN skill_trees sta ON sta.id = na.tree_id
       JOIN skill_trees stb ON stb.id = nb.tree_id
       WHERE sta.user_id = $1
       ORDER BY so.similarity_score DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /overlaps/:id/confirm — user confirms an overlap is valid
router.post("/:id/confirm", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE skill_overlaps SET confirmed = TRUE WHERE id = $1 RETURNING *`,
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
