CREATE TABLE IF NOT EXISTS users (
    id               SERIAL PRIMARY KEY,
    email            TEXT UNIQUE NOT NULL,
    username         TEXT NOT NULL,
    time_budget_hrs  FLOAT NOT NULL DEFAULT 5.0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_trees (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    target_role  TEXT NOT NULL,
    description  TEXT,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    color_theme  TEXT NOT NULL DEFAULT '#4F46E5',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nodes (
    id              SERIAL PRIMARY KEY,
    tree_id         INTEGER NOT NULL REFERENCES skill_trees(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    description     TEXT,
    status          TEXT NOT NULL DEFAULT 'locked'
                        CHECK (status IN ('locked','available','in_progress','complete')),
    is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
    ai_validated    BOOLEAN,
    position_x      FLOAT NOT NULL DEFAULT 0,
    position_y      FLOAT NOT NULL DEFAULT 0,
    estimated_hours FLOAT NOT NULL DEFAULT 0,
    resources       JSONB NOT NULL DEFAULT '[]',
    user_resources  JSONB NOT NULL DEFAULT '[]',
    branch_label    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS node_edges (
    id             SERIAL PRIMARY KEY,
    parent_node_id INTEGER NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    child_node_id  INTEGER NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    edge_type      TEXT NOT NULL DEFAULT 'required'
                       CHECK (edge_type IN ('required','optional','fork')),
    UNIQUE (parent_node_id, child_node_id)
);

CREATE TABLE IF NOT EXISTS skill_overlaps (
    id               SERIAL PRIMARY KEY,
    node_a_id        INTEGER NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    node_b_id        INTEGER NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,
    overlap_type     TEXT NOT NULL CHECK (overlap_type IN ('identical','similar')),
    confirmed        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (node_a_id, node_b_id)
);

CREATE TABLE IF NOT EXISTS simulations (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_tree_id      INTEGER REFERENCES skill_trees(id) ON DELETE SET NULL,
    target_role         TEXT NOT NULL,
    gap_analysis        JSONB NOT NULL DEFAULT '{}',
    transferable_skills JSONB NOT NULL DEFAULT '[]',
    estimated_months    FLOAT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_trees (
    id            SERIAL PRIMARY KEY,
    source_role   TEXT NOT NULL,
    target_role   TEXT NOT NULL,
    tree_snapshot JSONB NOT NULL,
    upvotes       INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_constraints (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    constraint_type  TEXT NOT NULL,
    constraint_value TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
