import assert from 'node:assert/strict';
import test from 'node:test';
import { hashPassword, verifyPassword } from '../../lib/auth/password';
import { createSessionToken, hashSessionToken } from '../../lib/auth/session-token';

test('passwords use a salted, slow one-way representation', async () => {
  const password = 'A strong clinic passphrase 2026!';
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.equal(first.includes(password), false);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword('incorrect passphrase', first), false);
});

test('session tokens have high entropy and only their verifier is persisted', () => {
  const first = createSessionToken();
  const second = createSessionToken();
  assert.notEqual(first, second);
  assert.equal(Buffer.from(first, 'base64url').byteLength, 32);
  assert.equal(hashSessionToken(first).length, 64);
  assert.notEqual(hashSessionToken(first), first);
});
