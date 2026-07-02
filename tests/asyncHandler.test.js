import test from 'node:test';
import assert from 'node:assert/strict';
import asyncHandler from '../src/utils/asyncHandler.js';

test('asyncHandler returns a structured error response for thrown errors', async () => {
  let statusCode = 200;
  let payload = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      payload = data;
    },
  };

  const handler = asyncHandler(async () => {
    throw new Error('boom');
  });

  await handler({}, res, () => {});

  assert.equal(statusCode, 500);
  assert.deepEqual(payload, {
    statusCode: 500,
    success: false,
    message: 'boom',
    errors: null,
  });
});
