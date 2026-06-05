require("dotenv").config();
const http = require("http");

const BASE = "http://localhost:3001";

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };
    const url = new URL(BASE + path);
    const req = http.request(url, options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log("=== Skill Tree API Test ===\n");

  // 1. Health check
  process.stdout.write("1. Health check ... ");
  const health = await request("GET", "/health");
  if (health.body.status === "ok") {
    console.log("PASS");
  } else {
    console.log("FAIL", health.body);
    process.exit(1);
  }

  // 2. Create a user
  process.stdout.write("2. Create user ... ");
  const userRes = await request("POST", "/users", {
    email: "test@example.com",
    username: "tester",
    time_budget_hrs: 10,
  });
  if (userRes.status === 201 || userRes.status === 409) {
    console.log(userRes.status === 201 ? "PASS (created)" : "PASS (already exists)");
  } else {
    console.log("FAIL", userRes.body);
    process.exit(1);
  }

  // Get or reuse user id
  let userId;
  if (userRes.status === 201) {
    userId = userRes.body.id;
  } else {
    // fetch by recreating — just use id 1 for test
    userId = 1;
  }

  // 3. Generate a skill tree (tests OpenAI key)
  process.stdout.write("3. Generate skill tree via OpenAI (this takes ~5s) ... ");
  try {
    const treeRes = await request("POST", "/trees/generate", {
      user_id: userId,
      target_role: "Data Analyst",
    });
    if (treeRes.status === 201 && treeRes.body.nodes?.length > 0) {
      console.log(`PASS (${treeRes.body.nodes.length} nodes generated)`);
      console.log(`   Tree ID: ${treeRes.body.id}`);
      console.log(`   First node: "${treeRes.body.nodes[0].title}"`);
    } else {
      console.log("FAIL", JSON.stringify(treeRes.body, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.log("FAIL - Is the server running on port 3001?", err.message);
    process.exit(1);
  }

  console.log("\nAll tests passed. API key is working.");
}

run().catch((err) => {
  console.error("Unexpected error:", err.message);
  process.exit(1);
});
