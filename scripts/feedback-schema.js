#!/usr/bin/env node
/**
 * Feedback Schema Validator
 *
 * Implements three reliability patterns:
 *   1. Typed schemas — enforce structure on every feedback memory
 *   2. Action schemas — discriminated union of allowed feedback actions
 *   3. Validation at boundaries — reject bad data before storage
 */

const GENERIC_TAGS = new Set(['feedback', 'positive', 'negative']);
const MIN_CONTENT_LENGTH = 20;
const VALID_TITLE_PREFIXES = ['SUCCESS:', 'MISTAKE:', 'LEARNING:', 'PREFERENCE:'];
const VALID_CATEGORIES = new Set(['error', 'learning', 'preference']);

function validateFeedbackMemory(memory) {
  const issues = [];

  if (!memory.title || typeof memory.title !== 'string') {
    issues.push('title: required string');
  } else {
    const hasPrefix = VALID_TITLE_PREFIXES.some((p) => memory.title.startsWith(p));
    if (!hasPrefix) {
      issues.push(`title: must start with one of ${VALID_TITLE_PREFIXES.join(', ')}`);
    }
    const afterPrefix = memory.title.replace(/^(SUCCESS|MISTAKE|LEARNING|PREFERENCE):\s*/, '');
    if (afterPrefix.length < 5) {
      issues.push('title: description after prefix too short (min 5 chars)');
    }
  }

  if (!memory.content || typeof memory.content !== 'string') {
    issues.push('content: required string');
  } else if (memory.content.length < MIN_CONTENT_LENGTH) {
    issues.push(`content: too short (${memory.content.length} chars, min ${MIN_CONTENT_LENGTH})`);
  }

  if (!memory.category) {
    issues.push('category: required');
  } else if (!VALID_CATEGORIES.has(memory.category)) {
    issues.push(`category: must be one of ${[...VALID_CATEGORIES].join(', ')} (got "${memory.category}")`);
  }

  if (!Array.isArray(memory.tags) || memory.tags.length === 0) {
    issues.push('tags: at least 1 tag required');
  } else {
    const domainTags = memory.tags.filter((t) => !GENERIC_TAGS.has(t));
    if (domainTags.length === 0) {
      issues.push('tags: at least 1 non-generic tag required');
    }
  }

  if (memory.title && memory.category) {
    const titleIsError = memory.title.startsWith('MISTAKE:');
    const titleIsSuccess = memory.title.startsWith('SUCCESS:') || memory.title.startsWith('LEARNING:');
    if (titleIsError && memory.category !== 'error') {
      issues.push('consistency: MISTAKE title should have category "error"');
    }
    if (titleIsSuccess && memory.category === 'error') {
      issues.push('consistency: SUCCESS/LEARNING title should not have category "error"');
    }
  }

  return { valid: issues.length === 0, issues };
}

function resolveFeedbackAction(params) {
  const { signal, context, whatWentWrong, whatToChange, whatWorked, tags } = params;

  if (!context && !whatWentWrong && !whatWorked) {
    return { type: 'no-action', reason: 'No context provided — cannot create actionable memory' };
  }

  const domainTags = (tags || []).filter((t) => !GENERIC_TAGS.has(t));

  if (signal === 'negative') {
    if (!whatWentWrong && !context) {
      return { type: 'no-action', reason: 'Negative feedback without context — cannot determine what went wrong' };
    }

    const content = [
      whatWentWrong ? `What went wrong: ${whatWentWrong}` : `Context: ${context}`,
      whatToChange ? `How to avoid: ${whatToChange}` : 'Action needed: investigate and prevent recurrence',
    ].join('\n');

    const description = whatWentWrong ? whatWentWrong.slice(0, 60) : (context || '').slice(0, 60);

    return {
      type: 'store-mistake',
      memory: {
        title: `MISTAKE: ${description}`,
        content,
        category: 'error',
        importance: 'high',
        tags: ['feedback', 'negative', ...domainTags],
      },
    };
  }

  if (signal === 'positive') {
    if (!whatWorked && !context) {
      return { type: 'no-action', reason: 'Positive feedback without context — cannot determine what worked' };
    }

    const content = whatWorked ? `What worked: ${whatWorked}` : `Approach: ${context}`;
    const description = whatWorked ? whatWorked.slice(0, 60) : (context || '').slice(0, 60);

    return {
      type: 'store-learning',
      memory: {
        title: `SUCCESS: ${description}`,
        content,
        category: 'learning',
        importance: 'normal',
        tags: ['feedback', 'positive', ...domainTags],
      },
    };
  }

  return { type: 'no-action', reason: `Unknown signal: ${signal}` };
}

function prepareForStorage(memory) {
  const validation = validateFeedbackMemory(memory);
  if (!validation.valid) {
    return { ok: false, issues: validation.issues };
  }
  return { ok: true, memory };
}

function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      passed++;
      console.log(`  PASS ${name}`);
    } else {
      failed++;
      console.log(`  FAIL ${name}`);
    }
  }

  console.log('\nfeedback-schema.js tests\n');

  const goodError = {
    title: 'MISTAKE: Did not verify before claiming fixed',
    content: 'Always run tests and show evidence before claiming the work is complete.',
    category: 'error',
    tags: ['feedback', 'negative', 'verification'],
  };
  assert(validateFeedbackMemory(goodError).valid, 'valid error memory passes');

  const shortContent = {
    title: 'MISTAKE: Bad fix regression',
    content: 'thumbs down',
    category: 'error',
    tags: ['verification'],
  };
  assert(!validateFeedbackMemory(shortContent).valid, 'short content fails');

  const bareThumbsDown = resolveFeedbackAction({ signal: 'negative' });
  assert(bareThumbsDown.type === 'no-action', 'bare negative feedback becomes no-action');

  const fullNegative = resolveFeedbackAction({
    signal: 'negative',
    context: 'Pushed code with no tests',
    whatWentWrong: 'Claimed fixed without test output',
    whatToChange: 'Always run tests first',
    tags: ['testing', 'verification'],
  });
  assert(fullNegative.type === 'store-mistake', 'negative feedback creates store-mistake action');

  const prep = prepareForStorage(fullNegative.memory);
  assert(prep.ok, 'store-mistake memory passes storage validation');

  const fullPositive = resolveFeedbackAction({
    signal: 'positive',
    whatWorked: 'Ran tests and included output before final response',
    tags: ['testing', 'verification'],
  });
  assert(fullPositive.type === 'store-learning', 'positive feedback creates store-learning action');

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

module.exports = {
  validateFeedbackMemory,
  resolveFeedbackAction,
  prepareForStorage,
  GENERIC_TAGS,
  MIN_CONTENT_LENGTH,
  VALID_TITLE_PREFIXES,
  VALID_CATEGORIES,
};

if (require.main === module && process.argv.includes('--test')) {
  runTests();
}
