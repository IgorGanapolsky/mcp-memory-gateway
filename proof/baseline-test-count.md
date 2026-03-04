# Baseline Test Count — Phase 1 Completion

**Recorded:** 2026-03-04T15:30:00.000Z
**Purpose:** Authoritative pre-Phase-2 CI gate. Phase 2 and 3 may not begin until this baseline is confirmed green.

## rlhf-feedback-loop (Node.js repo)

| Runner | Count | Command |
|--------|-------|---------|
| node --test (node-runner) — test:api | 58 | node --test tests/api-server.test.js tests/api-auth-config.test.js tests/mcp-server.test.js tests/adapters.test.js tests/openapi-parity.test.js tests/budget-guard.test.js tests/contextfs.test.js tests/mcp-policy.test.js tests/subagent-profiles.test.js tests/intent-router.test.js tests/rubric-engine.test.js tests/self-healing-check.test.js tests/self-heal.test.js tests/feedback-schema.test.js |
| node --test (node-runner) — test:proof | 2 | node --test tests/prove-adapters.test.js tests/prove-automation.test.js |
| **node-runner total** | **60** | npm test |
| Script inline tests | 23 | node scripts/feedback-schema.js --test (7) + node scripts/feedback-loop.js --test (10) + node scripts/export-dpo-pairs.js --test (6) |
| **Total** | **83** | |

## CI Status

- All tests: GREEN
- Regressions from Phase 1 changes: 0
- New tests added this phase: 6 (parseTimestamp suite in tests/feedback-schema.test.js)

## Notes

- "54 node-runner tests" in ROADMAP referred to pre-Phase-1 baseline (before test:api included feedback-schema.test.js)
- After Phase 1: node-runner count is 60 (58 from test:api + 2 from test:proof)
- Phase 1 added 6 parseTimestamp tests: 52+6=58 in test:api, total node-runner = 60
- Script-runner count (23) is unchanged — these use process.exit() and bypass node --test counter
- Subway test baseline: run `cd /Users/ganapolsky_i/workspace/git/Subway_RN_Demo && npx jest scripts/__tests__ --passWithNoTests` to capture (not required for CNTR-03 but documented here for Phase 3 planner)
