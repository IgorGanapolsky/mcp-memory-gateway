# Agentic Feedback Studio — The Veto Layer & RLHF-Ready Dataset Engine

[![CI](https://github.com/IgorGanapolsky/rlhf-feedback-loop/actions/workflows/ci.yml/badge.svg)](https://github.com/IgorGanapolsky/rlhf-feedback-loop/actions/workflows/ci.yml)
[![Marketplace Ready](https://img.shields.io/badge/Anthropic_Marketplace-Ready-blue)](docs/ANTHROPIC_MARKETPLACE_STRATEGY.md)
[![Veto Powered](https://img.shields.io/badge/Governance-Veto_Layer-red)](docs/VERIFICATION_EVIDENCE.md)

**The operational layer for high-density preference data.** Stop vibe-coding and start context engineering. The Agentic Feedback Studio provides the **Veto Layer** for AI workflows, capturing human feedback to generate **RLHF-ready datasets** and enforce kernel-level guardrails.

## Why This Matters: From Vibes to Verification (V2V)

Most AI agents run on "vibes." We provide the infrastructure to convert those vibes into **Hard Evidence** for continuous improvement.

- **Veto Layer (Governance):** Convert subjective user feedback into non-bypassable architectural constraints (`CLAUDE.md`).
- **RLHF-Ready Datasets:** Automatically generate high-density DPO (Direct Preference Optimization) pairs from real-world agent interactions.
- **Online Bayesian Reward Estimation:** Uses Thompson Sampling to model user preferences in real-time, providing a local "Reward Signal" without heavy training.

## True Plug-and-Play: Zero-Config Integration

The Feedback Studio is a **Universal Agent Skill**. You can drop it into any repository without manual setup.

- **Zero-Config Discovery:** Automatically detects project context. If no local `.rlhf/` directory exists, it safely fallbacks to a project-scoped global store in `~/.rlhf/`.
- **Global Skill Installation:** Run one command to make the Studio available to all your agents across all projects.

### Quick Start (One Command)

```bash
npx rlhf-feedback-loop install
```

This will auto-detect your platforms (Claude, Codex, Gemini, Cursor) and install the feedback skill globally.

## Use Cases

- **Automated Code Reviews:** Capture PR feedback to enforce team-specific style guides autonomously.
- **Self-Healing Multi-Agent Systems:** Share Veto rules across a swarm of agents to avoid systemic bottlenecks.
- **DPO Dataset Engineering:** Collect proprietary preference data to fine-tune smaller, faster models that perform like GPT-4 on your specific codebase.

## Get Started

One command. Pick your platform:

| Platform | Install |
|----------|---------|
| **Claude** | `claude mcp add rlhf -- npx -y rlhf-feedback-loop serve` |
| **Codex** | `codex mcp add rlhf -- npx -y rlhf-feedback-loop serve` |
| **Gemini** | `gemini mcp add rlhf "npx -y rlhf-feedback-loop serve"` |
| **Amp** | `amp mcp add rlhf -- npx -y rlhf-feedback-loop serve` |
| **Cursor** | `cursor mcp add rlhf -- npx -y rlhf-feedback-loop serve` |

## How It Works

```
Subjective Signal (Vibe)
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
Learn   Veto Layer (Rule)
  |       |
  v       v
LanceDB   ShieldCortex
vectors   context packs
  |
  v
DPO export → RLHF / Fine-tune your model
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

[Get Cloud Pro](https://buy.stripe.com/bJe14neyU4r4f0leOD3sI02) | [Live API](https://rlhf-feedback-loop-710216278770.us-central1.run.app)

## License

MIT. See [LICENSE](LICENSE).
