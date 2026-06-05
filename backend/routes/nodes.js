const { Router } = require("express");
const { pool } = require("../db");
const { validateCustomNode } = require("../services/ai");

const router = Router();

// PUT /nodes/:id — update status, user_resources, or mark as learning_differently
router.put("/:id", async (req, res) => {
  try {
    const { status, user_resources, branch_label } = req.body;
    const result = await pool.query(
      `UPDATE nodes
       SET status         = COALESCE($1, status),
           user_resources = COALESCE($2, user_resources),
           branch_label   = COALESCE($3, branch_label),
           updated_at     = NOW()
       WHERE id = $4 RETURNING *`,
      [status, user_resources ? JSON.stringify(user_resources) : null, branch_label, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });

    // When a node is completed, unlock its children
    if (status === "complete") {
      await pool.query(
        `UPDATE nodes SET status = 'available'
         WHERE id IN (
           SELECT child_node_id FROM node_edges WHERE parent_node_id = $1
         ) AND status = 'locked'`,
        [req.params.id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /nodes/inject — user injects a custom node with AI validation
router.post("/inject", async (req, res) => {
  try {
    const { tree_id, title, description, parent_node_id } = req.body;
    if (!tree_id || !title) {
      return res.status(400).json({ error: "tree_id and title are required" });
    }

    // Get tree context for AI validation
    const treeResult = await pool.query(
      `SELECT st.target_role, array_agg(n.title) AS node_titles
       FROM skill_trees st
       JOIN nodes n ON n.tree_id = st.id
       WHERE st.id = $1
       GROUP BY st.target_role`,
      [tree_id]
    );
    const treeContext = treeResult.rows[0]
      ? `Role: ${treeResult.rows[0].target_role}. Existing skills: ${treeResult.rows[0].node_titles.join(", ")}`
      : "";

    const validation = await validateCustomNode(title, treeContext);

    const nodeResult = await pool.query(
      `INSERT INTO nodes (tree_id, title, description, status, is_custom, ai_validated)
       VALUES ($1, $2, $3, 'available', TRUE, $4) RETURNING *`,
      [tree_id, title, description ?? "", validation.valid]
    );
    const node = nodeResult.rows[0];

    if (parent_node_id) {
      await pool.query(
        `INSERT INTO node_edges (parent_node_id, child_node_id, edge_type)
         VALUES ($1, $2, 'optional') ON CONFLICT DO NOTHING`,
        [parent_node_id, node.id]
      );
    }

    res.status(201).json({ node, validation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /nodes/:id/validate — re-run AI validation on an existing custom node
router.post("/:id/validate", async (req, res) => {
  try {
    const nodeResult = await pool.query(
      `SELECT n.*, st.target_role FROM nodes n
       JOIN skill_trees st ON st.id = n.tree_id
       WHERE n.id = $1`,
      [req.params.id]
    );
    if (!nodeResult.rows.length) return res.status(404).json({ error: "not found" });
    const node = nodeResult.rows[0];

    const validation = await validateCustomNode(node.title, `Role: ${node.target_role}`);

    await pool.query(
      `UPDATE nodes SET ai_validated = $1 WHERE id = $2`,
      [validation.valid, node.id]
    );

    res.json({ node_id: node.id, validation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// DELETE /nodes/:id — only custom nodes can be deleted
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM nodes WHERE id = $1 AND is_custom = TRUE RETURNING *`,
      [req.params.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "not found or node is not custom" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = router;
