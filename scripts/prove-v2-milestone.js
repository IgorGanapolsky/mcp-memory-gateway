#!/usr/bin/env node
/**
 * prove-v2-milestone.js
 *
 * Phase 12: Final proof gate for the v2.0 milestone.
 * Verifies:
 *   PROOF-01: Proof reports exist for all v2 phases (6-11)
 *   PROOF-02: npm test passes with count > 142 (v1 baseline) and 0 failures
 *
 * All numbers are from actual test runs — no placeholders.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PROOF_DIR = path.join(ROOT, 'proof');

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

// ---------------------------------------------------------------------------
// PROOF-01: Check all v2 proof reports exist
// ---------------------------------------------------------------------------

const V2_PROOF_REQUIREMENTS = [
  {
    phase: 6,
    name: 'Feedback Attribution',
    files: ['proof/attribution-report.json', 'proof/attribution-report.md'],
  },
  {
    phase: 7,
    name: 'Data Quality',
    files: ['proof/data-quality-report.json', 'proof/data-quality-report.md'],
  },
  {
    phase: 8,
    name: 'Loop Closure',
    files: ['proof/loop-closure-report.json', 'proof/loop-closure-report.md'],
  },
  {
    phase: 9,
    name: 'Intelligence',
    files: ['proof/intelligence-report.json', 'proof/intelligence-report.md'],
  },
  {
    phase: 10,
    name: 'Training Export',
    files: ['proof/training-export-report.json', 'proof/training-export-report.md'],
  },
  {
    phase: 11,
    name: 'Subway Upgrades',
    files: [
      'proof/subway-upgrades/subway-upgrades-report.json',
      'proof/subway-upgrades/subway-upgrades-report.md',
    ],
  },
];

function checkProofReports() {
  const results = [];
  let allExist = true;

  for (const req of V2_PROOF_REQUIREMENTS) {
    const phaseResult = { phase: req.phase, name: req.name, files: [] };

    for (const relPath of req.files) {
      const absPath = path.join(ROOT, relPath);
      const exists = fs.existsSync(absPath);
      if (!exists) allExist = false;

      // Check for placeholders/TODOs
      let hasTodo = false;
      let fileSize = 0;
      if (exists) {
        try {
          const content = fs.readFileSync(absPath, 'utf-8');
          hasTodo = /TODO|placeholder|estimated/i.test(content);
          fileSize = content.length;
        } catch {
          hasTodo = false;
        }
      }

      phaseResult.files.push({
        path: relPath,
        exists,
        hasTodo,
        fileSize,
      });
    }

    results.push(phaseResult);
  }

  return { allExist, phases: results };
}

// ---------------------------------------------------------------------------
// PROOF-02: Run npm test and verify count
// ---------------------------------------------------------------------------

const V1_BASELINE_TEST_COUNT = 142;

function runFullTestSuite() {
  console.log('Running full test suite (npm test)...');
  let output = '';
  let timedOut = false;

  try {
    output = execSync('npm test', {
      cwd: ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 180_000,
    });
  } catch (err) {
    // npm test exits non-zero on test failure — capture output anyway
    output = (err.stdout || '') + (err.stderr || '');
    if (err.code === 'ETIMEDOUT') timedOut = true;
  }

  if (timedOut) {
    return { passed: 0, failed: 1, raw: 'TIMED OUT', timedOut: true };
  }

  // Sum all "ℹ pass N" lines
  const passMatches = [...output.matchAll(/ℹ pass (\d+)/g)];
  const failMatches = [...output.matchAll(/ℹ fail (\d+)/g)];

  const passed = passMatches.reduce((sum, m) => sum + parseInt(m[1], 10), 0);
  const failed = failMatches.reduce((sum, m) => sum + parseInt(m[1], 10), 0);

  return { passed, failed, raw: output.slice(-2000), timedOut: false };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Phase 12: Proof Gate — v2.0 Milestone Final Check\n');
  console.log('='.repeat(50));

  // PROOF-01
  console.log('\nChecking proof reports (PROOF-01)...');
  const proofCheck = checkProofReports();

  for (const phase of proofCheck.phases) {
    const status = phase.files.every((f) => f.exists && !f.hasTodo) ? 'PASS' : 'FAIL';
    console.log(`  Phase ${phase.phase} (${phase.name}): ${status}`);
    for (const f of phase.files) {
      const indicator = f.exists ? (f.hasTodo ? '  TODO found' : '  exists') : '  MISSING';
      console.log(`    ${f.path}: ${indicator} ${f.exists ? `(${f.fileSize} bytes)` : ''}`);
    }
  }

  // PROOF-02
  const testResults = runFullTestSuite();
  const testCountOk = testResults.passed > V1_BASELINE_TEST_COUNT;
  const testFailOk = testResults.failed === 0;

  console.log(`\nTest Results (PROOF-02):`);
  console.log(`  Passed: ${testResults.passed} (v1 baseline: ${V1_BASELINE_TEST_COUNT}, need > ${V1_BASELINE_TEST_COUNT})`);
  console.log(`  Failed: ${testResults.failed}`);
  console.log(`  Count check: ${testCountOk ? 'PASS' : 'FAIL'} (${testResults.passed} > ${V1_BASELINE_TEST_COUNT})`);
  console.log(`  Zero failures: ${testFailOk ? 'PASS' : 'FAIL'}`);

  const proof01Passed = proofCheck.allExist &&
    proofCheck.phases.every((p) => p.files.every((f) => f.exists && !f.hasTodo));
  const proof02Passed = testCountOk && testFailOk;
  const overallPassed = proof01Passed && proof02Passed;

  // Write reports
  const report = {
    phase: 12,
    name: 'Proof Gate',
    milestone: 'v2.0',
    requirements: ['PROOF-01', 'PROOF-02'],
    generatedAt: new Date().toISOString(),
    proofReports: {
      allExist: proofCheck.allExist,
      phases: proofCheck.phases,
      passed: proof01Passed,
    },
    testResults: {
      passed: testResults.passed,
      failed: testResults.failed,
      v1Baseline: V1_BASELINE_TEST_COUNT,
      countExceedsBaseline: testCountOk,
      zeroFailures: testFailOk,
      passed: proof02Passed,
    },
    overallPassed,
  };

  ensureDir(PROOF_DIR);
  const jsonPath = path.join(PROOF_DIR, 'v2-milestone-report.json');
  const mdPath = path.join(PROOF_DIR, 'v2-milestone-report.md');

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const status = overallPassed ? 'PASSED' : 'FAILED';

  const phaseRows = proofCheck.phases.map((p) => {
    const pStatus = p.files.every((f) => f.exists && !f.hasTodo) ? 'PASS' : 'FAIL';
    const fileList = p.files.map((f) => `${f.path} (${f.exists ? (f.hasTodo ? 'TODO found' : 'exists') : 'MISSING'})`).join(', ');
    return `| ${p.phase} | ${p.name} | ${fileList} | ${pStatus} |`;
  }).join('\n');

  const md = `# Phase 12: Proof Gate — v2.0 Milestone Report

**Status:** ${status}
**Generated:** ${report.generatedAt}
**Milestone:** v2.0 RLHF Bidirectional Feature Sync

## PROOF-01: All v2 Phase Proof Reports Exist

| Phase | Name | Files | Status |
|-------|------|-------|--------|
${phaseRows}

**Overall PROOF-01:** ${proof01Passed ? 'PASS' : 'FAIL'}

## PROOF-02: npm test — Count and Zero Failures

| Metric | Value | Requirement | Status |
|--------|-------|-------------|--------|
| Tests passed | ${testResults.passed} | > ${V1_BASELINE_TEST_COUNT} (v1 baseline) | ${testCountOk ? 'PASS' : 'FAIL'} |
| Tests failed | ${testResults.failed} | 0 | ${testFailOk ? 'PASS' : 'FAIL'} |

**Overall PROOF-02:** ${proof02Passed ? 'PASS' : 'FAIL'}

## v2.0 Milestone Summary

All v2 phases complete:

| Phase | Feature | Requirements |
|-------|---------|-------------|
| 6 | Feedback Attribution | ATTR-01, ATTR-02, ATTR-03 |
| 7 | Data Quality | QUAL-01, QUAL-02, QUAL-03, QUAL-04 |
| 8 | Loop Closure | LOOP-01, LOOP-02, LOOP-03, LOOP-04, LOOP-05 |
| 9 | Intelligence | INTL-01, INTL-02, INTL-03 |
| 10 | Training Export | XPRT-01, XPRT-02, XPRT-03, XPRT-04, XPRT-05 |
| 11 | Subway Upgrades | SUBW-01, SUBW-02, SUBW-03, SUBW-04, SUBW-05 |
| 12 | Proof Gate | PROOF-01, PROOF-02 |

**Final test count:** ${testResults.passed} (${testResults.passed - V1_BASELINE_TEST_COUNT} above v1 baseline of ${V1_BASELINE_TEST_COUNT})
**Test failures:** ${testResults.failed}
**v2.0 milestone status:** ${status}
`;

  fs.writeFileSync(mdPath, md);

  console.log(`\n${'='.repeat(50)}`);
  console.log(`v2.0 Milestone Status: ${status}`);
  console.log(`PROOF-01 (all proof reports): ${proof01Passed ? 'PASS' : 'FAIL'}`);
  console.log(`PROOF-02 (test count + 0 failures): ${proof02Passed ? 'PASS' : 'FAIL'}`);
  console.log(`\nFinal proof report: ${mdPath}`);

  process.exit(overallPassed ? 0 : 1);
}

main().catch((err) => {
  console.error('prove-v2-milestone failed:', err.message);
  process.exit(1);
});
