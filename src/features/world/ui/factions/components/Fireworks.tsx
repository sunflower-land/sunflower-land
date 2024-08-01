import React, { useEffect } from "react";

import confetti from "canvas-confetti";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const Fireworks: React.FC = () => {
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    particleCount: 50,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 700);

    return () => clearInterval(interval);
  });

  return null;
};
