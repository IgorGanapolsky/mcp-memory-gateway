---
name: rlhf-feedback
description: Capture thumbs up/down feedback into structured memories and prevention rules
triggers:
  - thumbs up
  - thumbs down
  - that worked
  - that failed
---

# RLHF Feedback Skill

When user provides feedback, execute:

```bash
# negative
node .claude/scripts/feedback/capture-feedback.js \
  --feedback=down \
  --context="<what failed>" \
  --what-went-wrong="<specific failure>" \
  --what-to-change="<prevention action>" \
  --tags="<domain>,regression"

# positive
node .claude/scripts/feedback/capture-feedback.js \
  --feedback=up \
  --context="<what succeeded>" \
  --what-worked="<repeatable pattern>" \
  --tags="<domain>,fix"
```

At session start, run:

```bash
npm run feedback:summary
npm run feedback:rules
```
