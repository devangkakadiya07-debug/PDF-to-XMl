import { Environment, Paddle } from '@paddle/paddle-node-sdk';

function getPaddleEnvironment() {
  return process.env.PADDLE_ENVIRONMENT === 'sandbox'
    ? Environment.sandbox
    : Environment.production;
}

export function getPaddleServerClient() {
  const apiKey = process.env.PADDLE_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Paddle API key');
  }

  return new Paddle(apiKey, { environment: getPaddleEnvironment() });
}