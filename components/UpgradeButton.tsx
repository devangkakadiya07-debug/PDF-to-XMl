'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';

export default function UpgradeButton() {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    initializePaddle({
      environment: 'production',
      token: 'live_7e0473196e825c0bd00d9b8f1f9',
    }).then((paddleInstance) => setPaddle(paddleInstance));
  }, []);

  const openCheckout = () => {
    paddle?.Checkout.open({
      items: [{ priceId: 'pri_01ksg247kj7f5m1j5nefq7gnqj', quantity: 1 }],
    });
  };

  return (
    <button
      className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      onClick={openCheckout}
    >
      Upgrade to Live
    </button>
  );
}
