# CLAUDE.md

## Purpose

Use this repository to continuously learn from thumbs-up / thumbs-down feedback and prevent repeated mistakes.

## Operating Loop

1. Detect explicit user feedback signal.
2. Run capture script with context and domain tags.
3. Store validated `error` or `learning` memory.
4. Refresh prevention rules from repeated mistake patterns.
5. Before new work, apply summary + prevention rules.

## Commands

```bash
# Capture feedback
node .claude/scripts/feedback/capture-feedback.js --feedback=up --context="..." --tags="..."
node .claude/scripts/feedback/capture-feedback.js --feedback=down --context="..." --tags="..."

# Analyze and prevent repeats
npm run feedback:stats
npm run feedback:summary
npm run feedback:rules

# Export DPO training pairs
npm run feedback:export:dpo
```

## Behavioral Requirements

- If signal is negative, provide `what-went-wrong` and `what-to-change` when available.
- If signal is positive, provide `what-worked` when available.
- If context is insufficient, record event but do not promote to memory.
- Never report completion without verification evidence.

## Data Location

All feedback data is local and git-ignored:

- `.claude/memory/feedback/feedback-log.jsonl`
- `.claude/memory/feedback/memory-log.jsonl`
- `.claude/memory/feedback/feedback-summary.json`
- `.claude/memory/feedback/prevention-rules.md`
