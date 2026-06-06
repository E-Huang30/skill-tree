require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

function parseJSON(text) {
  const stripped = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(stripped);
}

async function generateSkillTree(targetRole, context = "") {
  const prompt = `You are a career development expert. Generate a skill tree for someone pursuing the role of "${targetRole}".
${context ? `Additional context: ${context}` : ""}

Return ONLY valid JSON with this exact structure:
{
  "nodes": [
    {
      "id": "n1",
      "title": "Skill Name",
      "description": "What this skill covers and why it matters for the role",
      "estimated_hours": 20,
      "branch_label": null,
      "resources": [
        {
          "type": "course",
          "title": "Specific lesson or course title",
          "url": "https://www.khanacademy.org/specific/path",
          "platform": "Khan Academy",
          "note": "Start with Unit 1: Intro — complete the first 3 exercises to build the foundation"
        }
      ]
    }
  ],
  "edges": [
    { "parent": "n1", "child": "n2", "edge_type": "required" }
  ]
}

Rules:
- 8 to 15 nodes total
- First node status should be "available", all others "locked"
- Include at least one fork (branch_label set on sibling nodes with same parent to show a specialization choice)
- edge_type is one of: required, optional, fork
- estimated_hours is a realistic number between 5 and 80
- resources: 1-3 items per node with REAL URLs from free platforms only:
  * Khan Academy: https://www.khanacademy.org/[subject]/[unit]
  * freeCodeCamp: https://www.freecodecamp.org/learn/[certification]
  * The Odin Project: https://www.theodinproject.com/paths/[path-name]
  * MDN Web Docs: https://developer.mozilla.org/en-US/docs/[topic]
  * W3Schools: https://www.w3schools.com/[topic]/
  * Coursera (free audit): https://www.coursera.org/learn/[course-slug]
  * YouTube (specific channel/playlist): e.g. CS50, Traversy Media, Fireship, 3Blue1Brown
  * Google Digital Garage: https://learndigital.withgoogle.com/digitalgarage/course/[course]
- The "note" field MUST give exact next-action instructions (e.g. "Watch the first 4 videos then take the quiz", "Complete Module 1: Variables", "Read the Intro and do Exercises 1-5")
- NEVER leave url as empty string — always use a real URL
- Use beginner-friendly resources for early nodes, advanced ones for later nodes`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  return parseJSON(res.content[0].text);
}

async function validateCustomNode(nodeTitle, treeContext) {
  const prompt = `A user wants to add a custom skill node titled "${nodeTitle}" to their skill tree.
Tree context: ${treeContext}

Return ONLY valid JSON:
{
  "valid": true,
  "reason": "Why this is or isn't a good fit",
  "suggested_position": "early | mid | late | unrelated",
  "suggested_branch_label": null
}`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  return parseJSON(res.content[0].text);
}

async function runPivotSimulation(currentSkills, targetRole) {
  const prompt = `A professional wants to pivot to "${targetRole}".
Their current skills: ${JSON.stringify(currentSkills)}

Analyze the gap and return ONLY valid JSON:
{
  "transferable_skills": ["skill1", "skill2"],
  "gaps": [
    { "skill": "Missing skill", "priority": "high | medium | low", "estimated_hours": 30 }
  ],
  "overlap_percentage": 45,
  "estimated_months": 6,
  "summary": "One paragraph summary of the transition"
}`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  return parseJSON(res.content[0].text);
}

async function regenerateWithConstraints(currentNodes, completedNodeIds, targetRole, constraints) {
  const completed = currentNodes.filter((n) => completedNodeIds.includes(n.id));
  const prompt = `Regenerate a skill tree for "${targetRole}" with these constraints: ${constraints.join(", ")}.

Completed skills to preserve: ${JSON.stringify(completed.map((n) => n.title))}

Return ONLY valid JSON with the same structure as a new skill tree but:
- All completed skills appear as nodes with status "complete"
- New nodes respect the constraints
- The tree still has 8-15 nodes total

{
  "nodes": [...],
  "edges": [...]
}`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  return parseJSON(res.content[0].text);
}

async function detectOverlaps(treesWithNodes) {
  const summary = treesWithNodes.map((t) => ({
    tree: t.title,
    nodes: t.nodes.map((n) => ({ id: n.id, title: n.title })),
  }));

  const prompt = `Given these skill trees and their nodes, identify skills that overlap across different trees.

Trees: ${JSON.stringify(summary)}

Return ONLY valid JSON:
{
  "overlaps": [
    {
      "node_a_id": 1,
      "node_b_id": 5,
      "overlap_type": "identical | similar",
      "similarity_score": 0.95
    }
  ]
}

Only include overlaps between nodes from DIFFERENT trees. similarity_score is between 0 and 1.`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  return parseJSON(res.content[0].text);
}

module.exports = {
  generateSkillTree,
  validateCustomNode,
  runPivotSimulation,
  regenerateWithConstraints,
  detectOverlaps,
};
