# GEMINI.md

## Gemini Integration Contract

Gemini should use this RLHF loop as a tool-backed skill.

## Tool Actions

1. `capture_feedback`
2. `feedback_summary`
3. `prevention_rules`

See `plugins/gemini-extension/tool_contract.json` for schema.

## Required Behavior

- On explicit thumbs or direct positive/negative user outcome signals, call `capture_feedback`.
- Always include actionable context.
- Map `up` to learning memory, `down` to mistake memory.
- For low-context signals, preserve event but avoid memory promotion.

## Suggested Runtime Mapping

`capture_feedback` executes:

```bash
node .claude/scripts/feedback/capture-feedback.js --feedback=<up|down> --context="..." --tags="..."
```

`feedback_summary` executes:

```bash
npm run feedback:summary
```

`prevention_rules` executes:

```bash
npm run feedback:rules
```

## Objective

Use feedback-derived prevention rules as constraints to reduce repeated failures across sessions.
