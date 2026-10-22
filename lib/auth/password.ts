import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto';
const algorithm = 'scrypt';
const keyLength = 64;
const parameters = { N: 131_072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 } as const;

export async function hashPassword(password: string): Promise<string> {
  assertPasswordInput(password);
  const salt = randomBytes(16);
  const key = await derive(password, salt, parameters.N, parameters.r, parameters.p);
  return [algorithm, parameters.N, parameters.r, parameters.p, salt.toString('base64url'), key.toString('base64url')].join('$');
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  if (password.length === 0 || password.length > 1_024) return false;
  const [name, n, r, p, saltValue, keyValue, extra] = encodedHash.split('$');
  if (name !== algorithm || !n || !r || !p || !saltValue || !keyValue || extra) return false;

  const cost = Number(n);
  const blockSize = Number(r);
  const parallelism = Number(p);
  if (cost !== parameters.N || blockSize !== parameters.r || parallelism !== parameters.p) return false;

  try {
    const expected = Buffer.from(keyValue, 'base64url');
    if (expected.length !== keyLength) return false;
    const actual = await derive(password, Buffer.from(saltValue, 'base64url'), cost, blockSize, parallelism);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export async function performDummyPasswordCheck(password: string): Promise<void> {
  const dummyHash = [
    algorithm,
    parameters.N,
    parameters.r,
    parameters.p,
    Buffer.alloc(16).toString('base64url'),
    Buffer.alloc(keyLength).toString('base64url'),
  ].join('$');
  await verifyPassword(password || '\0', dummyHash);
}

function assertPasswordInput(password: string): void {
  if (password.length < 12 || password.length > 1_024) {
    throw new Error('Passwords must be between 12 and 1,024 characters.');
  }
}

async function derive(password: string, salt: Buffer, N: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(password.normalize('NFKC'), salt, keyLength, { N, r, p, maxmem: parameters.maxmem }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}
