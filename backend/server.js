require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const usersRouter     = require("./routes/users");
const treesRouter     = require("./routes/trees");
const nodesRouter     = require("./routes/nodes");
const overlapsRouter  = require("./routes/overlaps");
const simulateRouter  = require("./routes/simulate");
const communityRouter = require("./routes/community");
const reviewsRouter   = require("./routes/reviews");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/users",     usersRouter);
app.use("/trees",     treesRouter);
app.use("/nodes",     nodesRouter);
app.use("/overlaps",  overlapsRouter);
app.use("/simulate",  simulateRouter);
app.use("/community", communityRouter);
app.use("/reviews",   reviewsRouter);

// Serve React frontend
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Skill Tree API on http://localhost:${PORT}`));
