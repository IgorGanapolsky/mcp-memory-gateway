#!/usr/bin/env node
/**
 * scripts/optimize-context.js
 * 
 * The "Pro" Wedge:
 * 1. Scans CLAUDE.md for manual rules and commands.
 * 2. Migrates them into the structured .rlhf/prevention-rules.md (The Veto Layer).
 * 3. Prunes CLAUDE.md to reduce LLM context bloat.
 * 4. Records "Context Saved" as a performance metric.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CWD = process.cwd();
const CLAUDE_MD_PATH = path.join(CWD, 'CLAUDE.md');
const RLHF_DIR = path.join(CWD, '.rlhf');
const RULES_PATH = path.join(RLHF_DIR, 'prevention-rules.md');

function optimize() {
  console.log('🚀 [Context Optimizer] Starting CLAUDE.md migration...');

  if (!fs.existsSync(CLAUDE_MD_PATH)) {
    console.error('❌ CLAUDE.md not found in current directory.');
    return;
  }

  const content = fs.readFileSync(CLAUDE_MD_PATH, 'utf8');
  const lines = content.split('\n');
  const initialSize = content.length;

  // Simple heuristic to find "Rules" or "Directives"
  let ruleSection = [];
  let inRuleSection = false;

  lines.forEach(line => {
    if (line.match(/## (Rules|Directives|Operating Contract|Guidelines|Protocol)/i)) {
      inRuleSection = true;
    } else if (line.startsWith('## ') && inRuleSection) {
      inRuleSection = false;
    }

    if (inRuleSection && line.trim() && !line.startsWith('## ')) {
      ruleSection.push(line);
    }
  });

  if (ruleSection.length === 0) {
    console.log('ℹ️ No manual rules found to migrate.');
    return;
  }

  // 1. Migrate to Veto Layer
  if (!fs.existsSync(RLHF_DIR)) fs.mkdirSync(RLHF_DIR, { recursive: true });
  
  let existingRules = '';
  if (fs.existsSync(RULES_PATH)) {
    existingRules = fs.readFileSync(RULES_PATH, 'utf8');
  }

  const migrationHeader = `\n### [MIGRATED-${Date.now()}] Rules from CLAUDE.md\n`;
  const newRules = migrationHeader + ruleSection.join('\n') + '\n';
  
  fs.writeFileSync(RULES_PATH, existingRules + newRules);
  console.log(`✅ Migrated ${ruleSection.length} lines to the Veto Layer (.rlhf/prevention-rules.md)`);

  // 2. Prune CLAUDE.md (keep headers, remove the deep list)
  let prunedLines = [];
  let skipping = false;
  lines.forEach(line => {
    if (line.match(/## (Rules|Directives|Operating Contract|Guidelines|Protocol)/i)) {
      prunedLines.push(line);
      prunedLines.push('> 💡 Rules migrated to the Veto Layer. Run `npx rlhf-feedback-loop rules` to view or edit.');
      skipping = true;
    } else if (line.startsWith('## ') && skipping) {
      skipping = false;
      prunedLines.push(line);
    } else if (!skipping) {
      prunedLines.push(line);
    }
  });

  const finalContent = prunedLines.join('\n');
  fs.writeFileSync(CLAUDE_MD_PATH, finalContent);
  
  const finalSize = finalContent.length;
  const saved = initialSize - finalSize;
  const tokenSaving = Math.round(saved / 4);

  console.log(`🧹 CLAUDE.md pruned. Saved ${saved} bytes (~${tokenSaving} tokens per turn).`);
  console.log('✨ Optimization complete. Your LLM context is now leaner and rules are enforced by the Veto Layer.');
}

if (require.main === module) {
  optimize();
}

module.exports = { optimize };
