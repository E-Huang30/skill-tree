const { Router } = require("express");
const { pool } = require("../db");
const { generateSkillTree, regenerateWithConstraints } = require("../services/ai");

const router = Router();

// POST /trees/generate — AI generates a full skill tree
router.post("/generate", async (req, res) => {
  try {
    const { user_id, target_role, context } = req.body;
    if (!user_id || !target_role) {
      return res.status(400).json({ error: "user_id and target_role are required" });
    }

    const aiTree = await generateSkillTree(target_role, context);

    // Insert the tree
    const treeResult = await pool.query(
      `INSERT INTO skill_trees (user_id, title, target_role)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, target_role, target_role]
    );
    const tree = treeResult.rows[0];

    // Insert nodes and build a map from AI temp id -> real db id
    const nodeIdMap = {};
    for (const n of aiTree.nodes) {
      const nodeResult = await pool.query(
        `INSERT INTO nodes (tree_id, title, description, status, estimated_hours, resources, branch_label, position_x, position_y)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          tree.id,
          n.title,
          n.description ?? "",
          n.status ?? "locked",
          n.estimated_hours ?? 0,
          JSON.stringify(n.resources ?? []),
          n.branch_label ?? null,
          n.position_x ?? 0,
          n.position_y ?? 0,
        ]
      );
      nodeIdMap[n.id] = nodeResult.rows[0].id;
    }

    // Insert edges using mapped ids
    for (const e of aiTree.edges) {
      const parentId = nodeIdMap[e.parent];
      const childId = nodeIdMap[e.child];
      if (parentId && childId) {
        await pool.query(
          `INSERT INTO node_edges (parent_node_id, child_node_id, edge_type)
           VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [parentId, childId, e.edge_type ?? "required"]
        );
      }
    }

    const fullTree = await getFullTree(tree.id);
    res.status(201).json(fullTree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /trees?user_id=X — list user's trees
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    const result = await pool.query(
      `SELECT * FROM skill_trees WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /trees/:id — full tree with nodes and edges
router.get("/:id", async (req, res) => {
  try {
    const tree = await getFullTree(req.params.id);
    if (!tree) return res.status(404).json({ error: "not found" });
    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// PUT /trees/:id — update title, description, color_theme, is_active
router.put("/:id", async (req, res) => {
  try {
    const { title, description, color_theme, is_active } = req.body;
    const result = await pool.query(
      `UPDATE skill_trees
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           color_theme = COALESCE($3, color_theme),
           is_active = COALESCE($4, is_active),
           updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [title, description, color_theme, is_active, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// DELETE /trees/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM skill_trees WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST /trees/:id/regenerate — AI rebuilds tree around constraints, preserving completed nodes
router.post("/:id/regenerate", async (req, res) => {
  try {
    const { constraints = [] } = req.body;
    const treeResult = await pool.query(`SELECT * FROM skill_trees WHERE id = $1`, [req.params.id]);
    if (!treeResult.rows.length) return res.status(404).json({ error: "not found" });
    const tree = treeResult.rows[0];

    const nodesResult = await pool.query(`SELECT * FROM nodes WHERE tree_id = $1`, [tree.id]);
    const allNodes = nodesResult.rows;
    const completedIds = allNodes.filter((n) => n.status === "complete").map((n) => n.id);

    const aiTree = await regenerateWithConstraints(allNodes, completedIds, tree.target_role, constraints);

    // Delete non-completed nodes and their edges, then re-insert AI nodes
    await pool.query(
      `DELETE FROM nodes WHERE tree_id = $1 AND status != 'complete'`,
      [tree.id]
    );

    const nodeIdMap = {};
    for (const n of aiTree.nodes) {
      if (n.status === "complete") continue; // already in db
      const nodeResult = await pool.query(
        `INSERT INTO nodes (tree_id, title, description, status, estimated_hours, resources, branch_label)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [tree.id, n.title, n.description ?? "", n.status ?? "locked", n.estimated_hours ?? 0, JSON.stringify(n.resources ?? []), n.branch_label ?? null]
      );
      nodeIdMap[n.id] = nodeResult.rows[0].id;
    }

    for (const e of aiTree.edges) {
      const parentId = nodeIdMap[e.parent];
      const childId = nodeIdMap[e.child];
      if (parentId && childId) {
        await pool.query(
          `INSERT INTO node_edges (parent_node_id, child_node_id, edge_type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [parentId, childId, e.edge_type ?? "required"]
        );
      }
    }

    const fullTree = await getFullTree(tree.id);
    res.json(fullTree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET /trees/:id/budget — timeline estimate based on user's time budget
router.get("/:id/budget", async (req, res) => {
  try {
    const treeResult = await pool.query(
      `SELECT st.*, u.time_budget_hrs
       FROM skill_trees st
       JOIN users u ON u.id = st.user_id
       WHERE st.id = $1`,
      [req.params.id]
    );
    if (!treeResult.rows.length) return res.status(404).json({ error: "not found" });
    const tree = treeResult.rows[0];

    const hoursResult = await pool.query(
      `SELECT COALESCE(SUM(estimated_hours), 0) AS total_hours
       FROM nodes
       WHERE tree_id = $1 AND status != 'complete'`,
      [req.params.id]
    );
    const remainingHours = parseFloat(hoursResult.rows[0].total_hours);
    const weeksNeeded = remainingHours / tree.time_budget_hrs;
    const monthsNeeded = Math.ceil(weeksNeeded / 4.3);

    res.json({
      tree_id: tree.id,
      remaining_hours: remainingHours,
      hours_per_week: tree.time_budget_hrs,
      estimated_weeks: Math.ceil(weeksNeeded),
      estimated_months: monthsNeeded,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

async function getFullTree(treeId) {
  const treeResult = await pool.query(`SELECT * FROM skill_trees WHERE id = $1`, [treeId]);
  if (!treeResult.rows.length) return null;
  const tree = treeResult.rows[0];

  const nodesResult = await pool.query(
    `SELECT * FROM nodes WHERE tree_id = $1 ORDER BY id`,
    [treeId]
  );
  const edgesResult = await pool.query(
    `SELECT ne.* FROM node_edges ne
     JOIN nodes n ON n.id = ne.parent_node_id
     WHERE n.tree_id = $1`,
    [treeId]
  );

  return { ...tree, nodes: nodesResult.rows, edges: edgesResult.rows };
}

module.exports = router;
