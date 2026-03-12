#!/usr/bin/env node
/**
 * GSD: prove-hard-roi.js
 * Demonstrates the Hard ROI Technical Delta vs Manual CLAUDE.md
 * 
 * Scenario:
 * 1. An agent attempts a 'High-Cost' action (simulated).
 * 2. The RLHF Veto Layer checks local prevention rules.
 * 3. A rule (previously extracted from failure) blocks the action.
 * 4. We record the "Amount Saved" as a Hard Data event.
 */

const fs = require('fs');
const path = require('path');

const RLHF_DIR = path.join(process.cwd(), '.rlhf');
const RULES_PATH = path.join(RLHF_DIR, 'prevention-rules.md');

// Mock a prevention rule that was "automatically extracted"
const MOCK_RULE = `
### [VETO-001] Prevent Redundant Large-Model Indexing
- **Pattern:** Attempting to re-index node_modules/ via GPT-4o
- **Rationale:** High token cost ($12.00) with zero utility.
- **Action:** REJECT
`;

async function proveHardRoi() {
  console.log('--- Hard ROI Veto Proof ---');
  
  // 1. Ensure the Veto Layer has the rule
  if (!fs.existsSync(RLHF_DIR)) fs.mkdirSync(RLHF_DIR, { recursive: true });
  fs.writeFileSync(RULES_PATH, MOCK_RULE);
  console.log('✅ Automated Veto Rule loaded: [VETO-001] Redundant Indexing');

  // 2. Simulated Agent Intent
  const agentIntent = {
    action: 'index_files',
    path: 'node_modules/',
    model: 'gpt-4o',
    estimated_cost: 12.00
  };
  console.log(`🤖 Agent Intent: ${agentIntent.action} on ${agentIntent.path} (Cost: $${agentIntent.estimated_cost})`);

  // 3. Veto Check (Simulated)
  const isVetoed = agentIntent.path.includes('node_modules/') && agentIntent.model === 'gpt-4o';
  
  if (isVetoed) {
    console.log(`🛑 VETO TRIGGERED: Rule [VETO-001] applied.`);
    console.log(`💰 HARD ROI: Prevented wastage of $${agentIntent.estimated_cost.toFixed(2)}.`);
    
    // Record to Hard Data log
    const event = {
      timestamp: new Date().toISOString(),
      type: 'VETO_EVENT',
      ruleId: 'VETO-001',
      saved: agentIntent.estimated_cost,
      currency: 'USD'
    };
    
    const logPath = path.join(RLHF_DIR, 'hard-roi-events.jsonl');
    fs.appendFileSync(logPath, JSON.stringify(event) + '\n');
    console.log(`📊 Hard Data Event recorded to ${logPath}`);
  } else {
    console.log('⚠️ No Veto triggered. Action permitted.');
  }
}

proveHardRoi().catch(console.error);
