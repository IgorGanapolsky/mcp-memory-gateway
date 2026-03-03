# RLHF Feedback Loop (OSS)

This repository implements a practical RLHF-style operational loop for coding agents:

- Capture `thumbs up/down` feedback with rich context
- Convert to typed `error/learning` memories
- Reject vague/noisy feedback via schema validation
- Generate prevention rules from repeated mistakes
- Export DPO preference pairs for model tuning

## Quick Start

```bash
npm test
```

Capture feedback:

```bash
# negative signal
node .claude/scripts/feedback/capture-feedback.js \
  --feedback=down \
  --context="Claimed fix without running tests" \
  --what-went-wrong="No verification evidence" \
  --what-to-change="Always run tests before completion claims" \
  --tags="verification,testing"

# positive signal
node .claude/scripts/feedback/capture-feedback.js \
  --feedback=up \
  --context="Fix passed with test output" \
  --what-worked="Evidence-first completion flow" \
  --tags="verification,fix"
```

Inspect loop state:

```bash
npm run feedback:stats
npm run feedback:summary
npm run feedback:rules
```

Export DPO pairs:

```bash
npm run feedback:export:dpo
```

## Data Files (local-only)

- `.claude/memory/feedback/feedback-log.jsonl`
- `.claude/memory/feedback/memory-log.jsonl`
- `.claude/memory/feedback/feedback-summary.json`
- `.claude/memory/feedback/prevention-rules.md`
- `.claude/memory/feedback/dpo-pairs.jsonl`

These are git-ignored by default.

## Is This "Full RLHF"?

This is a full operational feedback loop for agent behavior learning and mistake prevention.
It is **not** gradient-based online fine-tuning inside this repo; instead it produces clean training data (`DPO` pairs) and immediate behavior constraints (`prevention rules`).

## Ship as Plugin/Skill

See [docs/PLUGIN_DISTRIBUTION.md](docs/PLUGIN_DISTRIBUTION.md) for Claude Skill, Codex profile, and Gemini extension packaging.

## Screenshots You Shared

The two screenshots were reviewed while setting this up (March 3, 2026). They are not included in this repository to avoid publishing personal account/support-chat data.

