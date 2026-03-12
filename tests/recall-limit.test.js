'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rlhf-recall-limit-'));
process.env.RLHF_FEEDBACK_DIR = tmpDir;
process.env.RLHF_MCP_PROFILE = 'default';

const { callTool } = require('../adapters/mcp/server-stdio');

test('recall returns results without upgrade nudge for first 5 calls', async () => {
  for (let i = 0; i < 5; i++) {
    const result = await callTool('recall', { query: 'test task' });
    const text = result.content[0].text;
    assert.ok(!text.includes('Upgrade to Context Gateway'), `Call ${i + 1} should not show upgrade nudge`);
  }
});

test('recall shows upgrade nudge after 5 calls in a day', async () => {
  // The 5 calls above already consumed the limit
  const result = await callTool('recall', { query: 'test task 6' });
  const text = result.content[0].text;
  assert.ok(text.includes('Upgrade to Context Gateway'), 'Call 6 should show upgrade nudge');
  assert.ok(text.includes('gumroad.com'), 'Should include Gumroad link');
  assert.ok(text.includes('rlhf-feedback-loop-production'), 'Should include hosted API link');
});

test('recall still returns actual results even when over limit', async () => {
  const result = await callTool('recall', { query: 'test task' });
  const text = result.content[0].text;
  // Should have both results AND the nudge
  assert.ok(text.length > 50, 'Should still return content, not just the nudge');
});

test.after(() => {
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
});
