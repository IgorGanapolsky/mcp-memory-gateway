# Requirements: RLHF v2.0 Production Readiness

**Defined:** 2026-03-04
**Core Value:** Close all CRITICAL and IMPORTANT gaps — both systems production-ready with full feedback loop closure

## v2 Requirements

### Feedback Attribution (Subway → rlhf) — CRITICAL

- [ ] **ATTR-01**: Feedback attribution traces each feedback signal back to the specific agent action that caused it
- [ ] **ATTR-02**: Hybrid feedback context guards pre-tool execution based on attributed feedback signals
- [ ] **ATTR-03**: Both modules have unit tests proving correct behavior

### Data Quality (Subway → rlhf)

- [ ] **QUAL-01**: Validate-feedback audits schema correctness, semantic quality, and anomaly detection on feedback entries
- [ ] **QUAL-02**: Rich context enrichment (domain, filePaths, errorType, outcomeCategory) added to capture pipeline
- [ ] **QUAL-03**: inferOutcome classifies feedback beyond binary into granular categories (quick-success, factual-error, etc.)
- [ ] **QUAL-04**: All data quality features have unit tests

### Loop Closure (Subway → rlhf)

- [ ] **LOOP-01**: Feedback-to-rules distills feedback patterns into actionable CLAUDE.md behavior rules
- [ ] **LOOP-02**: Plan gate validates PRD markdown schema before execution
- [ ] **LOOP-03**: Feedback inbox reader provides cursor-based reading for reflexion-preflight
- [ ] **LOOP-04**: Feedback-to-memory bridge converts stdin JSON to MCP memory format
- [ ] **LOOP-05**: All loop closure features have unit tests

### Intelligence (Subway → rlhf)

- [ ] **INTL-01**: Context engine routes queries to pre-computed knowledge bundles for low-latency retrieval
- [ ] **INTL-02**: Skill quality tracker correlates tool call metrics to feedback signals by timestamp proximity
- [ ] **INTL-03**: Both modules have unit tests

### Training Export (Subway → rlhf)

- [ ] **XPRT-01**: PyTorch JSON training export format supported alongside JSONL
- [ ] **XPRT-02**: CSV summary export format supported
- [ ] **XPRT-03**: Action analysis report generated from feedback data
- [ ] **XPRT-04**: validateMemoryStructure() gates DPO export to prevent bad data in training pairs
- [ ] **XPRT-05**: All export features have unit tests

### Subway Upgrades (rlhf → Subway)

- [ ] **SUBW-01**: LanceDB vector store with HuggingFace embeddings ported to Subway
- [ ] **SUBW-02**: DPO optimizer (offline batch) ported to Subway
- [ ] **SUBW-03**: Thompson Sampling JS module ported to Subway
- [ ] **SUBW-04**: Self-healing GH Action workflows added to Subway
- [ ] **SUBW-05**: All Subway upgrades have tests and proof report

### Proof Gate

- [ ] **PROOF-01**: Proof reports generated for all v2 features in proof/ directory
- [ ] **PROOF-02**: npm test passes with increased test count, 0 failures

## Future Requirements (v3)

- **ADV-01**: Hybrid semantic search (BM25 + vector fusion)
- **ADV-02**: Model snapshot lift comparison (>=5% gate)
- **ADV-03**: Agentic memory evolution (A-Mem Zettelkasten)
- **ADV-04**: Autonomy decision engine
- **ADV-05**: Agent-routing config (oracle/librarian/task/quick)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-adapter pattern for Subway | Subway only uses Claude; dead code burden |
| Python RAG scripts for rlhf | LanceDB + vector-store.js handles this natively |
| Streak tracking | Nice-to-have, defer to v3 |
| success-patterns.md distillation | Nice-to-have, defer to v3 |
| decisionTrace fields | Nice-to-have, defer to v3 |
| Memory maintenance GH Action | Nice-to-have, defer to v3 |
| Any feature requiring paid API calls | $10/mo budget constraint |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ATTR-01 | TBD | Pending |
| ATTR-02 | TBD | Pending |
| ATTR-03 | TBD | Pending |
| QUAL-01 | TBD | Pending |
| QUAL-02 | TBD | Pending |
| QUAL-03 | TBD | Pending |
| QUAL-04 | TBD | Pending |
| LOOP-01 | TBD | Pending |
| LOOP-02 | TBD | Pending |
| LOOP-03 | TBD | Pending |
| LOOP-04 | TBD | Pending |
| LOOP-05 | TBD | Pending |
| INTL-01 | TBD | Pending |
| INTL-02 | TBD | Pending |
| INTL-03 | TBD | Pending |
| XPRT-01 | TBD | Pending |
| XPRT-02 | TBD | Pending |
| XPRT-03 | TBD | Pending |
| XPRT-04 | TBD | Pending |
| XPRT-05 | TBD | Pending |
| SUBW-01 | TBD | Pending |
| SUBW-02 | TBD | Pending |
| SUBW-03 | TBD | Pending |
| SUBW-04 | TBD | Pending |
| SUBW-05 | TBD | Pending |
| PROOF-01 | TBD | Pending |
| PROOF-02 | TBD | Pending |

**Coverage:**
- v2 requirements: 27 total
- Mapped to phases: 0
- Unmapped: 27 (pending roadmap)

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 after v2.0 milestone start*
