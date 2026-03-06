# RLHF Feedback Loop

[![CI](https://github.com/IgorGanapolsky/rlhf-feedback-loop/actions/workflows/ci.yml/badge.svg)](https://github.com/IgorGanapolsky/rlhf-feedback-loop/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/rlhf-feedback-loop)](https://www.npmjs.com/package/rlhf-feedback-loop)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP Ready](https://img.shields.io/badge/MCP-ready-black)](adapters/mcp/server-stdio.js)
[![DPO Ready](https://img.shields.io/badge/DPO-ready-blue)](scripts/export-dpo-pairs.js)

**The complete RLHF data pipeline for AI coding agents.** Capture human feedback, build memory, generate prevention rules, and export DPO training pairs — the full loop from thumbs up/down to model fine-tuning.

## What This Is (and Isn't)

This tool implements the **data collection and preference pipeline** side of RLHF — the part that turns your daily interactions with AI agents into structured training data. Out of the box, it:

- **Captures** thumbs up/down feedback with context, tags, and rubric scores
- **Remembers** via JSONL logs + LanceDB vector search across sessions
- **Prevents** repeated mistakes with auto-generated guardrails
- **Recalls** relevant past feedback mid-conversation (in-session context injection)
- **Exports** DPO training pairs (prompt/chosen/rejected) for model fine-tuning

It does **not** update model weights in real-time. That's the fine-tuning step, which you do separately using the DPO pairs this tool exports. The full loop: capture feedback here → export DPO pairs → fine-tune with [TRL](https://github.com/huggingface/trl), [OpenPipe](https://openpipe.ai), or any DPO trainer → deploy improved model.

## Architecture

![RLHF Architecture](docs/diagrams/rlhf-architecture-pb.png)

![Plugin Topology](docs/diagrams/plugin-topology-pb.png)

## Get Started

One command. Pick your platform:

| Platform | Install |
|----------|---------|
| **Claude** | `claude mcp add rlhf -- npx -y rlhf-feedback-loop serve` |
| **Codex** | `codex mcp add rlhf -- npx -y rlhf-feedback-loop serve` |
| **Gemini** | `gemini mcp add rlhf "npx -y rlhf-feedback-loop serve"` |
| **Amp** | `amp mcp add rlhf -- npx -y rlhf-feedback-loop serve` |
| **Cursor** | `cursor mcp add rlhf -- npx -y rlhf-feedback-loop serve` |
| **All at once** | `npx add-mcp rlhf-feedback-loop` |

That's it. Your agent can now capture feedback, recall past learnings mid-conversation, and block repeated mistakes. Run once per project — the MCP server starts automatically on each session.

## How It Works

```
Thumbs up/down
      |
      v
  Capture → JSONL log
      |
      v
  Rubric engine (block false positives)
      |
  +---+---+
  |       |
 Good    Bad
  |       |
  v       v
Learn   Prevention rule
  |       |
  v       v
LanceDB   ShieldCortex
vectors   context packs
  |
  v
DPO export → fine-tune your model
```

All data stored locally as **JSONL** files — fully transparent, fully portable, no vendor lock-in. **LanceDB** indexes memories as vector embeddings for semantic search. **ShieldCortex** assembles context packs so your agent starts each task informed.

## Free vs. Cloud Pro

The open-source package is fully functional and free forever. Cloud Pro is for teams that don't want to self-host.

| | Open Source | Cloud Pro ($10/mo) |
|---|---|---|
| Feedback capture | Local MCP server | Hosted HTTPS API |
| Storage | Your machine | Managed cloud |
| DPO export | CLI command | API endpoint |
| Setup | `mcp add` one-liner | Provisioned API key |
| Team sharing | Manual (share JSONL) | Built-in (shared API) |
| Support | GitHub Issues | Email |
| Uptime | You manage | We manage (99.9% SLA) |

[Get Cloud Pro](https://buy.stripe.com/bJe14neyU4r4f0leOD3sI02) | [Live API](https://rlhf-feedback-loop-710216278770.us-central1.run.app)

## Deep Dive

- [API Reference](openapi/openapi.yaml) — full OpenAPI spec
- [Context Engine](docs/CONTEXTFS.md) — multi-agent memory orchestration
- [Autonomous GitOps](docs/AUTONOMOUS_GITOPS.md) — self-healing CI/CD
- [Contributing](CONTRIBUTING.md)

## License

MIT. See [LICENSE](LICENSE).
