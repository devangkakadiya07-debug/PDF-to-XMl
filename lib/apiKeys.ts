import crypto from 'crypto';

export function hashApiKey(key: string) {
  const pepper = process.env.API_KEY_HASH_SECRET ?? 'local-dev-pepper';
  return crypto.pbkdf2Sync(key, pepper, 100_000, 32, 'sha256').toString('hex');
}

export function maskApiKey(key: string) {
  const prefix = key.startsWith('test_') ? 'test_' : 'live_';
  return `${prefix}****${key.slice(-4)}`;
}

export function generateApiKey(environment: 'TEST' | 'LIVE') {
  const prefix = environment === 'TEST' ? 'test_' : 'live_';
  return `${prefix}${crypto.randomBytes(24).toString('hex')}`;
}

export function getBearerToken(authorization: string | null) {
  if (!authorization?.startsWith('Bearer ')) return null;
  return authorization.slice('Bearer '.length).trim();
}
