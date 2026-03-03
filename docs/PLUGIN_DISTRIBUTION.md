# Offer This As A Plugin/Skill

Yes. This repo is designed so the same RLHF loop can be offered in multiple agent ecosystems.

## Architecture

1. Capture layer: maps thumbs up/down signals into structured events.
2. Schema layer: enforces typed memories and rejects vague feedback.
3. Learning layer: stores `error` and `learning` memories.
4. Prevention layer: generates rules from repeated mistakes.
5. Distillation layer: exports DPO pairs (`prompt/chosen/rejected`).

## Claude Skill

- Ship `plugins/claude-skill/SKILL.md`.
- Skill runs `.claude/scripts/feedback/capture-feedback.js` on thumbs feedback.
- Session start can inject `npm run feedback:summary` and generated rules.

## Codex/OpenAI Agent Profile

- Ship `plugins/codex-profile/AGENTS.md` snippet.
- Add rule: on positive/negative user signals, execute capture command.
- Before edits, run summary/rules command and apply prevention guidance.

## Gemini Plugin/Skill

- Ship `plugins/gemini-extension/gemini_prompt.txt` and tool contract.
- Gemini tool call passes signal/context/tags into the same capture script.
- Use periodic `feedback:export:dpo` to produce training data.

## Multi-tenant/SaaS Path

- Replace local JSONL with API-backed memory store.
- Keep schema validation unchanged at the ingestion boundary.
- Add workspace/project IDs to all records.

