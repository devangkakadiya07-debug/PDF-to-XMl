'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UpgradeButton() {
  const [paddle, setPaddle] = useState<Paddle>();
  const { user, isLoaded } = useUser(); // Pulls the active user session from Clerk

  useEffect(() => {
    initializePaddle({
      environment: 'production',
      token: 'live_7e0473196e825c0bd00d9b8f1f9',
    }).then((paddleInstance) => setPaddle(paddleInstance));
  }, []);

  const openCheckout = () => {
    // Extract the primary email from Clerk's user object
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      console.error('User email not found. Cannot proceed with checkout.');
      return;
    }

    paddle?.Checkout.open({
      items: [{ priceId: 'pri_01ksg247kj7f5m1j5nefq7gnqj', quantity: 1 }],
      // THIS IS THE FIX: Attaching the email to the transaction receipt
      customData: {
        email: email, 
      },
    });
  };

  return (
    <button
      className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      onClick={openCheckout}
      // Disable the button until both Paddle and the user data have finished loading
      disabled={!paddle || !isLoaded || !user} 
    >
      Upgrade to Live
    </button>
  );
}