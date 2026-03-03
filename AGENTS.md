# AGENTS.md

## RLHF Execution Policy

This project uses a local-first RLHF operational loop.

On explicit user feedback signals (`thumbs up/down`, `that worked/failed`, `correct/wrong`):

1. Capture feedback immediately with rich context.
2. Enforce schema validation before memory storage.
3. Reject vague signals (for example bare "thumbs down") from memory promotion.
4. Regenerate prevention rules from accumulated mistakes.

## Required Commands

```bash
# Capture positive feedback
node .claude/scripts/feedback/capture-feedback.js \
  --feedback=up \
  --context="<what worked>" \
  --what-worked="<repeatable pattern>" \
  --tags="<domain>,fix"

# Capture negative feedback
node .claude/scripts/feedback/capture-feedback.js \
  --feedback=down \
  --context="<what failed>" \
  --what-went-wrong="<failure details>" \
  --what-to-change="<prevention action>" \
  --tags="<domain>,regression"
```

## Session Start

```bash
npm run feedback:summary
npm run feedback:rules
```

Treat generated prevention rules as hard constraints for the current session.

## Anti-patterns

- Do not claim online fine-tuning happened when it did not.
- Do not store low-signal feedback memories (too short, generic tags only, or missing context).
- Do not bypass schema validation.
